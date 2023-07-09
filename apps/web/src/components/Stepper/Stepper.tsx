import React from "react";

import { StepRenderer } from "@components/Stepper/StepRenderer";

import { Step } from "@components/Stepper/types";
import { Root, StepContainer } from "@components/Stepper/Stepper.styles";

export interface StepperProps {
    step: Step;
    onComplete?: () => void;
}

export interface StepHolder {
    step: Step;
    show: boolean;
}

export function Stepper({ step, onComplete }: StepperProps) {
    const [steps, setSteps] = React.useState<StepHolder[]>([{ step, show: true }]);
    const [height, setHeight] = React.useState<number>(0);

    const handleHeightChange = React.useCallback((height: number) => {
        setHeight(height);
    }, []);

    const handleMoveNext = React.useCallback((step: Step, keyName?: string) => {
        setSteps(prevSteps => {
            let nextStep: Step | undefined;
            if (step.type === "branched-step" && keyName && step.branches) {
                nextStep = step.branches[keyName];
            } else if (step.type === "normal-step") {
                nextStep = step.next;
            }

            if (!nextStep) {
                throw new Error("Next step is not defined");
            }

            return [
                ...prevSteps.map(holder => ({
                    ...holder,
                    show: holder.step !== step,
                })),
                { step: nextStep, show: true },
            ];
        });
    }, []);

    return (
        <Root style={{ height }}>
            <StepContainer>
                {steps.map((holder, index) => (
                    <StepRenderer
                        key={index}
                        stepHolder={holder}
                        onMoveNext={handleMoveNext}
                        onComplete={onComplete}
                        onHeightChange={handleHeightChange}
                    />
                ))}
            </StepContainer>
        </Root>
    );
}
