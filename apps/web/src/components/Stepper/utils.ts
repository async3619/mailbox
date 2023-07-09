import { BranchedStep, NormalStep } from "@components/Stepper/types";

export function createBranchedStep<BranchNames extends string>(
    step: Omit<BranchedStep<BranchNames>, "type">,
): BranchedStep<BranchNames> {
    return {
        ...step,
        type: "branched-step",
    };
}

export function createNormalStep(step: Omit<NormalStep, "type">): NormalStep {
    return {
        type: "normal-step",
        ...step,
    };
}
