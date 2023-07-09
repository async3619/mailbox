import React from "react";
import { OuterProps } from "@components/Stepper/withStep";

export interface BaseStep {}

export interface NormalStep extends BaseStep {
    type: "normal-step";
    next?: Step;
    component: React.ComponentType<OuterProps<NormalStep>>;
}
export interface BranchedStep<BranchNames extends string> extends BaseStep {
    type: "branched-step";
    branches?: Record<BranchNames, Step>;
    component: React.ComponentType<OuterProps<BranchedStep<string>>>;
}

export type Step<BranchNames extends string = string> = NormalStep | BranchedStep<BranchNames>;

export type MoveNextFn<TStep extends Step> = TStep extends BranchedStep<infer K> ? (branch: K) => void : () => void;
export type BranchNames<TStep extends Step> = TStep extends BranchedStep<infer BranchNames> ? BranchNames : never;
