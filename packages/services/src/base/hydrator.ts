import { BaseAccount } from "./account";

export abstract class AccountHydrator<
    TAccount extends BaseAccount<string, TRawData>,
    TRawData extends Record<string, unknown> = Record<string, unknown>,
> {
    protected readonly rawData: Readonly<TRawData>;

    public constructor(data: Record<string, unknown>) {
        if (!this.validate(data)) {
            throw new Error("Invalid data");
        }

        this.rawData = data;
    }

    public abstract validate(data: Record<string, unknown>): data is TRawData;
    public abstract hydrate(): Promise<TAccount>;
}
