import React from "react";
import { Avatar } from "ui";

import { Box, SvgIconProps, Typography } from "@mui/material";

import { BaseAccount } from "@services/base/account";
import { MastodonAccount } from "@services/mastodon/account";

import { MastodonLogo } from "@components/Svg/Mastodon";
import { EmojiText } from "@components/EmojiText";
import { Root } from "@components/AccountHeader.styles";

export interface AccountHeaderProps {
    titleText: string;
    titleWeight?: number;
    account?: BaseAccount<string>;
    avatarSize?: "small" | "medium";
}

const SERVICE_TYPE_TO_ICON: Record<string, React.ComponentType<SvgIconProps>> = {
    mastodon: MastodonLogo,
};

export function AccountHeader({ account, titleText, avatarSize = "medium", titleWeight = 600 }: AccountHeaderProps) {
    let headerLogo: React.ReactNode | null = null;
    if (account) {
        const serviceType = account.getServiceType();
        const ServiceIcon = SERVICE_TYPE_TO_ICON[serviceType];
        if (ServiceIcon) {
            headerLogo = <ServiceIcon fontSize="inherit" />;
        }
    }

    let displayName: React.ReactNode = account?.getDisplayName() ?? null;
    if (account instanceof MastodonAccount) {
        const instanceUrl = account.getInstanceUrl();
        if (instanceUrl) {
            displayName = <EmojiText instanceUrl={instanceUrl}>{account.getDisplayName()}</EmojiText>;
        }
    }

    return (
        <Root>
            {account && (
                <Box mr={1}>
                    <Avatar size={avatarSize} src={account.getAvatarUrl()} />
                </Box>
            )}
            <Box minWidth={0} display="flex" flexDirection="column" justifyContent="center">
                <Typography
                    variant="h6"
                    fontSize="0.95rem"
                    fontWeight={titleWeight}
                    lineHeight={1}
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    sx={{ mb: account ? 0.5 : 0 }}
                >
                    {titleText}
                </Typography>
                {account && (
                    <Typography
                        variant="body2"
                        fontSize="0.8rem"
                        color="text.secondary"
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                    >
                        {headerLogo} {displayName}
                    </Typography>
                )}
            </Box>
        </Root>
    );
}
