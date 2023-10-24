"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type CategoryColumn = {
  id: string;
  name: string;
  createdAt: string;
};

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "createdAt",
    header: "Fecha de creación",
  },
];
