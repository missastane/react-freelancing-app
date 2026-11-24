
import { useState } from "react";

import { Button, Chip, Stack, Typography } from "@mui/material";
import { Delete } from "@mui/icons-material";

import { useTranslation } from "react-i18next";

import AccountSection from "./AccountSection";
import AccountRow from "./AccountRow";
import AccountDeletionDialog from "./AccountDeletionDialog";

import { useAuth } from "../../../context/AuthContext";
import { useCancelAccountDeletion } from "../../../hooks/profile/useAccountDeletion";
import { useConfirmDialog } from "../../../hooks/useConfirmDialog";
import { useNotification } from "../../../hooks/useNotification";

import { formatLocalizedDate } from "../../../utils/date";

export default function DeleteAccountSection() {
    const { t, i18n } = useTranslation();

    const { user } = useAuth();
    const { confirm } = useConfirmDialog();
    const { showNotification } = useNotification();

    const [dialogOpen, setDialogOpen] = useState(false);

    const cancelMutation = useCancelAccountDeletion();

    const deletionRequest = user?.account_deletion_request;

    const handleCancelRequest = async () => {
        const confirmed = await confirm({
            title: t("settings.account.accountDeletion.confirm.cancelTitle"),
            message: t("settings.account.accountDeletion.confirm.cancelMessage"),
            description: t("settings.account.accountDeletion.confirm.cancelDescription"),
            confirmText: t("settings.account.accountDeletion.confirm.cancelAction"),
            cancelText: t("common.cancel"),
            confirmColor: "error",
            icon: <Delete />,
        });

        if (!confirmed) return;

        try {
            const response = await cancelMutation.mutateAsync();

            showNotification(response.message, "success");
        } catch (error) {
            showNotification(
                error?.response?.data?.message || t("common.generalError"),
                "error"
            );
        }
    };

    return (
        <>
            <AccountSection
                title={t("settings.account.accountDeletion.section.title")}
                subtitle={t("settings.account.accountDeletion.section.subtitle")}
                right={
                    <Chip
                        size="small"
                        color={deletionRequest ? "warning" : "default"}
                        label={
                            deletionRequest
                                ? t("settings.account.accountDeletion.section.pending")
                                : t("settings.account.accountDeletion.section.badge")
                        }
                    />
                }
            >
                <Stack spacing={2}>
                    {deletionRequest ? (
                        <>
                            <AccountRow
                                title={t("settings.account.accountDeletion.section.pendingTitle")}
                                desc={t("settings.account.accountDeletion.section.pendingDescription")}
                                action={
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={handleCancelRequest}
                                        disabled={cancelMutation.isPending}
                                    >
                                        {t("settings.account.accountDeletion.section.cancelButton")}
                                    </Button>
                                }
                            />

                            <Typography variant="body2" color="text.secondary">
                                {t("settings.account.accountDeletion.section.scheduledFor", {
                                    date: formatLocalizedDate(
                                        deletionRequest.scheduled_for,
                                        i18n.language
                                    ),
                                })}
                            </Typography>
                        </>
                    ) : (
                        <AccountRow
                            title={t("settings.account.accountDeletion.section.rowTitle")}
                            desc={t("settings.account.accountDeletion.section.rowDescription")}
                            action={
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => setDialogOpen(true)}
                                >
                                    {t("settings.account.accountDeletion.section.button")}
                                </Button>
                            }
                        />
                    )}
                </Stack>
            </AccountSection>

            <AccountDeletionDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
            />
        </>
    );
}
