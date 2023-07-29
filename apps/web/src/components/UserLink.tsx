import React from "react";

import { PostAuthor } from "services";

import { Root } from "@components/UserLink.styles";

export interface UserLinkProps {
    user: PostAuthor;
    className?: string;
}

export function UserLink({ user, children, className }: React.PropsWithChildren<UserLinkProps>) {
    const [, userId] = user.accountId.split("@");

    return (
        <Root href={`https://${user.instanceUrl}/@${userId}`} className={className}>
            {children ?? user.accountName}
        </Root>
    );
}
