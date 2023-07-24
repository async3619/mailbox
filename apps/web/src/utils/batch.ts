import { Fn } from "@utils/types";

interface BatchProcessorOptions<TData, TExecutorReturns, TComposedReturns> {
    timeout: number;
    composer?: (data: TData, ret: TExecutorReturns) => TComposedReturns;
}

interface DataQueueItem<TData, TComposedReturns> {
    data: TData;
    resolve: (result: TComposedReturns) => void;
    reject: (error: Error) => void;
}

export class BatchProcessor<TData, TExecutorReturns, TComposedReturns = TExecutorReturns> {
    private readonly options: BatchProcessorOptions<TData, TExecutorReturns, TComposedReturns>;
    private readonly executor: Fn<[TData[]], Promise<TExecutorReturns>>;
    private readonly queue: DataQueueItem<TData, TComposedReturns>[] = [];

    private timeout: NodeJS.Timeout | null = null;

    public constructor(
        executor: Fn<[TData[]], Promise<TExecutorReturns>>,
        options: BatchProcessorOptions<TData, TExecutorReturns, TComposedReturns>,
    ) {
        this.executor = executor;
        this.options = options;
    }

    public call(data: TData) {
        return new Promise<TComposedReturns>((resolve, reject) => {
            if (this.timeout !== null) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }

            this.queue.push({ data, resolve, reject });
            this.timeout = setTimeout(() => {
                this.process();
            }, this.options.timeout);
        });
    }

    private async process() {
        const data = [...this.queue];
        const args = data.map(item => item.data);
        this.queue.length = 0;

        try {
            const result = await this.executor(args);
            const composer = this.options.composer;
            let composedData: TComposedReturns[];
            if (composer) {
                composedData = args.map(item => composer(item, result));
            } else {
                composedData = data.map(() => result as unknown as TComposedReturns);
            }

            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                item.resolve(composedData[i]);
            }
        } catch (e) {
            if (!(e instanceof Error)) {
                throw e;
            }

            for (const item of data) {
                item.reject(e);
            }
        }
    }
}
