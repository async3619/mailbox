import { ColumnSize } from "@components/Column/types";

export const DRAWER_WIDTH = 80;
export const COLUMN_SIDEBAR_WIDTH = 280;

export const COLUMN_SIZE_MAP: Record<ColumnSize, number> = {
    [ColumnSize.Small]: 320,
    [ColumnSize.Medium]: 480,
    [ColumnSize.Large]: 640,
};
