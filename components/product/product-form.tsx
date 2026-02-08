"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";

import {
  Tags,
  TagsContent,
  TagsEmpty,
  TagsGroup,
  TagsInput,
  TagsItem,
  TagsList,
  TagsTrigger,
  TagsValue,
} from "@/components/kibo-ui/tags";
import {
  MultiImageDropzone,
  type FileState,
} from "@/components/multiple-image-upload";
import { ProductEditor } from "@/components/product/product-editor";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/notify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import {
  PRODUCT_CATEGORIES,
  PRODUCT_COLORS,
  PRODUCT_GENDERS,
  PRODUCT_SIZES,
  PRODUCT_TAGS,
} from "@/constants/product";
import { useCreateProduct, useUpdateProduct } from "@/hooks/mutations";
import { useMultipleFileUpload } from "@/hooks/use-multiple-file-upload";
import { cn } from "@/lib/utils";
import { productSchema, type ProductFormValues } from "@/validations/product";

interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>;
  productId?: string;
}

const defaultFormValues: ProductFormValues = {
  name: "",
  subDescription: "",
  content: "",
  images: [],
  gender: [],
  isOnSale: false,
  isNew: false,
  regularPrice: 0,
  salePrice: undefined,
  priceIncludesTax: false,
  taxPercentage: undefined,
  productCode: "",
  sku: "",
  quantity: 0,
  category: "",
  colors: [],
  sizes: [],
  tags: [],
  isPublished: false,
};

export function ProductForm({ defaultValues, productId }: ProductFormProps) {
  const router = useRouter();
  const isEditMode = Boolean(productId);

  const [fileStates, setFileStates] = React.useState<FileState[]>([]);

  const [tagsOpen, setTagsOpen] = React.useState(false);

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  const isPending =
    createProductMutation.isPending || updateProductMutation.isPending;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { ...defaultFormValues, ...defaultValues },
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = form;

  const {
    uploadMultipleFiles,
    uploadProgress,
    isUploading,
    error: uploadError,
  } = useMultipleFileUpload({
    onSuccess: (images) => {
      setValue(
        "images",
        images.map((image) => image.url),
        { shouldValidate: true },
      );
    },
    onError: (error) => {
      toast.error("Upload failed", { description: error });
    },
  });

  const formValues = getValues();

  const priceIncludesTax = watch("priceIncludesTax");
  const selectedColors = watch("colors");
  const selectedSizes = watch("sizes");
  const selectedGenders = watch("gender");
  const selectedTags = watch("tags") || [];

  React.useEffect(() => {
    if (defaultValues?.images?.length && fileStates.length === 0) {
      const initialFileStates = defaultValues.images.map((url) => ({
        file: url,
        key: url,
        progress: "COMPLETE" as const,
      }));
      setFileStates(initialFileStates);
    }
  }, [defaultValues?.images]);

  React.useEffect(() => {
    if (uploadProgress.length) {
      setFileStates((fileStates) => {
        const newFileStates = structuredClone(fileStates);
        uploadProgress.forEach(({ key, progress }) => {
          const fileState = newFileStates.find(
            (fileState) => fileState.key === key,
          );
          if (fileState) {
            fileState.progress = progress;
          }
        });
        return newFileStates;
      });
    }
  }, [uploadProgress]);

  React.useEffect(() => {
    const completedUrls = fileStates
      .filter((f) => f.progress === "COMPLETE" && typeof f.file === "string")
      .map((f) => f.file as string);

    if (completedUrls.length > 0) {
      setValue("images", completedUrls, { shouldValidate: true });
    }
  }, [fileStates, setValue]);

  const handleUploadImages = async () => {
    const pendingFiles = fileStates
      .filter(
        (fileState) =>
          fileState.progress === "PENDING" &&
          typeof fileState.file !== "string",
      )
      .map((fileState) => ({
        key: fileState.key,
        file: fileState.file as File,
      }));

    if (pendingFiles.length > 0) {
      await uploadMultipleFiles(pendingFiles);
    }
  };

  const onSubmit = (data: ProductFormValues) => {
    if (isEditMode && productId) {
      updateProductMutation.mutate({ id: productId, data });
    } else {
      createProductMutation.mutate(data);
    }
  };

  const toggleArrayValue = (
    field: "colors" | "sizes" | "gender",
    value: string,
    currentValues: string[],
  ) => {
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    setValue(field, newValues as any, { shouldValidate: true });
  };

  const toggleTag = (tag: string) => {
    const currentTags = selectedTags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];
    setValue("tags", newTags, { shouldValidate: true });
  };

  return (
    <form
      key={productId}
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-2xl space-y-6"
    >
      <Accordion
        type="multiple"
        defaultValue={["details", "properties", "price"]}
      >
        <AccordionItem value="details">
          <AccordionTrigger>
            <div className="flex flex-col items-start">
              <span className="font-semibold">Details</span>
              <span className="text-xs text-muted-foreground">
                Name, description, content, and images
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 h-full">
            <Field>
              <FieldLabel>Product Name</FieldLabel>
              <Input {...register("name")} placeholder="Enter product name" />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Sub Description</FieldLabel>
              <Textarea
                {...register("subDescription")}
                className="h-24"
                placeholder="Enter a short description"
                rows={4}
              />
              {errors.subDescription && (
                <FieldError>{errors.subDescription.message}</FieldError>
              )}
            </Field>

            <Field className="relative">
              <FieldLabel>Content</FieldLabel>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <ProductEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Describe your product in detail..."
                  />
                )}
              />
              {errors.content && (
                <FieldError>{errors.content.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Images (minimum 2)</FieldLabel>
              <MultiImageDropzone
                value={fileStates}
                dropzoneOptions={{
                  maxFiles: 6,
                  maxSize: 1024 * 1024 * 2,
                }}
                disabled={isUploading}
                height="250px"
                displayMode="grid"
                onChange={setFileStates}
                onFilesAdded={(addedFiles) => {
                  setFileStates([...fileStates, ...addedFiles]);
                }}
              />
              {fileStates.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleUploadImages}
                  disabled={
                    isUploading ||
                    !fileStates.filter((f) => f.progress === "PENDING").length
                  }
                >
                  {isUploading ? "Uploading..." : "Upload Images"}
                </Button>
              )}
              {uploadError && (
                <div className="mt-2 text-sm text-red-500">{uploadError}</div>
              )}
              {errors.images && (
                <FieldError>{errors.images.message}</FieldError>
              )}
            </Field>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="properties">
          <AccordionTrigger>
            <div className="flex flex-col items-start">
              <span className="font-semibold">Properties</span>
              <span className="text-xs text-muted-foreground">
                Code, SKU, colors, sizes, category, tags, and more
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 h-full">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Product Code</FieldLabel>
                <Input
                  {...register("productCode")}
                  placeholder="e.g., PRD-001"
                />
                {errors.productCode && (
                  <FieldError>{errors.productCode.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel>SKU</FieldLabel>
                <Input {...register("sku")} placeholder="e.g., SKU-12345" />
                {errors.sku && <FieldError>{errors.sku.message}</FieldError>}
              </Field>
            </div>

            <Field>
              <FieldLabel>Quantity</FieldLabel>
              <Input
                type="number"
                {...register("quantity", { valueAsNumber: true })}
                placeholder="0"
              />
              {errors.quantity && (
                <FieldError>{errors.quantity.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Colors</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {PRODUCT_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() =>
                      toggleArrayValue("colors", color.value, selectedColors)
                    }
                    className={cn(
                      "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors",
                      selectedColors.includes(color.value)
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 hover:border-primary/50",
                    )}
                  >
                    <span
                      className="size-4 rounded-full border"
                      style={{ backgroundColor: color.hex }}
                    />
                    {color.label}
                    {selectedColors.includes(color.value) && (
                      <CheckIcon className="size-3" />
                    )}
                  </button>
                ))}
              </div>
              {errors.colors && (
                <FieldError>{errors.colors.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Sizes</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {PRODUCT_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() =>
                      toggleArrayValue("sizes", size, selectedSizes)
                    }
                    className={cn(
                      "rounded-full border  px-3 py-1.5 text-sm transition-colors",
                      selectedSizes.includes(size)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-gray-200 hover:border-primary/50",
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {errors.sizes && <FieldError>{errors.sizes.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Category</FieldLabel>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <FieldError>{errors.category.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Tags</FieldLabel>
              <Tags open={tagsOpen} onOpenChange={setTagsOpen}>
                <TagsTrigger>
                  {selectedTags.map((tag) => (
                    <TagsValue key={tag} onRemove={() => toggleTag(tag)}>
                      {tag}
                    </TagsValue>
                  ))}
                </TagsTrigger>
                <TagsContent>
                  <TagsInput placeholder="Search tags..." />
                  <TagsList>
                    <TagsEmpty />
                    <TagsGroup>
                      {PRODUCT_TAGS.map((tag) => (
                        <TagsItem
                          key={tag}
                          value={tag}
                          onSelect={() => {
                            toggleTag(tag);
                            setTagsOpen(false);
                          }}
                        >
                          {tag}
                          {selectedTags.includes(tag) && (
                            <CheckIcon className="size-4" />
                          )}
                        </TagsItem>
                      ))}
                    </TagsGroup>
                  </TagsList>
                </TagsContent>
              </Tags>
              {errors.tags && <FieldError>{errors.tags.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Gender</FieldLabel>
              <div className="flex flex-wrap gap-4">
                {PRODUCT_GENDERS.map((gender) => (
                  <label
                    key={gender.value}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <Checkbox
                      checked={selectedGenders.includes(gender.value as any)}
                      onCheckedChange={() =>
                        toggleArrayValue(
                          "gender",
                          gender.value,
                          selectedGenders as string[],
                        )
                      }
                    />
                    <span className="text-sm">{gender.label}</span>
                  </label>
                ))}
              </div>
              {errors.gender && (
                <FieldError>{errors.gender.message}</FieldError>
              )}
            </Field>

            <div className="flex flex-wrap gap-6">
              <Field orientation="horizontal">
                <FieldLabel>New Product</FieldLabel>
                <Controller
                  name="isNew"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </Field>

              <Field orientation="horizontal">
                <FieldLabel>On Sale</FieldLabel>
                <Controller
                  name="isOnSale"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </Field>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>
            <div className="flex flex-col items-start">
              <span className="font-semibold">Price</span>
              <span className="text-xs text-muted-foreground">
                Regular price, sale price, and tax settings
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 h-full">
            <Field>
              <FieldLabel>Regular Price</FieldLabel>
              <Input
                type="number"
                step="0.01"
                {...register("regularPrice", { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.regularPrice && (
                <FieldError>{errors.regularPrice.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Sale Price (optional)</FieldLabel>
              <Input
                type="number"
                step="0.01"
                {...register("salePrice", { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.salePrice && (
                <FieldError>{errors.salePrice.message}</FieldError>
              )}
            </Field>

            <Field orientation="horizontal">
              <FieldLabel>Price Includes Tax</FieldLabel>
              <Controller
                name="priceIncludesTax"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </Field>

            {priceIncludesTax && (
              <Field>
                <FieldLabel>Tax Percentage</FieldLabel>
                <Input
                  type="number"
                  step="0.01"
                  {...register("taxPercentage", { valueAsNumber: true })}
                  placeholder="e.g., 20"
                />
                {errors.taxPercentage && (
                  <FieldError>{errors.taxPercentage.message}</FieldError>
                )}
              </Field>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex items-center justify-between gap-4">
        <Field orientation="horizontal" className="mb-0 w-fit">
          <FieldLabel className="mb-0">Publish</FieldLabel>
          <Controller
            name="isPublished"
            control={control}
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </Field>
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <SubmitButton isSubmitting={isPending || isUploading}>
            {isEditMode ? "Update Product" : "Create Product"}
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
