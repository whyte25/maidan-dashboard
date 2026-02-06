"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import React from "react";
import { Button } from "../ui/button";

interface ITableEmptyState {
  title: string;
  description: string;
  buttonText?: string;
  image?: string;
  variant?: "outline" | "default";
  onClick?: () => void;
  showButton?: boolean;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

interface TableEmptyStateProps<TData, TValue>
  extends DataTableProps<TData, TValue>, ITableEmptyState {}

export function TableEmptyState<TData, TValue>({
  columns = [],
  title,
  image,
  buttonText,
  description,
  variant = "outline",
  onClick,
  showButton = false,
}: TableEmptyStateProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const table = useReactTable({
    data: [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="rounded-md">
      <Table>
        <TableHeader className="bg-[#F7F8FD] py-1">
          {table?.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={columns.length}>
              <div className="flex h-64 w-full flex-col items-center justify-center gap-2 text-center">
                {/* <Image src={image || briefcaseIcon} alt="" /> */}
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="w-4/5 text-sm text-gray-500 sm:w-[270px]">
                  {description}
                </p>
                {showButton && (
                  <Button onClick={onClick} className="mt-2" variant={variant}>
                    {buttonText}
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
