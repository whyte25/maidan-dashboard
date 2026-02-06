"use client";

import { Button } from "@/components/ui/button";
import { useDeleteProduct } from "@/hooks/mutations";
import { cn } from "@/lib/utils";
import { ProductResponse } from "@/types";
import { Table } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteProductModal } from "./delete-product-modal";

interface DeleteProductRowsProps {
  table: Table<ProductResponse>;
  className?: string;
}

export function DeleteProductRows({
  table,
  className,
}: DeleteProductRowsProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const selectedRowsLength = table.getSelectedRowModel().rows.length;
  const selectedIds = table
    .getSelectedRowModel()
    .rows?.map((row) => row.original.id);

  const { isPending } = useDeleteProduct();

  if (selectedRowsLength === 0) return null;

  return (
    <>
      <Button
        className={cn(
          "h-8 w-fit !cursor-pointer absolute z-50 left-44 md:left-auto md:right-4 top-2",
          className,
        )}
        variant="outline"
        onClick={() => setIsDeleteModalOpen(true)}
      >
        <Trash2
          className="opacity-60"
          size={16}
          strokeWidth={2}
          aria-hidden="true"
        />
        <span className="inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
          {selectedRowsLength}
        </span>
      </Button>

      <DeleteProductModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          table.resetRowSelection();
        }}
        selectedRowsLength={selectedRowsLength}
        selectedIds={selectedIds}
      />
    </>
  );
}
