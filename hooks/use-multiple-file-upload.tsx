"use client";

import { env } from "@/env";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

export type UploadStatus = "PENDING" | "COMPLETE" | "ERROR";

interface UploadProgress {
  key: string;
  progress: number | UploadStatus;
}

export interface UploadResult {
  key: string;
  url: string;
  filename: string;
}

interface FileToUpload {
  key: string;
  file: File;
}

interface UseMultipleFileUploadParams {
  onSuccess?: (results: UploadResult[]) => void;
  onError?: (error: string) => void;
}

export function useMultipleFileUpload({
  onSuccess,
  onError,
}: UseMultipleFileUploadParams = {}) {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());
  const imageUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      // Cleanup URLs when component unmounts
      imageUrlsRef.current.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  const uploadMultipleFiles = async (files: FileToUpload[]): Promise<void> => {
    setIsUploading(true);
    setError(null);

    setUploadProgress(
      files.map((file) => ({
        key: file.key,
        progress: "PENDING" as UploadStatus,
      })),
    );

    let overallErrorOccurred = false;

    try {
      const uploadPromises: Promise<UploadResult | null>[] = files.map(
        async ({ key, file }): Promise<UploadResult | null> => {
          const abortController = new AbortController();
          abortControllersRef.current.set(key, abortController);

          try {
            const blobUrl = URL.createObjectURL(file);
            imageUrlsRef.current.push(blobUrl);

            const formData = new FormData();
            formData.append("file", file);
            formData.append(
              "upload_preset",
              env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
            );

            const response = await axios.post(
              `https://api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
              formData,
              {
                signal: abortController.signal,
                onUploadProgress: (progressEvent) => {
                  if (progressEvent.total) {
                    const percentCompleted = Math.round(
                      (progressEvent.loaded * 100) / progressEvent.total,
                    );
                    setUploadProgress((prev) =>
                      prev.map((item) =>
                        item.key === key
                          ? { ...item, progress: percentCompleted }
                          : item,
                      ),
                    );
                  }
                },
              },
            );

            const uploadedUrl = response?.data?.secure_url as
              | string
              | undefined;
            if (!uploadedUrl) {
              console.error(
                `Upload failed for ${file.name}, no secure_url in response`,
                response.data,
              );
              throw new Error("Upload response did not contain a secure_url.");
            }

            await new Promise((resolve) => setTimeout(resolve, 1000)); // Optional delay

            setUploadProgress((prev) =>
              prev.map((item) =>
                item.key === key
                  ? { ...item, progress: "COMPLETE" as UploadStatus }
                  : item,
              ),
            );

            setUploadResults((prev) => [
              ...prev,
              {
                key,
                url: uploadedUrl,
                filename: file.name,
              },
            ]);

            URL.revokeObjectURL(blobUrl);
            imageUrlsRef.current = imageUrlsRef.current.filter(
              (url) => url !== blobUrl,
            );
            abortControllersRef.current.delete(key);
            return { key, url: uploadedUrl, filename: file.name };
          } catch (err: any) {
            overallErrorOccurred = true;
            if (axios.isCancel(err)) {
              console.log(
                `[useMultipleFileUpload] DEBUG: Upload cancelled for file: ${file.name}`,
              );
              setUploadProgress((prev) =>
                prev.map((item) =>
                  item.key === key
                    ? { ...item, progress: "PENDING" as UploadStatus }
                    : item,
                ),
              );
            } else {
              const errorMessage =
                err.response?.data?.message || err.message || "Upload failed";
              console.error(
                `[useMultipleFileUpload] DEBUG: Error uploading file ${file.name} (key: ${key}):`,
                errorMessage,
                err,
              );
              setUploadProgress((prev) =>
                prev.map((item) =>
                  item.key === key
                    ? { ...item, progress: "ERROR" as UploadStatus }
                    : item,
                ),
              );
            }
            return null;
          }
        },
      );

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(
        (result): result is UploadResult => result !== null,
      );

      if (successfulUploads.length > 0) {
        if (onSuccess) {
          onSuccess(successfulUploads);
        }
      }

      if (
        files.length > 0 &&
        successfulUploads.length < files.length &&
        overallErrorOccurred
      ) {
        const finalErrorMessage = "One or more files failed to upload.";
        setError(finalErrorMessage);
        if (onError) {
          onError(finalErrorMessage);
        }
      } else if (
        files.length > 0 &&
        successfulUploads.length === 0 &&
        !overallErrorOccurred &&
        !successfulUploads.some((url) => url)
      ) {
        // This case: files were attempted, no errors were explicitly caught that set overallErrorOccurred to true, but no files succeeded.
        // This could be due to cancellations not throwing other errors, or other silent failures.
        console.log(
          "[useMultipleFileUpload] DEBUG: No successful uploads, and no specific errors caught during upload process that triggered overallErrorOccurred. Check for cancellations or silent failures.",
        );
        // Optionally call onError here if this state is considered an error for the consumer
        // if (onError) onError("Upload process completed without any successful uploads.");
      }
    } catch (err) {
      const finalErrorMessage =
        "An unexpected error occurred during the multiple file upload process.";
      console.error(
        "[useMultipleFileUpload] DEBUG: Overall error in uploadMultipleFiles:",
        err,
      );
      setError(finalErrorMessage);
      if (onError) {
        onError(finalErrorMessage);
      }
    } finally {
      console.log(
        "[useMultipleFileUpload] DEBUG: setIsUploading(false) in finally block.",
      );
      setIsUploading(false);
    }
  };

  const cancelAllUploads = () => {
    abortControllersRef.current.forEach((controller) => {
      controller.abort();
    });
    abortControllersRef.current.clear();
    setUploadProgress([]);
    setUploadResults([]);
    setIsUploading(false);
    setError(null);
  };

  const resetUploads = () => {
    setUploadProgress([]);
    setUploadResults([]);
    setIsUploading(false);
    setError(null);
  };

  return {
    uploadMultipleFiles,
    uploadProgress,
    uploadResults,
    isUploading,
    error,
    cancelAllUploads,
    resetUploads,
  };
}
