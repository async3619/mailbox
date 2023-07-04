import { installRouteMiddleware } from "@utils/routes/middleware";

export default function Index() {
    return <div>Hello World!</div>;
}

export const getServerSideProps = installRouteMiddleware()();
