import React from "react";
import { SwiperSlide } from "swiper/react";
import { Swiper as SwiperClass } from "swiper";

import { IconButton } from "ui";

import { Backdrop, useTheme } from "@mui/material";
import FullscreenRoundedIcon from "@mui/icons-material/FullscreenRounded";
import FullscreenExitRoundedIcon from "@mui/icons-material/FullscreenExitRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import { PostAttachment } from "@services/base/timeline";

import { MediaViewerItem } from "@components/Media/ViewerItem";
import { Container, Content, Controls, Navigator, Root, SwiperRoot } from "@components/Media/Viewer.styles";

import { stopPropagation } from "@utils/stopPropagation";

export interface MediaViewerProps {
    open: boolean;
    attachments: PostAttachment[];
    index: number;
    onIndexChange?: (index: number) => void;
    onClose?: () => void;
    onClosed?: () => void;
}

export function MediaViewer({ attachments, onClose, onClosed, index, open, onIndexChange }: MediaViewerProps) {
    const theme = useTheme();
    const [swiper, setSwiper] = React.useState<SwiperClass | null>(null);
    const [mediaExpanded, setMediaExpanded] = React.useState(false);

    const toggleMediaExpanded = React.useCallback(() => {
        setMediaExpanded(prev => !prev);
    }, []);

    React.useEffect(() => {
        if (!swiper) {
            return;
        }

        swiper.slideTo(index, theme.transitions.duration.standard);
    }, [index, swiper, theme]);

    const handleSlideNext = React.useCallback(
        (e?: React.SyntheticEvent) => {
            if (index >= attachments.length - 1) {
                return;
            }

            onIndexChange?.(index + 1);
            e?.preventDefault();
            e?.stopPropagation();
        },
        [index, onIndexChange, attachments],
    );
    const handleSlidePrev = React.useCallback(
        (e?: React.SyntheticEvent) => {
            if (index <= 0) {
                return;
            }

            onIndexChange?.(index - 1);
            e?.preventDefault();
            e?.stopPropagation();
        },
        [index, onIndexChange],
    );

    React.useEffect(() => {
        const keydownHandler = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose?.();
            }

            if (e.key === "ArrowLeft") {
                handleSlidePrev();
            }

            if (e.key === "ArrowRight") {
                handleSlideNext();
            }
        };

        window.addEventListener("keydown", keydownHandler);

        return () => {
            window.removeEventListener("keydown", keydownHandler);
        };
    }, [handleSlideNext, handleSlidePrev, onClose]);

    const canSlideNext = index < attachments.length - 1;
    const canSlidePrev = index > 0;

    return (
        <Backdrop
            open={open}
            onClick={onClose}
            onExited={onClosed}
            sx={{
                zIndex: theme => theme.zIndex.drawer + 1,
            }}
        >
            <Root>
                <Content>
                    <Container>
                        <Navigator disabled={!canSlidePrev} onClick={handleSlidePrev}>
                            <ChevronLeftRoundedIcon fontSize="large" />
                        </Navigator>
                        <SwiperRoot onSwiper={setSwiper}>
                            {attachments.map((attachment, i) => (
                                <SwiperSlide key={i}>
                                    <MediaViewerItem
                                        attachment={attachment}
                                        active={index === i && open}
                                        expanded={mediaExpanded}
                                    />
                                </SwiperSlide>
                            ))}
                        </SwiperRoot>
                        <Navigator disabled={!canSlideNext} onClick={handleSlideNext}>
                            <ChevronRightRoundedIcon fontSize="large" />
                        </Navigator>
                    </Container>
                </Content>
                <Controls onClick={stopPropagation}>
                    <IconButton
                        color="inherit"
                        onClick={toggleMediaExpanded}
                        tooltip={mediaExpanded ? "Shrink Media" : "Expand Media"}
                        size="large"
                    >
                        {mediaExpanded ? <FullscreenExitRoundedIcon /> : <FullscreenRoundedIcon />}
                    </IconButton>
                </Controls>
            </Root>
        </Backdrop>
    );
}
