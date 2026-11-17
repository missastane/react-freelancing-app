
import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
    Alert,
    Box,
    Button,
    Chip,
    IconButton,
    Paper,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";

import {
    Add,
    Edit,
    Delete,
    Refresh,
    KeyRounded,
} from "@mui/icons-material";

import DataTable from "../../../common/DataTable/DataTable";
import { useAdminRoles } from "../../../../hooks/admin/role/useAdminRoles";
import CreateRoleDialog from "./CreateRoleDialog";
import UpdateRoleDialog from "./UpdateRoleDialog";
import ManageRolePermissionsDialog from "./ManageRolePermissionsDialog";
import { useDeleteAdminRole } from "../../../../hooks/admin/role/useDeleteAdminRole";
import { useConfirmDialog } from "../../../../hooks/useConfirmDialog";
import { useNotification } from "../../../../hooks/useNotification";

export default function AdminRoles() {
    const { t } = useTranslation();

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [selectedRoleId, setSelectedRoleId] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);

    const deleteMutation = useDeleteAdminRole();
   const { confirm } = useConfirmDialog();
    const { showNotification } = useNotification();

    const handleDeleteRole = async (role) => {
        const confirmed = await confirm({
            title: t("admin.roles.confirm.deleteTitle"),
            message: t("admin.roles.confirm.deleteMessage", {
                name: role.name,
            }),
            description: t("admin.roles.confirm.deleteDescription"),

            confirmText: t("admin.roles.actions.delete"),
            cancelText: t("common.cancel"),

            confirmColor: "error",
            icon: <Delete />,
        });

        if (!confirmed) return;

        try {
            const response = await deleteMutation.mutateAsync(role.id);

            showNotification(response.message, "success");
        } catch (error) {
            showNotification(
                error?.response?.data?.message || t("common.generalError"),
                "error"
            );
        }
    };
    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useAdminRoles({
        page,
        perPage,
    });

    // Extract paginated response
    const roles = data?.data?.data ?? [];
    const total = data?.total ?? 0;

    const columns = [
        {
            field: "id",
            headerName: t("admin.roles.table.id"),
            width: 80,
            align: "center",
        },
        {
            field: "name",
            headerName: t("admin.roles.fields.name"),
            minWidth: 180,
        },
        {
            field: "guard_name",
            headerName: t("admin.roles.fields.guard"),
            minWidth: 120,
            align: "center",
            renderCell: (row, value) => (
                <Chip
                    label={value}
                    size="small"
                    variant="outlined"
                />
            ),
        },
        {
            field: "permissions_count",
            headerName: t("admin.roles.table.permissionsCount"),
            minWidth: 150,
            align: "center",
            renderCell: (row, value) => (
                <Chip
                    label={value ?? 0}
                    size="small"
                    color="primary"
                    variant="outlined"
                />
            ),
        },
        {
            field: "actions",
            headerName: t("admin.roles.table.actions"),
            align: "center",
            minWidth: 150,
            sortable: false,
            renderCell: (row) => (
                <Stack
                    direction="row"
                    spacing={0.5}
                    justifyContent="center"
                >
                    <Tooltip title={t("admin.roles.actions.managePermissions")}>
                        <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => setSelectedRole(row)}
                        >
                            <KeyRounded fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={t("admin.roles.actions.edit")}>
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => setSelectedRoleId(row.id)}
                        >
                            <Edit fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={t("admin.roles.actions.delete")}>
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteRole(row)}
                            disabled={deleteMutation.isPending}
                        >
                            <Delete fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            ),
        },
    ];

    return (
        <>
            <Paper
                sx={{
                    p: 3,
                    border: 1,
                    borderColor: "surface.border",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 3,
                    }}
                >
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>
                            {t("admin.roles.title")}
                        </Typography>

                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                            {t("admin.roles.subtitle")}
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                        <Tooltip title={t("common.refresh")}>
                            <IconButton
                                onClick={() => refetch()}
                                disabled={isFetching}
                            >
                                <Refresh />
                            </IconButton>
                        </Tooltip>

                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            sx={{
                                borderRadius: 2.5,
                                fontWeight: 800,
                                textTransform: "none",
                            }}
                            onClick={() => setCreateDialogOpen(true)}
                        >
                            {t("admin.roles.add")}
                        </Button>
                    </Stack>
                </Box>

                {isError && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                        action={
                            <Button
                                color="inherit"
                                size="small"
                                onClick={() => refetch()}
                            >
                                {t("common.retry")}
                            </Button>
                        }
                    >
                        {error?.response?.data?.message ||
                            error?.message ||
                            t("admin.roles.loadError")}
                    </Alert>
                )}

                <DataTable
                    columns={columns}
                    rows={roles}
                    rowKey="id"
                    loading={isLoading || isFetching}
                    pagination
                    paginationMode="server"
                    page={page}
                    rowsPerPage={perPage}
                    rowsPerPageOptions={[5, 10, 15, 25, 50]}
                    totalRows={total}
                    onPageChange={setPage}
                    onRowsPerPageChange={(newPerPage) => {
                        setPerPage(newPerPage);
                        setPage(1);
                    }}
                    emptyMessage={t("admin.roles.empty")}
                />
            </Paper>

            <CreateRoleDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
            />

            <UpdateRoleDialog
                open={!!selectedRoleId}
                roleId={selectedRoleId}
                onClose={() => setSelectedRoleId(null)}
            />

            <ManageRolePermissionsDialog
                open={!!selectedRole}
                role={selectedRole}
                onClose={() => setSelectedRole(null)}
            />
        </>
    );
}
