import React from "react";

import { Button } from "ui";

import RepeatRoundedIcon from "@mui/icons-material/RepeatRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";

import { useColumn } from "@components/Column/context";

import { Root } from "@components/Timeline/ItemReaction.styles";

export interface TimelineItemReactionProps {}

export const TimelineItemReaction = React.memo(({}: TimelineItemReactionProps) => {
    const { account } = useColumn();

    return (
        <Root data-testid="root">
            <Button minimal size="small" color="inherit" tooltip="Reply">
                <ReplyRoundedIcon fontSize="inherit" />
            </Button>
            <Button minimal size="small" color="inherit" tooltip="Repost">
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
