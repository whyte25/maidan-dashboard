"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import ImageComponent from "@/components/ui/image";
import { useUpdateProduct } from "@/hooks/mutations";
import { cn } from "@/lib/utils";
import { ProductResponse } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { ProductTableDropdown } from "./product-table-dropdown";

export const ProductsColumns: ColumnDef<ProductResponse>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="mt-1.5"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 28,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => {
      const name = row.original.name;
      const category = row.original.category;
      const image = row.original.images?.[0];

      return (
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-lg border bg-muted">
            {image ? (
              <ImageComponent src={image} alt={name} className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                No img
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{name}</span>
            <span className="text-sm text-muted-foreground">{category}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Create at" />
    ),
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      if (!createdAt) return <span className="text-muted-foreground">-</span>;

      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {format(new Date(createdAt), "dd MMM yyyy")}
          </span>
          <span className="text-sm text-muted-foreground">
            {format(new Date(createdAt), "h:mm a")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
    cell: ({ row }) => {
      const quantity = row.original.quantity || 0;

      const getStockStatus = (qty: number) => {
        if (qty === 0) return { label: "out of stock", color: "bg-red-500" };
        if (qty <= 10)
          return { label: `${qty} low stock`, color: "bg-amber-500" };
        return { label: `${qty} in stock`, color: "bg-green-500" };
      };

      const status = getStockStatus(quantity);

      return (
        <div className="flex flex-col items-start gap-1">
          <div
            className={cn(
              "h-1.5 rounded-full",
              status.color,
              quantity === 0 ? "w-12" : quantity <= 10 ? "w-8" : "w-16",
            )}
          />
          <span className="text-xs text-muted-foreground">{status.label}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "regularPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const regularPrice = row.original.regularPrice;
      const salePrice = row.original.salePrice;
      const isOnSale = row.original.isOnSale;

      return (
        <div className="flex flex-col">
          <span
            className={cn(
              "font-medium",
              isOnSale && salePrice ? "text-green-600" : "text-foreground",
            )}
          >
            $
            {isOnSale && salePrice
              ? salePrice.toFixed(2)
              : regularPrice?.toFixed(2)}
          </span>
          {isOnSale && salePrice && (
            <span className="text-xs text-muted-foreground line-through">
              ${regularPrice?.toFixed(2)}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "publish",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Publish" />
    ),
    cell: ({ row }) => {
      const product = row.original;
      const isPublished = product.isPublished;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const updateProductMutation = useUpdateProduct();

      const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        updateProductMutation.mutate({
          id: product.id,
          data: { isPublished: !isPublished } as any,
          redirectTo: "none",
        });
      };

      const isUpdating = updateProductMutation.isPending;

      return (
        <button
          onClick={handleToggle}
          disabled={isUpdating}
          className="disabled:opacity-50 transition-opacity"
        >
          <Badge
            variant="secondary"
            className={cn(
              "font-normal rounded px-3 flex items-center gap-1.5",
              isPublished
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
            )}
          >
            {isUpdating && <Loader2 className="h-3 w-3 animate-spin" />}
            {isPublished ? "Published" : "Draft"}
          </Badge>
        </button>
      );
    },
  },
  {
    id: "actions",
    cell: ProductTableDropdown,
  },
];
