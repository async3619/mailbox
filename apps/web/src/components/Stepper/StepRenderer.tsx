import React from "react";
import { Transition, TransitionStatus } from "react-transition-group";
import { mergeRefs } from "react-merge-refs";

import { StepHolder } from "@components/Stepper/Stepper";
import { Root } from "@components/Stepper/StepRenderer.styles";
import { Step } from "@components/Stepper/types";
import useMeasure from "react-use-measure";

export interface StepRendererProps {
    stepHolder: StepHolder;
    onMoveNext: (step: Step, keyName?: string) => void;
    onHeightChange(height: number): void;
    onComplete?(): void;
}

const styles: Record<TransitionStatus, React.CSSProperties> = {
    entering: {
        opacity: 0,
        transform: "translateX(5%)",
    },
    entered: {
        opacity: 1,
        transform: "translateX(0)",
    },
    exiting: {
        opacity: 0,
        transform: "translateX(-5%)",
        pointerEvents: "none",
    },
    exited: {
        opacity: 0,
        transform: "translateX(-5%)",
        pointerEvents: "none",
    },
    unmounted: {
        opacity: 0,
        transform: "translateX(100%)",
    },
};

export const StepRenderer = ({ stepHolder, onMoveNext, onHeightChange, onComplete }: StepRendererProps) => {
    const nodeRef = React.useRef<HTMLDivElement>(null);
    const [measureRef, { height }] = useMeasure();
    const { step, show } = stepHolder;

    React.useEffect(() => {
        onHeightChange(height);
    }, [height, onHeightChange]);

    const moveNext = React.useCallback(
        (keyName?: string) => {
            onMoveNext(step, keyName);
        },
        [step, onMoveNext],
    );

    let content: React.ReactNode;
    if (step.type === "normal-step") {
        const { component: Component } = step;
        content = <Component step={step} moveNext={moveNext} onComplete={onComplete} />;
    } else if (step.type === "branched-step") {
        const { component: Component } = step;
        content = <Component step={step} moveNext={moveNext} onComplete={onComplete} />;
    }

    return (
        <Transition nodeRef={nodeRef} in={show} timeout={500}>
            {status => (
                <Root ref={mergeRefs([nodeRef, measureRef])} style={{ ...styles[status] }}>
                    {content}
                </Root>
            )}
        </Transition>
    );
};

StepRenderer.displayName = "StepRenderer";
