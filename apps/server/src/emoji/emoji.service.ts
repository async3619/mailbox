import _ from "lodash";
import { Repository } from "typeorm";
import { Fetcher } from "fetcher";
import { is } from "typia";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { CustomEmoji } from "@emoji/models/custom-emoji.model";
import { InstanceEmojis } from "@emoji/models/instance-emojis.dto";

import {
    MastodonAPIRoutes,
    MastodonEmojiData,
    MisskeyAPIRoutes,
    MisskeyEmojiData,
    MisskeyMetaData,
} from "@utils/types";

@Injectable()
export class EmojiService {
    private readonly invalidationPromises: Record<string, Promise<boolean>> = {};

    public constructor(
        @InjectRepository(CustomEmoji) private readonly customEmojiRepository: Repository<CustomEmoji>,
    ) {}

    private async getMastodonCustomEmojis(instanceUrl: string): Promise<CustomEmoji[]> {
        const mastodonFetcher = new Fetcher<MastodonAPIRoutes>(`https://${instanceUrl}`);
        const emojis: CustomEmoji[] = [];
        const rawEmojiData = await mastodonFetcher.fetchJson("/api/v1/custom_emojis", {
            method: "GET",
            throwOnHttpCodes: [404],
        });

        if (!is<MastodonEmojiData>(rawEmojiData)) {
            throw new Error("API endpoint returned invalid Mastodon Emoji API response");
        }

        for (const item of rawEmojiData) {
            const emoji = this.customEmojiRepository.create({
                code: item.shortcode,
                url: item.url,
                staticUrl: item.static_url,
                instance: instanceUrl,
            });

            emojis.push(emoji);
        }

        return emojis;
    }

    private async getMisskeyCustomEmojis(instanceUrl: string): Promise<CustomEmoji[]> {
        const misskeyFetcher = new Fetcher<MisskeyAPIRoutes>(`https://${instanceUrl}`);
        const rawEmojis: MisskeyEmojiData["emojis"] = [];

        try {
            const metadata = await misskeyFetcher.fetchJson("/api/meta", {
                method: "POST",
                throwOnHttpCodes: [404],
            });

            if (!is<MisskeyMetaData>(metadata)) {
                throw new Error("API endpoint returned invalid Misskey Meta API response");
            }

            if (metadata.emojis) {
                rawEmojis.push(...metadata.emojis);
            }
        } catch {
            const rawEmojiData = await misskeyFetcher.fetchJson("/api/emojis", {
                method: "POST",
                throwOnHttpCodes: [404],
                body: {},
            });

            if (!is<MisskeyEmojiData>(rawEmojiData)) {
                throw new Error("API endpoint returned invalid Misskey Emoji API response");
            }

            rawEmojis.push(...rawEmojiData.emojis);
        }

        return rawEmojis.map(item => {
            return this.customEmojiRepository.create({
                code: item.name,
                url: item.url,
                instance: instanceUrl,
            });
        });
    }

    private async invalidateEmojiFromInstance(instanceUrl: string) {
        const emojiFunctions = [
            this.getMastodonCustomEmojis.bind(this, instanceUrl),
            this.getMisskeyCustomEmojis.bind(this, instanceUrl),
        ];

        let emojis: CustomEmoji[] | null = null;
        const errors: Error[] = [];
        for (const getEmojis of emojiFunctions) {
            try {
                emojis = await getEmojis();
            } catch (e) {
                if (!(e instanceof Error)) {
                    throw e;
                }

                errors.push(e);
            }
        }

        if (emojis === null) {
            for (const error of errors) {
                console.error(error);
            }

            throw new Error(`Given instance url is not a valid Mastodon or Misskey instance: ${instanceUrl}`);
        }

        await this.customEmojiRepository.delete({ instance: instanceUrl });
        await this.customEmojiRepository.insert(emojis);

        return true;
    }

    public async invalidateEmojis(instanceUrls: string[]) {
        const promises: Array<Promise<boolean>> = [];
        for (const instanceUrl of instanceUrls) {
            let promise: Promise<boolean>;
            if (instanceUrl in this.invalidationPromises) {
                promise = this.invalidationPromises[instanceUrl];
            } else {
                promise = this.invalidateEmojiFromInstance(instanceUrl).then(() => {
                    delete this.invalidationPromises[instanceUrl];
                    return true;
                });
            }

            promises.push(promise);
            this.invalidationPromises[instanceUrl] = promise;
        }

        await Promise.all(promises);
        return true;
    }

    public async getEmojis(): Promise<InstanceEmojis[]> {
        const emojis = await this.customEmojiRepository.find();
        const instances: string[] = _.chain(emojis).map("instance").uniq().value();

        return instances.map(instance => {
            return {
                instance,
                emojis: emojis.filter(emoji => emoji.instance === instance),
            };
        });
    }
}
