
import { useEffect, useState } from "react";
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
    InputAdornment,
    TextField,
} from "@mui/material";

import {
    Add,
    Edit,
    Delete,
    Refresh,
    KeyRounded,
    Search,
    Clear,
} from "@mui/icons-material";

import DataTable from "../../../common/DataTable/DataTable";
import { useAdminPermissions } from "../../../../hooks/admin/permission/useAdminPermissions";
import CreatePermissionDialog from "./CreatePermissionDialog";
import UpdatePermissionDialog from "./UpdatePermissionDialog";
import ManagePermissionRolesDialog from "./ManagePermissionRolesDialog";
import { useDeleteAdminPermission } from "../../../../hooks/admin/permission/useDeleteAdminPermission";
import { useNotification } from "../../../../hooks/useNotification";
import { useConfirmDialog } from "../../../../hooks/useConfirmDialog";

export default function AdminPermissions() {
    const { t } = useTranslation();

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [selectedPermissionId, setSelectedPermissionId] = useState(null);
    const [selectedPermission, setSelectedPermission] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput.trim());
        }, 400);

        return () => clearTimeout(timer);
    }, [searchInput]);

    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useAdminPermissions({
        page,
        perPage,
        search,
    });

    const deleteMutation = useDeleteAdminPermission();
    const { confirm } = useConfirmDialog();
    const { showNotification } = useNotification();

    const handleDeletePermission = async (permission) => {
        const confirmed = await confirm({
            title: t("admin.permissions.confirm.deleteTitle"),
            message: t("admin.permissions.confirm.deleteMessage", {
                name: permission.name,
            }),
            description: t("admin.permissions.confirm.deleteDescription"),

            confirmText: t("admin.permissions.actions.delete"),
            cancelText: t("common.cancel"),

            confirmColor: "error",
            icon: <Delete />,
        });

        if (!confirmed) return;

        try {
            const response = await deleteMutation.mutateAsync(permission.id);

            showNotification(response.message, "success");
        } catch (error) {
            showNotification(
                error?.response?.data?.message || t("common.generalError"),
                "error"
            );
        }
    };
    // Extract paginated response
    const permissions = data?.data?.data ?? [];
    const total = data?.total ?? 0;

    const columns = [
        {
            field: "id",
            headerName: t("admin.permissions.table.id"),
            width: 80,
            align: "center",
        },
        {
            field: "name",
            headerName: t("admin.permissions.fields.name"),
            minWidth: 200,
        },
        {
            field: "guard_name",
            headerName: t("admin.permissions.fields.guard"),
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
            field: "roles_count",
            headerName: t("admin.permissions.table.rolesCount"),
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
            headerName: t("admin.permissions.table.actions"),
            align: "center",
            minWidth: 130,
            sortable: false,
            renderCell: (row) => (
                <Stack
                    direction="row"
                    spacing={0.5}
                    justifyContent="center"
                >
                    <Tooltip title={t("admin.permissions.actions.manageRoles")}>
                        <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => setSelectedPermission(row)}
                        >
                            <KeyRounded fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={t("admin.permissions.actions.edit")}>
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => setSelectedPermissionId(row.id)}
                        >
                            <Edit fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={t("admin.permissions.actions.delete")}>
                        <IconButton
                            color="error"
                            onClick={() => handleDeletePermission(row)}
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
                            {t("admin.permissions.title")}
                        </Typography>

                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                            {t("admin.permissions.subtitle")}
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
                            {t("admin.permissions.add")}
                        </Button>
                    </Stack>
                </Box>

                <TextField
                    fullWidth
                    size="small"
                    placeholder={t("admin.permissions.searchPlaceholder")}
                    value={searchInput}
                    onChange={(event) => {
                        setSearchInput(event.target.value);
                        setPage(1);
                    }}
                    sx={{ mb: 3 }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                            endAdornment: searchInput && (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            setSearchInput("");
                                            setPage(1);
                                        }}
                                        edge="end"
                                    >
                                        <Clear fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />

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
                            t("admin.permissions.loadError")}
                    </Alert>
                )}

                <DataTable
                    columns={columns}
                    rows={permissions}
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
                    emptyMessage={t("admin.permissions.empty")}
                />
            </Paper>

            <CreatePermissionDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
            />

            <UpdatePermissionDialog
                open={!!selectedPermissionId}
                permissionId={selectedPermissionId}
                onClose={() => setSelectedPermissionId(null)}
            />

            <ManagePermissionRolesDialog
                open={!!selectedPermission}
                permission={selectedPermission}
                onClose={() => setSelectedPermission(null)}
            />
        </>
    );
}
