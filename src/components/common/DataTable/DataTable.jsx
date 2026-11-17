
import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Typography,
} from "@mui/material";

import DataTablePagination from "./DataTablePagination";
import DataTableSkeleton from "./DataTableSkeleton";
import { useTranslation } from "react-i18next";
export default function DataTable({
    columns = [],
    rows = [],
    rowKey = "id",
    emptyMessage,
    loading = false,

    pagination = true,
    paginationMode = "client",
    page,
    rowsPerPage,
    rowsPerPageOptions = [5, 10, 15, 25, 50],
    totalRows,

    onPageChange,
    onRowsPerPageChange,

    sortingMode = "client",
    onSortChange,

    rowClassName,
    className,
    sx,

    skeletonRows = 5,
}) {
    const [internalPage, setInternalPage] = useState(1);
    const [internalRowsPerPage, setInternalRowsPerPage] = useState(10);
    const { t } = useTranslation();

    const [sortConfig, setSortConfig] = useState({
        field: null,
        direction: "asc",
    });

    const currentPage = page ?? internalPage;
    const currentRowsPerPage = rowsPerPage ?? internalRowsPerPage;

    const total = paginationMode === "client"
        ? rows.length
        : (totalRows ?? rows.length);

    const handlePageChange = (newPage) => {
        if (page === undefined) {
            setInternalPage(newPage);
        }

        onPageChange?.(newPage);
    };

    const handleRowsPerPageChange = (newRowsPerPage) => {
        if (rowsPerPage === undefined) {
            setInternalRowsPerPage(newRowsPerPage);
        }

        if (page === undefined) {
            setInternalPage(1);
        }

        onRowsPerPageChange?.(newRowsPerPage);
        onPageChange?.(1);
    };

    useEffect(() => {
        if (paginationMode === "client" && page === undefined) {
            const lastPage = Math.max(
                1,
                Math.ceil(rows.length / currentRowsPerPage)
            );

            if (internalPage > lastPage) {
                setInternalPage(lastPage);
            }
        }
    }, [
        rows.length,
        currentRowsPerPage,
        currentPage,
        paginationMode,
        page,
        internalPage,
    ]);

    const handleSort = (column) => {
        if (!column.sortable) return;

        const direction =
            sortConfig.field === column.field &&
                sortConfig.direction === "asc"
                ? "desc"
                : "asc";

        const newSortConfig = {
            field: column.field,
            direction,
        };

        setSortConfig(newSortConfig);

        if (sortingMode === "server") {
            onSortChange?.(newSortConfig);
        }
    };

    const processedRows = useMemo(() => {
        let result = [...rows];

        if (
            sortingMode === "client" &&
            sortConfig.field
        ) {
            const column = columns.find(
                (item) => item.field === sortConfig.field
            );

            result.sort((a, b) => {
                const aValue = a[sortConfig.field] ?? "";
                const bValue = b[sortConfig.field] ?? "";

                let comparison = 0;

                if (
                    typeof aValue === "number" &&
                    typeof bValue === "number"
                ) {
                    comparison = aValue - bValue;
                } else {
                    comparison = String(aValue).localeCompare(
                        String(bValue),
                        undefined,
                        {
                            numeric: true,
                            sensitivity: "base",
                        }
                    );
                }

                return sortConfig.direction === "asc"
                    ? comparison
                    : -comparison;
            });
        }

        if (pagination && paginationMode === "client") {
            const startIndex = (currentPage - 1) * currentRowsPerPage;

            result = result.slice(
                startIndex,
                startIndex + currentRowsPerPage
            );
        }

        return result;
    }, [
        rows,
        columns,
        sortConfig,
        sortingMode,
        pagination,
        paginationMode,
        currentPage,
        currentRowsPerPage,
    ]);

    const getRowKey = (row, index) => {
        if (typeof rowKey === "function") {
            return rowKey(row);
        }

        return row[rowKey] ?? index;
    };

    return (
        <Paper
            elevation={0}
            className={className}
            sx={{
                width: "100%",
                overflow: "hidden",
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                ...sx,
            }}
        >
            <TableContainer
                sx={{
                    width: "100%",
                    overflowX: "auto",
                }}
            >
                <Table
                    sx={{
                        minWidth: 650,
                        borderCollapse: "separate",
                        borderSpacing: 0,
                    }}
                >
                    <TableHead>
                        <TableRow
                            sx={{
                                bgcolor: "action.hover",
                            }}
                        >
                            {columns.map((column) => (
                                <TableCell
                                    key={column.field}
                                    align={column.align || "left"}
                                    className={column.headerClassName}
                                    sx={{
                                        width: column.width,
                                        minWidth: column.minWidth,
                                        fontWeight: 700,
                                        whiteSpace: "nowrap",
                                        ...column.headerSx,
                                    }}
                                >
                                    {column.sortable ? (
                                        <TableSortLabel
                                            active={
                                                sortConfig.field === column.field
                                            }
                                            direction={
                                                sortConfig.field === column.field
                                                    ? sortConfig.direction
                                                    : "asc"
                                            }
                                            onClick={() => handleSort(column)}
                                        >
                                            {column.headerName}
                                        </TableSortLabel>
                                    ) : (
                                        column.headerName
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <DataTableSkeleton
                                rows={skeletonRows}
                                columns={columns.length}
                            />
                        ) : processedRows.length > 0 ? (
                            processedRows.map((row, rowIndex) => (
                                <TableRow
                                    key={getRowKey(row, rowIndex)}
                                    hover
                                    className={
                                        typeof rowClassName === "function"
                                            ? rowClassName(row)
                                            : rowClassName
                                    }
                                    sx={{
                                        "&:last-child td": {
                                            borderBottom: 0,
                                        },
                                    }}
                                >
                                    {columns.map((column) => {
                                        const value = row[column.field];

                                        const cellClass =
                                            typeof column.cellClassName === "function"
                                                ? column.cellClassName(row, value)
                                                : column.cellClassName;

                                        return (
                                            <TableCell
                                                key={column.field}
                                                align={column.align || "left"}
                                                className={cellClass || column.className}
                                                sx={{
                                                    width: column.width,
                                                    minWidth: column.minWidth,
                                                    whiteSpace:
                                                        column.nowrap
                                                            ? "nowrap"
                                                            : "normal",
                                                    ...column.cellSx,
                                                }}
                                            >
                                                {column.renderCell
                                                    ? column.renderCell(row, value)
                                                    : value ?? "-"}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length || 1}
                                    align="center"
                                    sx={{
                                        py: 6,
                                        borderBottom: 0,
                                    }}
                                >
                                    <Typography
                                        color="text.secondary"
                                        variant="body2"
                                    >
                                        {emptyMessage ?? t("common.table.empty")}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {pagination && (
                <DataTablePagination
                    page={currentPage}
                    rowsPerPage={currentRowsPerPage}
                    totalRows={total}
                    rowsPerPageOptions={rowsPerPageOptions}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                />
            )}
        </Paper>
    );
}
