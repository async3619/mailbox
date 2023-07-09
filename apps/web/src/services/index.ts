import { MastodonAccountHydrator } from "@services/mastodon/account";
import { AccountHydrator, BaseAccount } from "@services/base/account";

const hydrators = [MastodonAccountHydrator];

export function hydrateAccount(json: string) {
    const parsedDataItems = JSON.parse(json);
    if (!Array.isArray(parsedDataItems)) {
        return [];
    }

    const result: AccountHydrator<BaseAccount<string>>[] = [];
    for (const dataItem of parsedDataItems) {
        for (const Hydrator of hydrators) {
            try {
                result.push(new Hydrator(dataItem));
            } catch {}
        }
    }

    return result;
}
