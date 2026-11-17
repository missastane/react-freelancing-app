
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
import BaseDialog from "../../../common/BaseDialog";
import { useTranslation } from "react-i18next";

import { useAdminRole } from "../../../../hooks/admin/role/useAdminRole";
import { useAdminUserOptions } from "../../../../hooks/admin/admin-user/useAdminUserOptions";
import { useSyncRolePermissions } from "../../../../hooks/admin/role/useSyncRolePermissions";

import { useNotification } from "../../../../hooks/useNotification";

export default function ManageRolePermissionsDialog({
    open,
    onClose,
    role,
}) {
    const { t } = useTranslation();
    const { showNotification } = useNotification();

    const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);

    // Queries
    const {
        data: roleResponse,
        isLoading: isRoleLoading,
        isError: isRoleError,
    } = useAdminRole(open ? role?.id : null);

    const {
        data: optionsResponse,
        isLoading: isOptionsLoading,
        isError: isOptionsError,
    } = useAdminUserOptions();

    // Mutation
    const syncPermissionsMutation = useSyncRolePermissions();

    const roleDetails =
        roleResponse?.data?.data ??
        roleResponse?.data ??
        roleResponse;

    const permissions = optionsResponse?.data?.permissions ?? [];

    // Initialize selected permissions from role details
    useEffect(() => {
        if (!open || !roleDetails) return;

        setSelectedPermissionIds(
            (roleDetails.permissions ?? []).map((permission) =>
                Number(permission.id)
            )
        );
    }, [open, roleDetails]);

    const handlePermissionChange = (permissionId, checked) => {
        setSelectedPermissionIds((previous) => {
            if (checked) {
                return [...new Set([...previous, permissionId])];
            }

            return previous.filter((id) => id !== permissionId);
        });
    };

    const handleClose = () => {
        if (syncPermissionsMutation.isPending) return;

        setSelectedPermissionIds([]);
        onClose?.();
    };

    const handleSave = async () => {
        const permissionIds = [...new Set(selectedPermissionIds)];

        try {
            const response = await syncPermissionsMutation.mutateAsync({
                roleId: role.id,
                permissions: permissionIds,
            });

            showNotification(response.message, "success");
            setSelectedPermissionIds([]);
            onClose?.();
        } catch (error) {
            showNotification(
                error?.response?.data?.message || t("common.generalError"),
                "error"
            );
        }
    };

    const isLoading = isRoleLoading || isOptionsLoading;
    const hasError = isRoleError || isOptionsError;

    return (
        <BaseDialog
            open={open}
            onClose={handleClose}
            title={t("admin.roles.permissions.title")}
            subtitle={role?.name ?? ""}
            icon={<SecurityRoundedIcon />}
            maxWidth="sm"
            iconColor="primary"
            showCloseButton
            closeButtonDisabled={syncPermissionsMutation.isPending}
            actions={
                <>
                    <Button
                        onClick={handleClose}
                        disabled={syncPermissionsMutation.isPending}
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
                            !roleDetails ||
                            selectedPermissionIds.length === 0 ||
                            syncPermissionsMutation.isPending
                        }
                        startIcon={
                            syncPermissionsMutation.isPending ? (
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
                    {t("admin.roles.permissions.loadError")}
                </Alert>
            ) : permissions.length === 0 ? (
                <Alert severity="info">
                    {t("admin.roles.permissions.empty")}
                </Alert>
            ) : (
                <Stack spacing={2}>
                    <Box>
                        <Typography variant="subtitle1" fontWeight={700}>
                            {t("admin.roles.permissions.available")}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            {t("admin.roles.permissions.description")}
                        </Typography>
                    </Box>

                    <Stack spacing={1}>
                        {permissions.map((permission) => {
                            const permissionId = Number(permission.id);

                            const isChecked =
                                selectedPermissionIds.includes(permissionId);

                            return (
                                <Paper
                                    key={permission.id}
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
                                    <FormControlLabel
                                        sx={{ flex: 1, mr: 0, width: "100%" }}
                                        control={
                                            <Checkbox
                                                checked={isChecked}
                                                onChange={(event) =>
                                                    handlePermissionChange(
                                                        permissionId,
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
                                                {permission.name}
                                            </Typography>
                                        }
                                    />
                                </Paper>
                            );
                        })}
                    </Stack>
                </Stack>
            )}
        </BaseDialog>
    );
}
