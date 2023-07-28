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
    <TProps extends WithStepProps<TStep>>(BaseComponent: React.ComponentType<TProps>) => {
        type HocProps = TProps & OuterProps<TStep>;

        function Hoc({ step, moveNext, onComplete, ...restProps }: HocProps) {
            return (
                <BaseStep step={step}>
                    <BaseComponent
                        {...(restProps as unknown as HocProps)}
                        onComplete={onComplete}
                        moveNext={moveNext}
                    />
                </BaseStep>
            );
        }

        Hoc.displayName = `WithStep(${BaseComponent.name})`;
        Hoc.WrappedComponent = BaseComponent;

        return Hoc;
    };
