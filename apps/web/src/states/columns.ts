import { atom, useRecoilState } from "recoil";
import React from "react";

export interface ColumnInstance {
    id: string;
}

export const columnState = atom<ColumnInstance[]>({
    key: "columnState",
    default: [],
});

export const columnNodeState = atom<Record<ColumnInstance["id"], HTMLElement>>({
    key: "columnNodeState",
    default: {},
});

export function useColumnNodes() {
    const [columnNodes] = useRecoilState(columnNodeState);

    return columnNodes;
}

export function useColumnNodeSetter(id: ColumnInstance["id"]) {
    const [, setColumnNodes] = useRecoilState(columnNodeState);

    return React.useCallback(
        (node?: HTMLElement | null) => {
            if (!node) {
                return;
            }

            setColumnNodes(prev => ({
                ...prev,
                [id]: node,
            }));
        },
        [id, setColumnNodes],
    );
}
