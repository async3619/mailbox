import React from "react";
import { useInView } from "react-intersection-observer";

import { Box, CircularProgress } from "@mui/material";

export interface IntersectionLoaderProps {
    onLoadMore(): void;
}

export function IntersectionLoader({ onLoadMore }: IntersectionLoaderProps) {
    const { ref, inView } = useInView();
    const lastInView = React.useRef(false);

    React.useEffect(() => {
        if (!inView || lastInView.current === inView) {
            return;
        }

        lastInView.current = inView;
        onLoadMore();
    }, [inView, onLoadMore]);

    return (
        <Box ref={ref} p={2} display="flex" justifyContent="center">
            <CircularProgress size={24} />
        </Box>
    );
}
