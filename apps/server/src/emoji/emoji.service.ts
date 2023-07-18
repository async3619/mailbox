import _ from "lodash";
import { Repository } from "typeorm";
import { APIRouteMap, Fetcher, Route } from "fetcher";
import { is } from "typia";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { CustomEmoji } from "@emoji/models/custom-emoji.model";
import { InstanceEmojis } from "@emoji/models/instance-emojis.dto";

export type MastodonEmojiData = Array<{ shortcode: string; url: string; static_url: string }>;
export interface MisskeyEmojiData {
    emojis: Array<{ name: string; category: string | null; url: string }>;
}

interface MastodonAPIRoutes extends APIRouteMap {
    "/api/v1/custom_emojis": Route<never, MastodonEmojiData>;
}
interface MisskeyAPIRoutes extends APIRouteMap {
    "/api/emojis": Route<Record<string, never>, MisskeyEmojiData>;
}

@Injectable()
export class EmojiService {
    public constructor(
        @InjectRepository(CustomEmoji) private readonly customEmojiRepository: Repository<CustomEmoji>,
    ) {}

    private async getMastodonCustomEmojis(instanceUrl: string): Promise<CustomEmoji[]> {
        const mastodonFetcher = new Fetcher<MastodonAPIRoutes>(`https://${instanceUrl}`);
        const emojis: CustomEmoji[] = [];
        const rawEmojiData = await mastodonFetcher.fetchJson("/api/v1/custom_emojis");

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
        const emojis: CustomEmoji[] = [];
        const rawEmojiData = await misskeyFetcher.fetchJson("/api/emojis", {
            method: "POST",
            body: {},
        });

        if (!is<MisskeyEmojiData>(rawEmojiData)) {
            throw new Error("API endpoint returned invalid Misskey Emoji API response");
        }

        for (const item of rawEmojiData.emojis) {
            const emoji = this.customEmojiRepository.create({
                code: item.name,
                url: item.url,
                instance: instanceUrl,
            });

            emojis.push(emoji);
        }

        return emojis;
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

            throw new Error("Given instance url is not a valid Mastodon or Misskey instance");
        }

        await this.customEmojiRepository.delete({ instance: instanceUrl });
        await this.customEmojiRepository.insert(emojis);

        return true;
    }

    public async invalidateEmojis(instanceUrls: string[]) {
        await Promise.all(instanceUrls.map(instanceUrl => this.invalidateEmojiFromInstance(instanceUrl)));

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
