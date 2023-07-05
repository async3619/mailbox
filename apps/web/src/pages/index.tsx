import { useRecoilState } from "recoil";

import { ColumnContainer } from "@components/Column/Container";

import { columnState } from "@states/columns";
import { installRouteMiddleware } from "@utils/routes/middleware";

export default function Index() {
    const [columns, setColumns] = useRecoilState(columnState);

    return <ColumnContainer columns={columns} setColumns={setColumns} />;
}

export const getServerSideProps = installRouteMiddleware()();
