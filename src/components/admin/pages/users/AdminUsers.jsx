
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
} from "@mui/icons-material";

import CreateAdminDialog from "../../pages/users/CreateAdminDialog";
import DataTable from "../../../common/DataTable/DataTable";
import { useAdminUsers } from "../../../../hooks/admin/admin-user/useAdminUsers";
import AdminUserDetailsDialog from "./AdminUserDetailsDialog"
export default function AdminUsers() {
    const { t } = useTranslation();

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [selectedAdminId, setSelectedAdminId] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);


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
    const admins = data?.data?.data ?? [];
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
        console.log("Edit admin:", admin);
    };

    const handleToggleActivation = (admin) => {
        console.log("Toggle activation:", admin);
    };

    const handleManageAccess = (admin) => {
        console.log("Manage roles and permissions:", admin);
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
                        value === "active"
                            ? t("admin.users.status.active")
                            : t("admin.users.status.inactive")
                    }
                    color={
                        value === "active"
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
            renderCell: (row) => (
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
                            row.activation === "active"
                                ? t("admin.users.actions.deactivate")
                                : t("admin.users.actions.activate")
                        }
                    >
                        <IconButton
                            size="small"
                            color={
                                row.activation === "active"
                                    ? "warning"
                                    : "success"
                            }
                            onClick={() =>
                                handleToggleActivation(row)
                            }
                        >
                            {row.activation === "active" ? (
                                <ToggleOff fontSize="small" />
                            ) : (
                                <ToggleOn fontSize="small" />
                            )}
                        </IconButton>
                    </Tooltip>

                    <Tooltip
                        title={t("admin.users.actions.manageAccess")}
                    >
                        <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => handleManageAccess(row)}
                        >
                            <ManageAccounts fontSize="small" />
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
        </>
    );
}
