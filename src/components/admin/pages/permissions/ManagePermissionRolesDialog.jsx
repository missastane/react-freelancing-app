
import { useEffect, useState } from "react";

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

import { useAdminPermission } from "../../../../hooks/admin/permission/useAdminPermission";
import { useAdminUserOptions } from "../../../../hooks/admin/admin-user/useAdminUserOptions";
import { useSyncPermissionRoles } from "../../../../hooks/admin/permission/useSyncPermissionRoles";

import { useNotification } from "../../../../hooks/useNotification";

export default function ManagePermissionRolesDialog({
    open,
    onClose,
    permission,
}) {
    const { t } = useTranslation();
    const { showNotification } = useNotification();

    const [selectedRoleIds, setSelectedRoleIds] = useState([]);

    // Queries
    const {
        data: permissionResponse,
        isLoading: isPermissionLoading,
        isError: isPermissionError,
    } = useAdminPermission(open ? permission?.id : null);

    const {
        data: optionsResponse,
        isLoading: isOptionsLoading,
        isError: isOptionsError,
    } = useAdminUserOptions();

    // Mutation
    const syncRolesMutation = useSyncPermissionRoles();

    const permissionDetails =
        permissionResponse?.data?.data ??
        permissionResponse?.data ??
        permissionResponse;

    const roles = optionsResponse?.data?.roles ?? [];

    // Initialize selected roles from permission details
    useEffect(() => {
        if (!open || !permissionDetails) return;

        setSelectedRoleIds(
            (permissionDetails.roles ?? []).map((role) =>
                Number(role.id)
            )
        );
    }, [open, permissionDetails]);

    const handleRoleChange = (roleId, checked) => {
        setSelectedRoleIds((previous) => {
            if (checked) {
                return [...new Set([...previous, roleId])];
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
        const roleIds = [...new Set(selectedRoleIds)];

        try {
            const response = await syncRolesMutation.mutateAsync({
                permissionId: permission.id,
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

    const isLoading = isPermissionLoading || isOptionsLoading;
    const hasError = isPermissionError || isOptionsError;

    return (
        <BaseDialog
            open={open}
            onClose={handleClose}
            title={t("admin.permissions.roles.title")}
            subtitle={permission?.name ?? ""}
            icon={<SecurityRoundedIcon />}
            maxWidth="sm"
            iconColor="primary"
            showCloseButton
            closeButtonDisabled={syncRolesMutation.isPending}
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
                            !permissionDetails ||
                            selectedRoleIds.length === 0 ||
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
                    {t("admin.permissions.roles.loadError")}
                </Alert>
            ) : roles.length === 0 ? (
                <Alert severity="info">
                    {t("admin.permissions.roles.empty")}
                </Alert>
            ) : (
                <Stack spacing={2}>
                    <Box>
                        <Typography variant="subtitle1" fontWeight={700}>
                            {t("admin.permissions.roles.available")}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            {t("admin.permissions.roles.description")}
                        </Typography>
                    </Box>

                    <Stack spacing={1}>
                        {roles.map((role) => {
                            const roleId = Number(role.id);

                            const isChecked =
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
                                    <FormControlLabel
                                        sx={{ flex: 1, mr: 0, width: "100%" }}
                                        control={
                                            <Checkbox
                                                checked={isChecked}
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
                                </Paper>
                            );
                        })}
                    </Stack>
                </Stack>
            )}
        </BaseDialog>
    );
}
