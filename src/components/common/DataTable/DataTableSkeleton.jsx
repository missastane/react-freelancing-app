
import React from "react";
import {
    Skeleton,
    TableCell,
    TableRow,
} from "@mui/material";

export default function DataTableSkeleton({
    rows = 5,
    columns = 4,
}) {
    return Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
            {Array.from({ length: columns }).map((_, columnIndex) => (
                <TableCell key={columnIndex}>
                    <Skeleton
                        variant="text"
                        animation="wave"
                        width={
                            columnIndex === 0
                                ? "50%"
                                : `${65 + (columnIndex % 3) * 10}%`
                        }
                    />
                </TableCell>
            ))}
        </TableRow>
    ));
}
