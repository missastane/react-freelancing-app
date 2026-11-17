
import React, { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import BaseDialog from "../../../common/BaseDialog";
import { useTranslation } from "react-i18next";

import { useAdminUser } from "../../../../hooks/admin/admin-user/useAdminUser";
import { useAdminUserOptions } from "../../../../hooks/admin/admin-user/useAdminUserOptions";
import { useSyncAdminUserRoles } from "../../../../hooks/admin/admin-user/useSyncAdminUserRoles";

import { useNotification } from "../../../../hooks/useNotification";

export default function ManageAdminRolesDialog({
    open,
    onClose,
    admin,
}) {
    const { t } = useTranslation();
    const { showNotification } = useNotification();

    const [selectedRoleIds, setSelectedRoleIds] = useState([]);

    // Queries
    const {
        data: adminResponse,
        isLoading: isAdminLoading,
        isError: isAdminError,
    } = useAdminUser(open ? admin?.id : null);

    const {
        data: optionsResponse,
        isLoading: isOptionsLoading,
        isError: isOptionsError,
    } = useAdminUserOptions();

    // Mutation
    const syncRolesMutation = useSyncAdminUserRoles();

    const adminDetails = adminResponse?.data;
    const roles = optionsResponse?.data?.roles ?? [];

    // Initialize selected roles from admin details
    useEffect(() => {
        if (!open || !adminDetails) return;

        setSelectedRoleIds(
            (adminDetails.roles ?? []).map((role) => Number(role.id))
        );
    }, [open, adminDetails]);

    const handleRoleChange = (roleId, checked) => {
        setSelectedRoleIds((previous) => {
            if (checked) {
                return [...previous, roleId];
            }

            return previous.filter((id) => id !== roleId);
        });
    };

    const handleClose = () => {
        if (syncRolesMutation.isPending) return;

        setSelectedRoleIds([]);
        onClose?.();
    };

    const handleSave = async () => {
        const adminRole = roles.find((role) => role.name === "admin");

        // Admin role must always be assigned.
        const roleIds = [
            ...new Set([
                ...selectedRoleIds,
                ...(adminRole ? [Number(adminRole.id)] : []),
            ]),
        ];

        try {
            const response = await syncRolesMutation.mutateAsync({
                adminId: admin.id,
                roles: roleIds,
            });

            showNotification(response.message, "success");
            setSelectedRoleIds([]);
            onClose?.();
        } catch (error) {
            showNotification(
                error?.response?.data?.message || t("common.generalError"),
                "error"
            );
        }
    };

    const isLoading = isAdminLoading || isOptionsLoading;
    const hasError = isAdminError || isOptionsError;


    return (
        <BaseDialog
            open={open}
            onClose={handleClose}
            title={t("admin.users.roles.title")}
            subtitle={`${admin?.first_name ?? ""} ${admin?.last_name ?? ""}`}
            icon={<SecurityRoundedIcon />}
            maxWidth="sm"
            iconColor="primary"
            actions={
                <>
                    <Button
                        onClick={handleClose}
                        disabled={syncRolesMutation.isPending}
                        sx={{
                            color: "text.secondary",
                            textTransform: "none",
                            fontWeight: 600,
                        }}
                    >
                        {t("common.cancel")}
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={
                            isLoading ||
                            hasError ||
                            roles.length === 0 ||
                            syncRolesMutation.isPending
                        }
                        startIcon={
                            syncRolesMutation.isPending ? (
                                <CircularProgress size={16} color="inherit" />
                            ) : null
                        }
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            px: 3,
                            borderRadius: 1.5,
                        }}
                    >
                        {t("common.save")}
                    </Button>
                </>
            }
        >
            {isLoading ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        py: 5,
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : hasError ? (
                <Alert severity="error">
                    {t("admin.users.roles.loadError")}
                </Alert>
            ) : roles.length === 0 ? (
                <Alert severity="info">
                    {t("admin.users.roles.empty")}
                </Alert>
            ) : (
                <Stack spacing={2}>
                    <Box>
                        <Typography variant="subtitle1" fontWeight={700}>
                            {t("admin.users.roles.available")}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            {t("admin.users.roles.description")}
                        </Typography>
                    </Box>

                    <Stack spacing={1}>
                        {roles.map((role) => {
                            const isAdminRole = role.name === "admin";
                            const roleId = Number(role.id);

                            const isChecked =
                                isAdminRole ||
                                selectedRoleIds.includes(roleId);

                            return (
                                <Paper
                                    key={role.id}
                                    variant="outlined"
                                    sx={{
                                        px: 2,
                                        py: 1,
                                        borderRadius: 2,
                                        borderColor: isChecked
                                            ? "primary.main"
                                            : "divider",
                                        bgcolor: isChecked
                                            ? "action.hover"
                                            : "background.paper",
                                        transition: "all 0.2s",
                                    }}
                                >
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                    >
                                        <FormControlLabel
                                            sx={{ flex: 1, mr: 0 }}
                                            control={
                                                <Checkbox
                                                    checked={isChecked}
                                                    disabled={isAdminRole}
                                                    onChange={(event) =>
                                                        handleRoleChange(
                                                            roleId,
                                                            event.target.checked
                                                        )
                                                    }
                                                />
                                            }
                                            label={
                                                <Typography
                                                    fontWeight={600}
                                                    color="text.primary"
                                                >
                                                    {role.name}
                                                </Typography>
                                            }
                                        />

                                        {isAdminRole && (
                                            <AdminPanelSettingsRoundedIcon
                                                color="primary"
                                                fontSize="small"
                                            />
                                        )}
                                    </Stack>
                                </Paper>
                            );
                        })}
                    </Stack>
                </Stack>
            )}
        </BaseDialog>
    );

}
