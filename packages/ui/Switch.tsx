import * as React from "react";
import { ButtonGroup, Button, ButtonGroupProps } from "@mui/material";

interface Props<TData extends Record<string, string>> extends Omit<ButtonGroupProps, "onChange"> {
    options: TData;
    value: keyof TData;
    onChange?(value: keyof TData): void;
}

export const Switch = <TData extends Record<string, string>>({ value, options, onChange, ...rest }: Props<TData>) => {
    const entries = Object.entries(options);
    const handleChange = React.useCallback(
        (val: keyof TData) => {
            onChange?.(val);
        },
        [onChange],
    );

    return (
        <ButtonGroup variant="outlined" {...rest}>
            {entries.map(([val, label]) => (
                <Button
                    disableElevation
                    key={val}
                    variant={value === val ? "contained" : undefined}
                    onClick={() => handleChange(val)}
                >
                    {label}
                </Button>
            ))}
        </ButtonGroup>
    );
};
