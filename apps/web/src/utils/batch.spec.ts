import { BatchProcessor } from "@utils/batch";

describe("BatchProcessor class", () => {
    it("should be able to process data", async () => {
        const executor = jest.fn(async (data: number[]) => {
            return data.map(item => item * 2);
        });

        const batchProcessor = new BatchProcessor(executor, { timeout: 100 });
        const result = await batchProcessor.call(1);

        expect(result).toEqual([2]);
    });

    it("should be able to process data (with composer)", async () => {
        const executor = jest.fn(async (data: number[]) => {
            const result: Record<number, number> = {};
            for (const item of data) {
                result[item] = item * 2;
            }

            return result;
        });

        const batchProcessor = new BatchProcessor(executor, {
            timeout: 100,
            composer: (data, ret) => ret[data],
        });

        const result = await batchProcessor.call(1);

        expect(result).toEqual(2);
    });

    it("should be able to process data in batches", async () => {
        const executor = jest.fn(async (data: number[]) => {
            const result: Record<number, number> = {};
            for (const item of data) {
                result[item] = item * 2;
            }

            return result;
        });

        const batchProcessor = new BatchProcessor(executor, { timeout: 100, composer: (data, ret) => ret[data] });
        const result = await Promise.all([batchProcessor.call(1), batchProcessor.call(2)]);

        expect(result).toEqual([2, 4]);
    });

    it("should reject all promises if executor throws", async () => {
        const executor = jest.fn(async () => {
            throw new Error("test");
        });

        const batchProcessor = new BatchProcessor(executor, { timeout: 100 });
        const result = await Promise.allSettled([batchProcessor.call(1), batchProcessor.call(2)]);

        expect(result).toEqual([
            { status: "rejected", reason: new Error("test") },
            { status: "rejected", reason: new Error("test") },
        ]);
    });
});
