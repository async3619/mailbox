import { BaseTimeline } from "@services/base/timeline";

export abstract class BaseAccount<
    TServiceType extends string,
    TRawData extends Record<string, unknown> = Record<string, unknown>,
    TTimeline extends BaseTimeline<unknown> = BaseTimeline<unknown>,
> {
    private readonly serviceType: TServiceType;

    protected constructor(serviceType: TServiceType) {
        this.serviceType = serviceType;
    }

    public getServiceType() {
        return this.serviceType;
    }

    public abstract getUniqueId(): string;
    public abstract getUserId(): string;
    public abstract getDisplayName(): string;
    public abstract getAvatarUrl(): string;

    public abstract getTimeline(): TTimeline;

    public abstract serialize(): TRawData;
}

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
