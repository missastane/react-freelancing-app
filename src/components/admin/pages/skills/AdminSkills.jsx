
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
  Edit,
  Delete
} from "@mui/icons-material";
import CreateSkillDialog from "./CreateSkillDialog";
import DataTable from "../../../common/DataTable/DataTable";
import { useAdminSkills } from "../../../../hooks/admin/skill/useAdminSkills";
import UpdateSkillDialog from "./UpdateSkillDialog";
import { useDeleteAdminSkill } from "../../../../hooks/admin/skill/useDeleteAdminSkill";
import { useConfirmDialog } from "../../../../hooks/useConfirmDialog";
import { useNotification } from "../../../../hooks/useNotification";

export default function AdminSkills() {
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  const deleteMutation = useDeleteAdminSkill();
  const { confirm } = useConfirmDialog();
  const { showNotification } = useNotification();

  const handleEditSkill = (skillId) => {
    setSelectedSkillId(skillId);
    setUpdateDialogOpen(true);
  };

  const handleDeleteSkill = async (skill) => {
    const confirmed = await confirm({
      title: t("admin.skills.confirm.deleteTitle"),
      message: t("admin.skills.confirm.deleteMessage", {
        name: skill.persian_title,
      }),
      description: t("admin.skills.confirm.deleteDescription"),

      confirmText: t("admin.skills.actions.delete"),
      cancelText: t("common.cancel"),

      confirmColor: "error",
      icon: <Delete />,
    });

    if (!confirmed) return;

    try {
      const response = await deleteMutation.mutateAsync(skill.id);

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
  } = useAdminSkills({
    page,
    perPage,
    search,
  });

  // Extract paginated response
  const skills = data?.data?.data ?? [];
  const total = data?.total ?? 0;

  const columns = [
    {
      field: "id",
      headerName: t("admin.skills.table.id"),
      width: 80,
      align: "center",
    },
    {
      field: "persian_title",
      headerName: t("admin.skills.fields.persianTitle"),
      minWidth: 200,
    },
    {
      field: "original_title",
      headerName: t("admin.skills.fields.originalTitle"),
      minWidth: 200,
    },
    {
      field: "actions",
      headerName: t("admin.skills.table.actions"),
      align: "center",
      minWidth: 130,
      sortable: false,
      renderCell: (row) => (
        <Stack
          direction="row"
          spacing={0.5}
          justifyContent="center"
        >


          <Tooltip title={t("admin.skills.actions.edit")}>
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleEditSkill(row.id)}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title={t("admin.skills.actions.delete")}>
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDeleteSkill(row)}
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
              {t("admin.skills.title")}
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {t("admin.skills.subtitle")}
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
              {t("admin.skills.add")}
            </Button>
          </Stack>
        </Box>

        <TextField
          fullWidth
          size="small"
          placeholder={t("admin.skills.searchPlaceholder")}
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
              t("admin.skills.loadError")}
          </Alert>
        )}

        <DataTable
          columns={columns}
          rows={skills}
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
          emptyMessage={t("admin.skills.empty")}
        />
      </Paper>

      <CreateSkillDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />

      <UpdateSkillDialog
        open={updateDialogOpen}
        skillId={selectedSkillId}
        onClose={() => {
          setUpdateDialogOpen(false);
          setSelectedSkillId(null);
        }}
      />
    </>
  );
}
