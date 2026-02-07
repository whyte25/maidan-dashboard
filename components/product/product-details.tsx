"use client";

import { EditorPreview } from "@/components/kibo-ui/editor/editor-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ImageComponent from "@/components/ui/image";
import { useUpdateProduct } from "@/hooks/mutations";
import { cn } from "@/lib/utils";
import { ProductResponse } from "@/types";
import {
  Check,
  ChevronLeft,
  Edit,
  Loader2,
  MoreVertical,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

interface ProductDetailsProps {
  product: ProductResponse;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = React.useState(product.images[0]);
  const updateProductMutation = useUpdateProduct();

  const handleUpdateStatus = (isPublished: boolean) => {
    updateProductMutation.mutate({
      id: product.id,
      data: { isPublished },
      redirectTo: "none",
    });
  };

  const isPublished = product.isPublished;
  const isUpdating = updateProductMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Top Header/Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 -ml-2"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/products/${product.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isUpdating}>
              <Button
                variant="outline"
                className="gap-2 min-w-[120px] justify-between"
              >
                <span className="flex items-center gap-2">
                  {isUpdating ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        isPublished ? "bg-green-500" : "bg-gray-400",
                      )}
                    />
                  )}
                  {isPublished ? "Published" : "Draft"}
                </span>
                <MoreVertical className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleUpdateStatus(true)}
                className="gap-2"
                disabled={isPublished || isUpdating}
              >
                <Check className={cn("h-4 w-4", !isPublished && "opacity-0")} />
                Published
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleUpdateStatus(false)}
                className="gap-2"
                disabled={!isPublished || isUpdating}
              >
                <Check className={cn("h-4 w-4", isPublished && "opacity-0")} />
                Draft
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-2xl border bg-muted">
            <ImageComponent
              src={selectedImage}
              alt={product.name}
              className="object-cover h-full w-full"
            />
            {/* Image counter indicator */}
            <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
              {product.images.indexOf(selectedImage) + 1} /{" "}
              {product.images.length}
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={cn(
                  "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                  selectedImage === img
                    ? "border-primary opacity-100"
                    : "border-transparent opacity-60 hover:opacity-80",
                )}
              >
                <ImageComponent
                  src={img}
                  alt={`${product.name} ${idx + 1}`}
                  className="object-cover h-full w-full"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Product Metadata */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex gap-2">
              {product.isNew && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 hover:bg-blue-100"
                >
                  NEW
                </Badge>
              )}
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 hover:bg-green-100 uppercase"
              >
                {product.quantity > 0 ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4 fill-amber-400 text-amber-400",
                      i >= 4 && "fill-gray-200 text-gray-200",
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                (9.12k reviews)
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">
                $
                {product.isOnSale && product.salePrice
                  ? product.salePrice
                  : product.regularPrice}
              </span>
              {product.isOnSale && product.salePrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ${product.regularPrice}
                </span>
              )}
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {product.subDescription}
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Color</span>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <div
                    key={color}
                    className="h-6 w-6 rounded-full border shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Size</span>
              <Badge variant="outline" className="font-normal">
                {product.sizes.join(", ")}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Category</span>
              <span className="text-sm text-muted-foreground">
                {product.category}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Tags</span>
              <div className="flex gap-1 flex-wrap justify-end max-w-[200px]">
                {product.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 leading-tight"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description Card */}
      <Card className="mt-8 border-none shadow-sm bg-muted/20">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 border-b pb-4 mb-6">
            <span className="font-semibold border-b-2 border-primary pb-4 -mb-[18px]">
              Description
            </span>
          </div>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <EditorPreview markdown={product.content} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
