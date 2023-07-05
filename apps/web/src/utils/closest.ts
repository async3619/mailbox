export function getClosestIndex(arr: number[], value: number, backwards?: boolean) {
    const targets = arr.filter(item => (!backwards ? item > value : item < value));
    const min = backwards ? Math.max(...targets) : Math.min(...targets);

    return arr.indexOf(min);
}
