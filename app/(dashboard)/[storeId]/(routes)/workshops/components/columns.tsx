"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type WorkshopColumn = {
  id: string;
  name: string;
  category: string;
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: string;
};

export const columns: ColumnDef<WorkshopColumn>[] = [
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "isArchived",
    header: "Archivado",
  },
  {
    accessorKey: "isFeatured",
    header: "En stock",
  },
  {
    accessorKey: "category",
    header: "Categoria",
  },
  {
    accessorKey: "createdAt",
    header: "Fecha de creación",
  },
];
