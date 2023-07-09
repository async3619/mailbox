import React from "react";

import { BaseStep, BaseStepProps } from "@components/Stepper/BaseStep";
import { MoveNextFn, Step } from "@components/Stepper/types";

// These props will be injected into the base component
export interface WithStepProps<TStep extends Step> extends BaseStepProps<TStep> {}
export interface OuterProps<TStep extends Step = Step> {
    step: TStep;
    moveNext: MoveNextFn<TStep>;
    onComplete?(): void;
}

export const withStep =
    <TStep extends Step>() =>
    (BaseComponent: React.ComponentType<WithStepProps<TStep>>) => {
        type HocProps = WithStepProps<TStep> & OuterProps<TStep>;

        function Hoc({ step, moveNext, onComplete, ...restProps }: HocProps) {
            return (
                <BaseStep step={step}>
                    <BaseComponent
                        moveNext={moveNext}
                        onComplete={onComplete}
                        {...(restProps as unknown as HocProps)}
                    />
                </BaseStep>
            );
        }

        Hoc.displayName = `WithStep(${BaseComponent.name})`;
        Hoc.WrappedComponent = BaseComponent;

        return Hoc;
    };
