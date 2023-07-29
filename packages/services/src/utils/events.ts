export type EventMap = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: (...args: unknown[]) => unknown;
};

export class EventEmitter<TEventMap extends EventMap> {
    private readonly listeners: Map<keyof TEventMap, Set<TEventMap[keyof TEventMap]>> = new Map();

    public addEventListener<K extends keyof TEventMap>(eventName: K, listener: TEventMap[K]) {
        const listeners = this.listeners.get(eventName);
        if (listeners) {
            listeners.add(listener);
        } else {
            this.listeners.set(eventName, new Set([listener]));
        }
    }
    public removeEventListener<K extends keyof TEventMap>(eventName: K, listener: TEventMap[K]) {
        const listeners = this.listeners.get(eventName);
        if (listeners) {
            listeners.delete(listener);
        }
    }

    protected emit<K extends keyof TEventMap>(eventName: K, ...args: Parameters<TEventMap[K]>) {
        const listeners = this.listeners.get(eventName);
        if (listeners) {
            for (const listener of listeners) {
                listener(...args);
            }
        }
    }
}
