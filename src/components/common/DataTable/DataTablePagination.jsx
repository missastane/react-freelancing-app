
import React from "react";
import { TablePagination } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function DataTablePagination({
    page,
    rowsPerPage,
    totalRows,
    rowsPerPageOptions,
    onPageChange,
    onRowsPerPageChange,
}) {
    const { t } = useTranslation();

    return (
        <TablePagination
            component="div"
            count={totalRows}
            page={page - 1}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={rowsPerPageOptions}
            onPageChange={(_, newPage) => {
                onPageChange(newPage + 1);
            }}
            onRowsPerPageChange={(event) => {
                onRowsPerPageChange(Number(event.target.value));
            }}
            labelRowsPerPage={t("common.pagination.rowsPerPage")}
            labelDisplayedRows={({ from, to, count }) =>
                count !== -1
                    ? t("common.pagination.displayedRows", {
                          from,
                          to,
                          count,
                      })
                    : t("common.pagination.displayedRowsMore", {
                          from,
                          to,
                      })
            }
            sx={{
                borderTop: 1,
                borderColor: "divider",
                ".MuiTablePagination-toolbar": {
                    minHeight: 56,
                },
            }}
        />
    );
}
