
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
    Alert,
    Box,
    Button,
    IconButton,
    InputAdornment,
    Paper,
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
    Visibility,
    Edit,
    Delete,
} from "@mui/icons-material";

import DataTable from "../../../common/DataTable/DataTable";
import { useAdminSubscriptions } from "../../../../hooks/admin/subscription/useAdminSubscriptions";

import { useDeleteAdminSubscription } from "../../../../hooks/admin/subscription/useDeleteAdminSubscription";
import { useConfirmDialog } from "../../../../hooks/useConfirmDialog";
import { useNotification } from "../../../../hooks/useNotification";

import CreateSubscriptionDialog from "./CreateSubscriptionDialog";
import SubscriptionDetailsDialog from "./SubscriptionDetailsDialog";
import UpdateSubscriptionDialog from "./UpdateSubscriptionDialog";

export default function AdminSubscriptions() {
    const { t } = useTranslation();

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [selectedSubscriptionId, setSelectedSubscriptionId] = useState(null);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);

    const deleteMutation = useDeleteAdminSubscription();
    const { confirm } = useConfirmDialog();
    const { showNotification } = useNotification();

    const handleViewSubscription = (subscriptionId) => {
        setSelectedSubscriptionId(subscriptionId);
        setViewDialogOpen(true);
    };

    const handleEditSubscription = (subscriptionId) => {
        setSelectedSubscriptionId(subscriptionId);
        setUpdateDialogOpen(true);
    };

    const handleDeleteSubscription = async (subscription) => {
        const confirmed = await confirm({
            title: t("admin.subscriptions.confirm.deleteTitle"),
            message: t("admin.subscriptions.confirm.deleteMessage", {
                name: subscription.name,
            }),
            description: t("admin.subscriptions.confirm.deleteDescription"),

            confirmText: t("admin.subscriptions.actions.delete"),
            cancelText: t("common.cancel"),

            confirmColor: "error",
            icon: <Delete />,
        });

        if (!confirmed) return;

        try {
            const response = await deleteMutation.mutateAsync(subscription.id);

            showNotification(response.message, "success");
        } catch (error) {
            showNotification(
                error?.response?.data?.message || t("common.generalError"),
                "error"
            );
        }
    };

    // Debounce search
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
    } = useAdminSubscriptions({
        page,
        perPage,
        search,
    });

    // Extract paginated response
    const subscriptions = data?.data ?? [];
    const total = data?.meta?.total ?? 0;

    const columns = [
        {
            field: "id",
            headerName: t("admin.subscriptions.table.id"),
            width: 80,
            align: "center",
        },
        {
            field: "name",
            headerName: t("admin.subscriptions.fields.name"),
            minWidth: 180,
        },
        {
            field: "amount",
            headerName: t("admin.subscriptions.fields.amount"),
            minWidth: 140,
            align: "center",
        },
        {
            field: "duration_days",
            headerName: t("admin.subscriptions.fields.durationDays"),
            minWidth: 120,
            align: "center",
        },
        {
            field: "commission_rate",
            headerName: t("admin.subscriptions.fields.commissionRate"),
            minWidth: 120,
            align: "center",
        },
        {
            field: "max_target_per_month",
            headerName: t("admin.subscriptions.fields.maxTargetPerMonth"),
            minWidth: 150,
            align: "center",
        },
        {
            field: "actions",
            headerName: t("admin.subscriptions.table.actions"),
            align: "center",
            minWidth: 130,
            sortable: false,
            renderCell: (row) => (
                <Stack direction="row" spacing={0.5} justifyContent="center">
                    <Tooltip title={t("admin.subscriptions.actions.show")}>
                        <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleViewSubscription(row.id)}
                        >
                            <Visibility fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t("admin.subscriptions.actions.edit")}>
                        <IconButton
                            size="small"
                            color="warning"
                            onClick={() => handleEditSubscription(row.id)}
                        >
                            <Edit fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={t("admin.subscriptions.actions.delete")}>
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteSubscription(row)}
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
                            {t("admin.subscriptions.title")}
                        </Typography>

                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                            {t("admin.subscriptions.subtitle")}
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
                            {t("admin.subscriptions.add")}
                        </Button>
                    </Stack>
                </Box>

                <TextField
                    fullWidth
                    size="small"
                    placeholder={t("admin.subscriptions.searchPlaceholder")}
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
                            t("admin.subscriptions.loadError")}
                    </Alert>
                )}

                <DataTable
                    columns={columns}
                    rows={subscriptions}
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
                    emptyMessage={t("admin.subscriptions.empty")}
                />
            </Paper>

            <CreateSubscriptionDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
            />

            <SubscriptionDetailsDialog
                open={viewDialogOpen}
                subscriptionId={selectedSubscriptionId}
                onClose={() => {
                    setViewDialogOpen(false);
                    setSelectedSubscriptionId(null);
                }}
            />

            <UpdateSubscriptionDialog
                open={updateDialogOpen}
                subscriptionId={selectedSubscriptionId}
                onClose={() => {
                    setUpdateDialogOpen(false);
                    setSelectedSubscriptionId(null);
                }}
            />
        </>
    );
}
