
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
    Chip
} from "@mui/material";

import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import BaseDialog from "../../../common/BaseDialog";
import { useTranslation } from "react-i18next";

import { useAdminUser } from "../../../../hooks/admin/admin-user/useAdminUser";
import { useAdminUserOptions } from "../../../../hooks/admin/admin-user/useAdminUserOptions";
import { useSyncAdminUserDepartments } from "../../../../hooks/admin/admin-user/useSyncAdminUserDepartments";

import { useNotification } from "../../../../hooks/useNotification";

export default function ManageAdminDepartmentsDialog({
    open,
    onClose,
    admin,
}) {
    const { t } = useTranslation();
    const { showNotification } = useNotification();

    const [selectedDepartmentIds, setSelectedDepartmentIds] = useState([]);

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
    const syncDepartmentsMutation = useSyncAdminUserDepartments();

    const adminDetails = adminResponse?.data;
    const departments = optionsResponse?.data?.departments ?? [];

    // Initialize selected departments from admin details
    useEffect(() => {
        if (!open || !adminDetails) return;

        setSelectedDepartmentIds(
            (adminDetails.departments ?? []).map((department) =>
                Number(department.id)
            )
        );
    }, [open, adminDetails]);

    const handleDepartmentChange = (department, checked) => {
        // Inactive departments cannot be changed
        if (Number(department.status) !== 1) return;

        const departmentId = Number(department.id);

        setSelectedDepartmentIds((previous) => {
            if (checked) {
                return [...new Set([...previous, departmentId])];
            }

            return previous.filter((id) => id !== departmentId);
        });
    };

    const handleClose = () => {
        if (syncDepartmentsMutation.isPending) return;

        setSelectedDepartmentIds([]);
        onClose?.();
    };

    const handleSave = async () => {
        // Keep previously assigned inactive departments
        const inactiveAssignedIds = (adminDetails?.departments ?? [])
            .filter((department) => Number(department.status) !== 1)
            .map((department) => Number(department.id));

        const departmentIds = [
            ...new Set([
                ...selectedDepartmentIds,
                ...inactiveAssignedIds,
            ]),
        ];

        try {
            const response = await syncDepartmentsMutation.mutateAsync({
                adminId: admin.id,
                departments: departmentIds,
            });

            showNotification(response.message, "success");
            setSelectedDepartmentIds([]);
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
            title={t("admin.users.departments.title")}
            subtitle={`${admin?.first_name ?? ""} ${admin?.last_name ?? ""}`}
            icon={<ApartmentRoundedIcon />}
            maxWidth="sm"
            iconColor="primary"
            actions={
                <>
                    <Button
                        onClick={handleClose}
                        disabled={syncDepartmentsMutation.isPending}
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
                            syncDepartmentsMutation.isPending
                        }
                        startIcon={
                            syncDepartmentsMutation.isPending ? (
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
                    {t("admin.users.departments.loadError")}
                </Alert>
            ) : departments.length === 0 ? (
                <Alert severity="info">
                    {t("admin.users.departments.empty")}
                </Alert>
            ) : (
                <Stack spacing={2}>
                    <Box>
                        <Typography variant="subtitle1" fontWeight={700}>
                            {t("admin.users.departments.available")}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            {t("admin.users.departments.description")}
                        </Typography>
                    </Box>

                    <Stack spacing={1}>
                        {departments.map((department) => {
                            const departmentId = Number(department.id);
                            const isInactive =
                                Number(department.status) !== 1;

                            const isChecked =
                                selectedDepartmentIds.includes(departmentId);

                            return (
                                <Paper
                                    key={department.id}
                                    variant="outlined"
                                    sx={{
                                        px: 2,
                                        py: 1,
                                        borderRadius: 2,
                                        bgcolor: isInactive
                                            ? "rgba(211, 47, 47, 0.06)"
                                            : isChecked
                                                ? "action.hover"
                                                : "background.paper",
                                        borderColor: isInactive
                                            ? "rgba(211, 47, 47, 0.25)"
                                            : isChecked
                                                ? "primary.main"
                                                : "divider",
                                        opacity: isInactive ? 0.8 : 1,
                                        cursor: isInactive ? "not-allowed" : "pointer",
                                        transition: "all 0.2s",
                                    }}
                                >
                                    <FormControlLabel
                                        sx={{
                                            flex: 1,
                                            mr: 0,
                                            width: "100%",
                                            "& .MuiFormControlLabel-label": {
                                                flex: 1,
                                                width: "100%",
                                            },
                                        }}
                                        control={
                                            <Checkbox
                                                checked={isChecked}
                                                disabled={isInactive}
                                                onChange={(event) =>
                                                    handleDepartmentChange(
                                                        department,
                                                        event.target.checked
                                                    )
                                                }
                                            />
                                        }
                                        label={
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    width: "100%",
                                                }}
                                            >
                                                <Typography fontWeight={600} color="text.primary">
                                                    {department.name}
                                                </Typography>

                                                {isInactive && (
                                                    <Chip
                                                        label={t("admin.users.departments.inactive")}
                                                        size="small"
                                                        color="error"
                                                        variant="filled"
                                                        sx={{
                                                            height: 22,
                                                            fontSize: "0.7rem",
                                                            fontWeight: 600,
                                                            ml: 2,
                                                        }}
                                                    />
                                                )}
                                            </Box>
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
