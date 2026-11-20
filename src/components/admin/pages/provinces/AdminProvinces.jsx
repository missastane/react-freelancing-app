
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
    Alert,
    Box,
    Button,
    IconButton,
    Paper,
    Stack,
    Tooltip,
    Typography,
    InputAdornment,
    TextField,
} from "@mui/material";

import {
    Refresh,
    Search,
    Clear,
    LocationCity,
    Add,
    Edit,
    Delete
} from "@mui/icons-material";

import DataTable from "../../../common/DataTable/DataTable";
import { useAdminProvinces } from "../../../../hooks/admin/province/useAdminProvinces";
import CreateProvinceDialog from "./CreateProvinceDialog";
import UpdateProvinceDialog from "./UpdateProvinceDialog";
import { useDeleteAdminProvince } from "../../../../hooks/admin/province/useDeleteAdminProvince";
import { useConfirmDialog } from "../../../../hooks/useConfirmDialog";
import { useNotification } from "../../../../hooks/useNotification";
import AdminCitiesDialog from "../cities/AdminCitiesDialog";

export default function AdminProvinces() {
    const { t } = useTranslation();

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [selectedProvinceForUpdate, setSelectedProvinceForUpdate] = useState(null);
    const [selectedProvinceId, setSelectedProvinceId] = useState(null);

    const deleteMutation = useDeleteAdminProvince();
    const { confirm } = useConfirmDialog();
    const { showNotification } = useNotification();

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
    } = useAdminProvinces({
        page,
        perPage,
        search,
    });

    const provinces = data?.data ?? [];
    const total = data?.total ?? 0;

    const handleDeleteProvince = async (province) => {
        const confirmed = await confirm({
            title: t("admin.provinces.confirm.deleteTitle"),
            message: t("admin.provinces.confirm.deleteMessage", {
                name: province.name,
            }),
            description: t("admin.provinces.confirm.deleteDescription"),

            confirmText: t("admin.provinces.actions.delete"),
            cancelText: t("common.cancel"),

            confirmColor: "error",
            icon: <Delete />,
        });

        if (!confirmed) return;

        try {
            const response = await deleteMutation.mutateAsync(province.id);

            showNotification(response.message, "success");
        } catch (error) {
            showNotification(
                error?.response?.data?.message || t("common.generalError"),
                "error"
            );
        }
    };

    const columns = [
        {
            field: "id",
            headerName: t("admin.provinces.table.id"),
            width: 80,
            align: "center",
        },
        {
            field: "name",
            headerName: t("admin.provinces.fields.name"),
            minWidth: 200,
        },
        {
            field: "actions",
            headerName: t("admin.provinces.table.actions"),
            align: "center",
            minWidth: 130,
            sortable: false,
            renderCell: (row) => (
                <Stack
                    direction="row"
                    spacing={0.5}
                    justifyContent="center"
                >
                    <Tooltip title={t("admin.provinces.actions.manageCities")}>
                        <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => setSelectedProvinceId(row.id)}
                        >
                            <LocationCity fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={t("admin.provinces.actions.edit")}>
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => {
                                setSelectedProvinceForUpdate(row.id);
                                setUpdateDialogOpen(true);
                            }}
                        >
                            <Edit fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={t("admin.provinces.actions.delete")}>
                        <span>
                            <IconButton
                                size="small"
                                color="error"
                                disabled={deleteMutation.isPending}
                                onClick={() => handleDeleteProvince(row)}
                            >
                                <Delete fontSize="small" />
                            </IconButton>
                        </span>
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
                            {t("admin.provinces.title")}
                        </Typography>

                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                            {t("admin.provinces.subtitle")}
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => setCreateDialogOpen(true)}
                        >
                            {t("admin.provinces.create.submit")}
                        </Button>

                        <Tooltip title={t("common.refresh")}>
                            <span>
                                <IconButton
                                    onClick={() => refetch()}
                                    disabled={isFetching}
                                >
                                    <Refresh />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Stack>

                </Box>

                <TextField
                    fullWidth
                    size="small"
                    placeholder={t("admin.provinces.searchPlaceholder")}
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
                            t("admin.provinces.loadError")}
                    </Alert>
                )}

                <DataTable
                    columns={columns}
                    rows={provinces}
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
                    emptyMessage={t("admin.provinces.empty")}
                />
            </Paper>

            <CreateProvinceDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
            />

            <UpdateProvinceDialog
                open={updateDialogOpen}
                provinceId={selectedProvinceForUpdate}
                onClose={() => {
                    setUpdateDialogOpen(false);
                    setSelectedProvinceForUpdate(null);
                }}
            />

            <AdminCitiesDialog
                open={!!selectedProvinceId}
                provinceId={selectedProvinceId}
                onClose={() => setSelectedProvinceId(null)}
            />
        </>
    );
}
