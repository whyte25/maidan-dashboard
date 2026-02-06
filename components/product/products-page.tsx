"use client";

import { ProductsColumns } from "@/components/product/product-columns";
import { ProductsTable } from "@/components/product/products-table";
import { QuerySearchInput } from "@/components/query/query-search-input";
import { TableSkeleton } from "@/components/skeleton/table-skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCT_CATEGORIES } from "@/constants/product";
import { useGetProducts } from "@/hooks/queries";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

export default function ProductsPage() {
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(10));
  const [search] = useQueryState("search", parseAsString.withDefault(""));
  const [category, setCategory] = useQueryState("category");

  const { data, isLoading, error } = useGetProducts({
    page,
    limit,
    search: search || undefined,
    category: category || undefined,
  });

  const products = data || [];
  const pagination = {
    current_page: page,
    total_pages: Math.ceil(products.length > 0 ? 100 / limit : 1),
    total_items: products.length,
    items_per_page: limit,
  };

  return (
    <div className="space-y-6 ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products List</h1>
        </div>
        <Button asChild className="gap-2">
          <Link href="/dashboard/products/new">
            <Plus className="h-4 w-4" />
            Add product
          </Link>
        </Button>
      </div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <Select
          value={category || "all"}
          onValueChange={(value) => setCategory(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {PRODUCT_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <QuerySearchInput
          queryParamName="search"
          placeholder="Search..."
          width="w-[300px]"
        />
      </div>
      {/* Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : error ? (
        <div className="flex h-96 items-center justify-center">
          <EmptyState
            title="Failed to load products"
            description="We couldn't retrieve the products at this time. Please try again later."
            icon={Loader2}
            action={{
              label: "Retry",
              onClick: () => window.location.reload(),
            }}
          />
        </div>
      ) : (
        <ProductsTable
          columns={ProductsColumns}
          data={products}
          pagination={pagination}
        />
      )}
    </div>
  );
}
