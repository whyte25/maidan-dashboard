"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteProduct } from "@/hooks/mutations";
import { ProductResponse } from "@/types";
import { CircleAlert } from "lucide-react";

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: ProductResponse;
  selectedRowsLength?: number;
  selectedIds?: string[];
}

export function DeleteProductModal({
  isOpen,
  onClose,
  product,
  selectedRowsLength,
  selectedIds,
}: DeleteProductModalProps) {
  const { mutate: deleteProduct, isPending } = useDeleteProduct();

  const isMultipleDelete =
    !product && selectedRowsLength && selectedRowsLength > 0;
  const isSingleDelete = product !== undefined;

  if (!isMultipleDelete && !isSingleDelete) return null;

  const handleDelete = () => {
    if (isSingleDelete && product) {
      deleteProduct(product.id);
    } else if (isMultipleDelete && selectedIds) {
      selectedIds.forEach((id) => deleteProduct(id));
    }
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="w-[90%] rounded-lg sm:max-w-[425px]">
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
            aria-hidden="true"
          >
            <CircleAlert className="opacity-80" size={16} strokeWidth={2} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {isMultipleDelete ? (
                <>
                  {selectedRowsLength} selected{" "}
                  {selectedRowsLength === 1 ? "product" : "products"}
                </>
              ) : (
                <>the product &quot;{product?.name}&quot;</>
              )}
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={handleDelete}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
