
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
    Alert,
    Box,
    Button,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";

import {
    Refresh,
    Search,
    Clear,
    Add,
    Edit,
    Delete
} from "@mui/icons-material";
import BaseDialog from "../../../common/BaseDialog";
import DataTable from "../../../common/DataTable/DataTable";
import { useAdminCities } from "../../../../hooks/admin/city/useAdminCities";
import CreateCityDialog from "./CreateCityDialog";
import UpdateCityDialog from "./UpdateCityDialog";
import { useDeleteAdminCity } from "../../../../hooks/admin/city/useDeleteAdminCity";
import { useConfirmDialog } from "../../../../hooks/useConfirmDialog";
import { useNotification } from "../../../../hooks/useNotification";

export default function AdminCitiesDialog({
    open,
    provinceId,
    onClose,
}) {
    const { t } = useTranslation();

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [selectedCityId, setSelectedCityId] = useState(null);

    const deleteMutation = useDeleteAdminCity();
    const { confirm } = useConfirmDialog();
    const { showNotification } = useNotification();

    // Reset list state whenever the dialog opens for another province.
    useEffect(() => {
        if (open) {
            setPage(1);
            setSearchInput("");
            setSearch("");
        }
    }, [open, provinceId]);

    // Debounce search input.
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
    } = useAdminCities({
        provinceId: open ? provinceId : null,
        page,
        perPage,
        search,
    });

    const cities = data?.data ?? [];
    const total = data?.meta?.total ?? 0;


    const handleDeleteCity = async (city) => {
        const confirmed = await confirm({
            title: t("admin.cities.confirm.deleteTitle"),
            message: t("admin.cities.confirm.deleteMessage", {
                name: city.name,
            }),
            description: t("admin.cities.confirm.deleteDescription"),

            confirmText: t("admin.cities.actions.delete"),
            cancelText: t("common.cancel"),

            confirmColor: "error",
            icon: <Delete />,
        });

        if (!confirmed) return;

        try {
            const response = await deleteMutation.mutateAsync(city.id);

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
            headerName: t("admin.cities.table.id"),
            width: 80,
            align: "center",
        },
        {
            field: "name",
            headerName: t("admin.cities.fields.name"),
            minWidth: 200,
        },
        {
            field: "actions",
            headerName: t("admin.cities.table.actions"),
            align: "center",
            minWidth: 130,
            sortable: false,
            renderCell: (row) => (
                <Stack
                    direction="row"
                    spacing={0.5}
                    justifyContent="center"
                >
                    <Tooltip title={t("admin.cities.actions.edit")}>
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => {
                                setSelectedCityId(row.id);
                            }}
                        >
                            <Edit fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={t("admin.cities.actions.delete")}>
                        <span>
                            <IconButton
                                size="small"
                                color="error"
                                disabled={deleteMutation.isPending}
                                onClick={() => handleDeleteCity(row)}
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
            <BaseDialog
                open={open}
                onClose={onClose}
                title={t("admin.cities.title")}
                subtitle={t("admin.cities.subtitle")}
                fullScreen
                headerVariant="appBar"
                showCloseButton
                contentSx={{
                    p: 3,
                    pt: 4,
                    backgroundColor: "background.default",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mb: 2,
                    }}
                >
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setCreateDialogOpen(true)}
                    >
                        {t("admin.cities.create.submit")}
                    </Button>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                    >
                        <TextField
                            fullWidth
                            size="small"
                            placeholder={t("admin.cities.searchPlaceholder")}
                            value={searchInput}
                            onChange={(event) => {
                                setSearchInput(event.target.value);
                                setPage(1);
                            }}
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

                        <Tooltip title={t("common.refresh")}>
                            <span>
                                <IconButton
                                    onClick={() => refetch()}
                                    disabled={isFetching || !provinceId}
                                >
                                    <Refresh />
                                </IconButton>
                            </span>
                        </Tooltip>
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
                            t("admin.cities.loadError")}
                    </Alert>
                )}

                <DataTable
                    columns={columns}
                    rows={cities}
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
                    emptyMessage={t("admin.cities.empty")}
                />
            </BaseDialog>

            <CreateCityDialog
                open={createDialogOpen}
                provinceId={provinceId}
                onClose={() => setCreateDialogOpen(false)}
            />

            <UpdateCityDialog
                open={!!selectedCityId}
                cityId={selectedCityId}
                onClose={() => setSelectedCityId(null)}
            />
        </>
    );

}
