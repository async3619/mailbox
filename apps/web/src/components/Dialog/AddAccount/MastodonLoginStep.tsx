import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "next-i18next";
import { Button } from "ui";
import * as yup from "yup";
import isUrl from "is-url";

import { yupResolver } from "@hookform/resolvers/yup";
import { Box, TextField, Typography } from "@mui/material";

import { withStep } from "@components/Stepper/withStep";

import { MastodonAuth } from "services";

interface MastodonLoginStepValues {
    instanceUrl: string;
}

const MASTODON_LOGIN_FORM_SCHEMA = yup.object().shape({
    instanceUrl: yup
        .string()
        .required("Please type your Mastodon instance URL")
        .test("is-valid-url", "Please type valid URL", value => isUrl(`https://${value}`)),
});

export const MastodonLoginStep = withStep()(() => {
    const { t } = useTranslation();
    const [submitting, setSubmitting] = React.useState(false);
    const { formState, handleSubmit, control } = useForm<MastodonLoginStepValues>({
        mode: "all",
        resolver: yupResolver(MASTODON_LOGIN_FORM_SCHEMA),
        defaultValues: {
            instanceUrl: "",
        },
    });

    const onSubmit: SubmitHandler<MastodonLoginStepValues> = async values => {
        const auth = new MastodonAuth(values.instanceUrl);
        const data = await auth.createApplication(
            "mailbox",
            "https://mailbox.sophia-dev.io/",
            "read write follow",
            "https://mailbox.sophia-dev.io/",
        );

        auth.redirectLogin(data);
    };

    React.useEffect(() => {
        if (!formState.isSubmitting) {
            return;
        }

        setSubmitting(formState.isSubmitting);
    }, [formState.isSubmitting]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="body1" color="text.secondary">
                {t("actions.addAccount.mastodon.description")}
            </Typography>
            <Box mt={2}>
                <Controller
                    control={control}
                    name="instanceUrl"
                    render={({ field, fieldState }) => (
                        <TextField
                            size="small"
                            fullWidth
                            label={t("actions.addAccount.mastodon.placeholder")}
                            placeholder="masdoton.social"
                            autoComplete="off"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            disabled={submitting}
                            {...field}
                        />
                    )}
                />
            </Box>
            <Box mt={1}>
                <Button type="submit" fullWidth variant="contained" disabled={!formState.isValid} loading={submitting}>
                    {t("actions.addAccount.mastodon.action")}
                </Button>
            </Box>
        </form>
    );
});
