import { EventEmitter } from "./events";

export interface SetEventMap<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: (...args: any[]) => unknown;

    add: (value: T) => void;
    delete: (value: T) => void;
}

export class ObservableSet<T> extends EventEmitter<SetEventMap<T>> {
    private readonly set: Set<T>;

    public constructor(values?: readonly T[] | null) {
        super();

        this.set = new Set(values);
    }

    public add(value: T) {
        this.set.add(value);
        this.emit("add", value);
    }
    public delete(value: T) {
        this.set.delete(value);
        this.emit("delete", value);
    }

    public has(value: T) {
        return this.set.has(value);
    }
}
