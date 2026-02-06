"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductResponse } from "@/types";
import { CellContext } from "@tanstack/react-table";
import { Edit, Eye, MoreVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DeleteProductModal } from "./delete-product-modal";

export function ProductTableDropdown({
  row,
}: CellContext<ProductResponse, unknown>) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const product = row.original;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href={`/dashboard/products/${product.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href={`/dashboard/products/${product.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-red-600 focus:text-red-600"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteProductModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        product={product}
      />
    </>
  );
}
