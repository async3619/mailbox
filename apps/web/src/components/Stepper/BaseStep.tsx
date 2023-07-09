import React from "react";

import { MoveNextFn, Step } from "@components/Stepper/types";
import { Root } from "@components/Stepper/BaseStep.styles";

export interface BaseStepProps<TStep extends Step = Step> {
    moveNext: MoveNextFn<TStep>;
    onComplete?(): void;
}

export interface Props<TStep extends Step> {
    step: TStep;
    children: React.ReactNode;
}

export const BaseStep = React.forwardRef(
    <TStep extends Step>({ children }: Props<TStep>, ref: React.Ref<HTMLDivElement>) => (
        <Root ref={ref}>{children}</Root>
    ),
);

BaseStep.displayName = "BaseStep";
