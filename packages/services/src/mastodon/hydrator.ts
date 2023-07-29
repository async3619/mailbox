import { AccountHydrator } from "../base";
import { MastodonAccount, SERIALIZED_MASTODON_ACCOUNT, SerializedMastodonAccount } from "./account";

export class MastodonAccountHydrator extends AccountHydrator<MastodonAccount, SerializedMastodonAccount> {
    public hydrate(): Promise<MastodonAccount> {
        const { token } = this.rawData;

        return MastodonAccount.create(this.rawData.instanceUrl, token);
    }

    public validate(data: Record<string, unknown>): data is SerializedMastodonAccount {
        return SERIALIZED_MASTODON_ACCOUNT.safeParse(data).success;
    }
}
