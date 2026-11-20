
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
    Box,
    Paper,
    Typography,
    Chip,
    TextField,
    InputAdornment,
    IconButton,
    Tooltip,
    Stack,
    Alert,
    Button,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Snackbar
} from "@mui/material";

import {
    Search,
    Add,
    Clear,
    Visibility,
    Edit,
    ToggleOn,
    ToggleOff,
    ManageAccounts,
    Refresh,
    PersonAdd,
    PersonAddDisabled,
    ShieldOutlined,
    KeyOutlined

} from "@mui/icons-material";

import CreateAdminDialog from "../../pages/users/CreateAdminDialog";
import DataTable from "../../../common/DataTable/DataTable";
import { useAdminUsers } from "../../../../hooks/admin/admin-user/useAdminUsers";
import { useToggleAdminUserActivation } from "../../../../hooks/admin/admin-user/useToggleAdminUserActivation";
import AdminUserDetailsDialog from "./AdminUserDetailsDialog"
import UpdateAdminDialog from "./UpdateAdminDialog";
import { useConfirmDialog } from "../../../../hooks/useConfirmDialog";
import { useNotification } from "../../../../hooks/useNotification";
import ManageAdminRolesDialog from "./ManageAdminRolesDialog";
import ManageAdminPermissionsDialog from "./ManageAdminPermissionsDialog";
import ManageAdminDepartmentsDialog from "./ManageAdminDepartmentsDialog";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";

export default function AdminUsers() {
    const { t } = useTranslation();

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [selectedAdminId, setSelectedAdminId] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [updateAdminId, setUpdateAdminId] = useState(null);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [accessMenuAnchor, setAccessMenuAnchor] = useState(null);
    const [selectedAccessAdmin, setSelectedAccessAdmin] = useState(null);
    const accessMenuOpen = Boolean(accessMenuAnchor);
    const [rolesDialogOpen, setRolesDialogOpen] = useState(false);
    const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [departmentsDialogOpen, setDepartmentsDialogOpen] = useState(false);

    const { confirm } = useConfirmDialog();
    const { showNotification } = useNotification();
    const toggleMutation = useToggleAdminUserActivation();


    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput.trim());
            setPage(1);
        }, 400);

        return () => clearTimeout(timer);
    }, [searchInput]);

    // Fetch administrators
    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useAdminUsers({
        page,
        perPage,
        search,
    });

    // Extract paginated response
    const admins = data?.data ?? [];
    const total = data?.total ?? 0;




    // Temporary action handlers
    // These will be connected to their respective mutation hooks later.
    const handleView = (admin) => {
        setSelectedAdminId(admin.id);
        setDetailsOpen(true);
    };

    const handleCloseDetails = () => {
        setDetailsOpen(false);
        setSelectedAdminId(null);
    };

    const handleEdit = (admin) => {
        setUpdateAdminId(admin.id);
        setUpdateOpen(true);
    };

    const handleCloseUpdate = () => {
        setUpdateOpen(false);
        setUpdateAdminId(null);
    };

    const handleToggleActivation = async (admin) => {
        const isActive = Number(admin.activation) === 1;

        const confirmed = await confirm({
            title: isActive
                ? t("admin.users.confirm.deactivateTitle")
                : t("admin.users.confirm.activateTitle"),

            message: isActive
                ? t("admin.users.confirm.deactivateMessage")
                : t("admin.users.confirm.activateMessage"),

            description: isActive
                ? t("admin.users.confirm.deactivateDescription")
                : t("admin.users.confirm.activateDescription"),

            confirmText: isActive
                ? t("admin.users.actions.deactivate")
                : t("admin.users.actions.activate"),

            cancelText: t("common.cancel"),
            confirmColor: isActive ? "error" : "success",
            icon: isActive ? <PersonAddDisabled /> : <PersonAdd />
        });

        if (!confirmed) return;

        try {
            const response = await toggleMutation.mutateAsync(admin.id);
            showNotification(response.message, "success");
        } catch (error) {
            showNotification(
                error?.response?.data?.message || t("common.generalError"),
                "error"
            );
        }
    };

    const handleOpenAccessMenu = (event, admin) => {
        setAccessMenuAnchor(event.currentTarget);
        setSelectedAccessAdmin(admin);
    };

    const handleCloseAccessMenu = () => {
        setAccessMenuAnchor(null);
    };

    const handleSelectManageRoles = () => {
        const admin = selectedAccessAdmin;
        handleCloseAccessMenu();

        if (admin) {
            handleManageRoles(admin);
        }
    };

    const handleSelectManagePermissions = () => {
        const admin = selectedAccessAdmin;
        handleCloseAccessMenu();

        if (admin) {
            handleManagePermissions(admin);
        }
    };

    const handleManageRoles = (admin) => {
        setSelectedAdmin(admin);
        setRolesDialogOpen(true);
    };

    const handleManagePermissions = (admin) => {
        setSelectedAdmin(admin);
        setPermissionsDialogOpen(true);
    };

    const handleSelectManageDepartments = () => {
        const admin = selectedAccessAdmin;
        handleCloseAccessMenu();

        if (admin) {
            handleManageDepartments(admin);
        }
    };

    const handleManageDepartments = (admin) => {
        setSelectedAdmin(admin);
        setDepartmentsDialogOpen(true);
    };

    const columns = [
        {
            field: "id",
            headerName: t("admin.users.table.id"),
            width: 80,
            align: "center",
            sortable: true,
        },
        {
            field: "first_name",
            headerName: t("admin.users.fields.firstName"),
            minWidth: 130,
            sortable: true,
        },
        {
            field: "last_name",
            headerName: t("admin.users.fields.lastName"),
            minWidth: 150,
            sortable: true,
        },
        {
            field: "email",
            headerName: t("admin.users.fields.email"),
            minWidth: 220,
            nowrap: true,
        },
        {
            field: "username",
            headerName: t("admin.users.fields.username"),
            minWidth: 130,
        },
        {
            field: "activation",
            headerName: t("admin.users.table.status"),
            align: "center",
            minWidth: 110,
            renderCell: (row, value) => (
                <Chip
                    label={
                        value === 1
                            ? t("admin.users.status.active")
                            : t("admin.users.status.inactive")
                    }
                    color={
                        value === 1
                            ? "success"
                            : "default"
                    }
                    size="small"
                />
            ),
        },
        {
            field: "actions",
            headerName: t("admin.users.table.actions"),
            align: "center",
            minWidth: 190,
            sortable: false,
            renderCell: (row) => {
                const isActive = Number(row.activation) === 1;

                return (
                    <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="center"
                    >
                        <Tooltip title={t("admin.users.actions.view")}>
                            <IconButton
                                size="small"
                                color="info"
                                onClick={() => handleView(row)}
                            >
                                <Visibility fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title={t("admin.users.actions.edit")}>
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleEdit(row)}
                            >
                                <Edit fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip
                            title={
                                !isActive
                                    ? t("admin.users.actions.deactivate")
                                    : t("admin.users.actions.activate")
                            }
                        >
                            <IconButton
                                size="small"
                                color={!isActive ? "warning" : "success"}
                                onClick={() => handleToggleActivation(row)}
                            >
                                {isActive ? (
                                    <ToggleOff fontSize="small" />
                                ) : (
                                    <ToggleOn fontSize="small" />
                                )}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title={t("admin.users.actions.manageAccess")}>
                            <IconButton
                                size="small"
                                color="secondary"
                                onClick={(event) => handleOpenAccessMenu(event, row)}
                            >
                                <ManageAccounts fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                );
            },
        },
    ];

    return (
        <>
            <Snackbar
                open={!!successMessage}
                autoHideDuration={4000}
                onClose={() => setSuccessMessage("")}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    onClose={() => setSuccessMessage("")}
                >
                    {successMessage}
                </Alert>
            </Snackbar>
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
                            {t("admin.users.title")}
                        </Typography>

                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                            {t("admin.users.subtitle")}
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
                            onClick={() => setCreateDialogOpen(true)}
                            sx={{
                                borderRadius: 2.5,
                                fontWeight: 800,
                                textTransform: "none",
                            }}
                        >
                            {t("admin.users.add")}
                        </Button>
                    </Stack>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        size="small"
                        value={searchInput}
                        onChange={(event) =>
                            setSearchInput(event.target.value)
                        }
                        placeholder={t("admin.users.searchPlaceholder")}
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
                                            onClick={() =>
                                                setSearchInput("")
                                            }
                                        >
                                            <Clear fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
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
                            t("admin.users.loadError")}
                    </Alert>
                )}

                <DataTable
                    columns={columns}
                    rows={admins}
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
                    emptyMessage={
                        search
                            ? t("admin.users.noSearchResults")
                            : t("admin.users.empty")
                    }
                />

                <Menu
                    anchorEl={accessMenuAnchor}
                    open={accessMenuOpen}
                    onClose={handleCloseAccessMenu}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                >
                    <MenuItem onClick={handleSelectManageRoles}>
                        <ListItemIcon>
                            <ShieldOutlined fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            {t("admin.users.actions.manageRoles")}
                        </ListItemText>
                    </MenuItem>

                    <MenuItem onClick={handleSelectManagePermissions}>
                        <ListItemIcon>
                            <KeyOutlined fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            {t("admin.users.actions.managePermissions")}
                        </ListItemText>
                    </MenuItem>

                    <MenuItem onClick={handleSelectManageDepartments}>
                        <ListItemIcon>
                            <ApartmentRoundedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            {t("admin.users.actions.manageDepartments")}
                        </ListItemText>
                    </MenuItem>
                </Menu>
            </Paper>

            <CreateAdminDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
            />

            <AdminUserDetailsDialog
                open={detailsOpen}
                adminId={selectedAdminId}
                onClose={handleCloseDetails}
            />

            <UpdateAdminDialog
                open={updateOpen}
                adminId={updateAdminId}
                onClose={handleCloseUpdate}
                onSuccess={(message) => setSuccessMessage(message)}

            />

            <ManageAdminRolesDialog
                open={rolesDialogOpen}
                onClose={() => {
                    setRolesDialogOpen(false);
                    setSelectedAdmin(null);
                }}
                admin={selectedAdmin}
            />

            <ManageAdminPermissionsDialog
                open={permissionsDialogOpen}
                onClose={() => {
                    setPermissionsDialogOpen(false);
                    setSelectedAdmin(null);
                }}
                admin={selectedAdmin}
            />

            <ManageAdminDepartmentsDialog
                open={departmentsDialogOpen}
                onClose={() => {
                    setDepartmentsDialogOpen(false);
                    setSelectedAdmin(null);
                }}
                admin={selectedAdmin}
            />
        </>
    );
}
