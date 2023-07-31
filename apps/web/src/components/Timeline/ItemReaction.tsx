import React from "react";
import { Button } from "ui";
import { PostUpdateType, TimelinePost } from "services";

import RepeatRoundedIcon from "@mui/icons-material/RepeatRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";

import { useColumn } from "@components/Column/context";

import { Root } from "@components/Timeline/ItemReaction.styles";

export interface TimelineItemReactionProps {
    post: TimelinePost;
}

export const TimelineItemReaction = React.memo(({ post }: TimelineItemReactionProps) => {
    const { account } = useColumn();
    const [isReposted, setIsReposted] = React.useState(post.reposted ?? false);
    const targetId = post.originId ?? post.id;

    React.useEffect(() => {
        const handlePostStateChange = (id: string, type: PostUpdateType) => {
            if (id !== targetId) {
                return;
            }

            switch (type) {
                case "reblog":
                    setIsReposted(true);
                    break;

                case "unreblog":
                    setIsReposted(false);
                    break;
            }
        };

        const targetAccount = account;
        if (!targetAccount) {
            return;
        }

        targetAccount.addEventListener("post-state-update", handlePostStateChange);

        return () => {
            targetAccount.removeEventListener("post-state-update", handlePostStateChange);
        };
    }, [account, targetId]);

    const handleRepostClick = React.useCallback(async () => {
        if (!account) {
            return;
        }

        if (isReposted) {
            await account.cancelRepost(post);
        } else {
            await account.repost(post);
        }
    }, [account, isReposted, post]);

    return (
        <Root data-testid="root">
            <Button minimal size="small" color="inherit" tooltip="Reply">
                <ReplyRoundedIcon fontSize="inherit" />
            </Button>
            <Button
                minimal
                size="small"
                color={isReposted ? "primary" : "inherit"}
                tooltip="Repost"
                onClick={handleRepostClick}
                aria-pressed={isReposted}
            >
                <RepeatRoundedIcon fontSize="inherit" />
            </Button>
            <Button minimal size="small" color="inherit" tooltip="Favorite">
                <FavoriteRoundedIcon fontSize="inherit" />
            </Button>
            <Button minimal size="small" color="inherit" tooltip="Bookmark">
                <BookmarkRoundedIcon fontSize="inherit" />
            </Button>
            <Button minimal size="small" color="inherit" tooltip="More">
                <MoreHorizRoundedIcon fontSize="inherit" />
            </Button>
        </Root>
    );
});

TimelineItemReaction.displayName = "TimelineItemReaction";
