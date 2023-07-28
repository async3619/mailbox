import { EventEmitter } from "@utils/events";

describe("EventEmitter class", () => {
    it("should be able to register event listener", () => {
        const eventEmitter = new EventEmitter();
        const listener = jest.fn();

        eventEmitter.addEventListener("test", listener);

        expect(eventEmitter["listeners"].get("test")).toBeDefined();
        expect(eventEmitter["listeners"].get("test")?.has(listener)).toBe(true);

        eventEmitter.addEventListener("test", listener);

        expect(eventEmitter["listeners"].get("test")?.size).toBe(1);
    });

    it("should be able to remove event listener", () => {
        const eventEmitter = new EventEmitter();
        const listener = jest.fn();

        eventEmitter.addEventListener("test", listener);
        eventEmitter.removeEventListener("test", listener);

        expect(eventEmitter["listeners"].get("test")?.has(listener)).toBeFalsy();
    });

    it("should be able to emit event", () => {
        class MockClient extends EventEmitter<{
            test: () => void;
        }> {
            public emitTest() {
                this.emit("test");
            }
        }

        const eventEmitter = new MockClient();
        const listener = jest.fn();

        eventEmitter.addEventListener("test", listener);
        eventEmitter.emitTest();

        expect(listener).toHaveBeenCalled();
    });
});
