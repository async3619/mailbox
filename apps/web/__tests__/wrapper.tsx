import { ColumnContext } from "@components/Column/context";
import { ColumnInstance } from "@components/Column/types";

export function Wrapper({ children }: React.PropsWithChildren) {
    return <ColumnContext.Provider value={{ column: {} as ColumnInstance }}>{children}</ColumnContext.Provider>;
}
