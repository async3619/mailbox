import React from "react";
import { OuterProps } from "@components/Stepper/withStep";

export interface BaseStep {
    component: React.ComponentType<OuterProps>;
}

export interface NormalStep extends BaseStep {
    type: "normal-step";
    next?: Step;
}
export interface BranchedStep<BranchNames extends string> extends BaseStep {
    type: "branched-step";
    branches?: Record<BranchNames, Step>;
}

export type Step<BranchNames extends string = string> = NormalStep | BranchedStep<BranchNames>;

export type MoveNextFn<TStep extends Step> = TStep extends BranchedStep<infer K> ? (branch: K) => void : () => void;
export type BranchNames<TStep extends Step> = TStep extends BranchedStep<infer BranchNames> ? BranchNames : never;
