import { ColumnContext } from "@components/Column/context";
import { ColumnInstance } from "@components/Column/types";
import { TestAccount } from "./account";

interface WrapperProps {
    children: React.ReactNode;
    account?: TestAccount | null;
}

export function Wrapper({ children, account = new TestAccount() }: WrapperProps) {
    return (
        <ColumnContext.Provider value={{ column: {} as ColumnInstance, account }}>{children}</ColumnContext.Provider>
    );
}
