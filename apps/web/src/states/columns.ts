import shortid from "shortid";
import { atom, useRecoilState } from "recoil";
import React from "react";
import { RecoilEnv } from "recoil";

import { ColumnInstance } from "@components/Column/types";

import { persistAtom } from "@states/index";

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

export const columnState = atom<ColumnInstance[]>({
    key: "columnState",
    default: [],
    effects: [persistAtom],
});
export const columnNodeState = atom<Record<ColumnInstance["id"], HTMLElement>>({
    key: "columnNodeState",
    default: {},
});

export function useColumns() {
    const [columns, setColumns] = useRecoilState(columnState);
    const addColumns = React.useCallback(
        (...newColumns: Omit<ColumnInstance, "id">[]) => {
            setColumns(prev => [...prev, ...newColumns.map(c => ({ ...c, id: shortid() }))]);
        },
        [setColumns],
    );

    return {
        columns,
        setColumns,
        addColumns,
    };
}

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

            setColumnNodes(prev => ({ ...prev, [id]: node }));
        },
        [id, setColumnNodes],
    );
}
