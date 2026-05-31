"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, CheckCircle2, AlertCircle } from "lucide-react";
import { cn, formatBytes, ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface UploadAreaProps {
  onUploadComplete: (data: {
    fileName: string;
    fileUrl: string;
    extractedText: string;
    wordCount: number;
    estimatedSlides: number;
  }) => void;
}

type UploadState = "idle" | "uploading" | "success" | "error";

export function UploadArea({ onUploadComplete }: UploadAreaProps) {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    setUploadState("uploading");
    setUploadProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((p) => Math.min(p + 15, 85));
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      clearInterval(progressInterval);

      if (!res.ok) {
        setUploadState("error");
        setErrorMessage(data.error || "Upload failed");
        return;
      }

      setUploadProgress(100);
      setUploadState("success");
      onUploadComplete(data);
    } catch {
      clearInterval(progressInterval);
      setUploadState("error");
      setErrorMessage("Network error. Please try again.");
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
  });

  const reset = () => {
    setUploadState("idle");
    setUploadProgress(0);
    setErrorMessage("");
    setUploadedFile(null);
  };

  if (uploadState === "success" && uploadedFile) {
    return (
      <div className="border-2 border-dashed border-green-300 dark:border-green-800 rounded-xl p-8 text-center bg-green-50 dark:bg-green-950/20">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <p className="font-semibold text-green-700 dark:text-green-400 mb-1">{uploadedFile.name}</p>
        <p className="text-sm text-green-600 dark:text-green-500 mb-4">{formatBytes(uploadedFile.size)} · Processed successfully</p>
        <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground underline">
          Upload different file
        </button>
      </div>
    );
  }

  if (uploadState === "uploading") {
    return (
      <div className="border-2 border-dashed border-primary/40 rounded-xl p-8 text-center bg-primary/5">
        <FileText className="w-12 h-12 text-primary mx-auto mb-3 animate-pulse" />
        <p className="font-medium mb-1">{uploadedFile?.name}</p>
        <p className="text-sm text-muted-foreground mb-4">Extracting content...</p>
        <Progress value={uploadProgress} className="h-2 max-w-xs mx-auto" />
        <p className="text-xs text-muted-foreground mt-2">{uploadProgress}%</p>
      </div>
    );
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200",
          isDragActive
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-muted-foreground/25 hover:border-primary/60 hover:bg-muted/30"
        )}
      >
        <input {...getInputProps()} />
        <Upload className={cn("w-12 h-12 mx-auto mb-4 transition-colors", isDragActive ? "text-primary" : "text-muted-foreground")} />
        <p className="text-lg font-semibold mb-1">
          {isDragActive ? "Drop your file here" : "Drag & drop your document"}
        </p>
        <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {["PDF", "DOCX", "TXT", "PPT", "PPTX"].map((ext) => (
            <span key={ext} className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
              .{ext.toLowerCase()}
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">Maximum file size: 10MB</p>
      </div>

      {(uploadState === "error" || fileRejections.length > 0) && (
        <div className="flex items-center gap-2 mt-3 p-3 bg-destructive/10 rounded-lg">
          <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive">
            {errorMessage || fileRejections[0]?.errors[0]?.message || "Invalid file"}
          </p>
          <button onClick={reset} className="ml-auto">
            <X className="w-3 h-3 text-destructive" />
          </button>
        </div>
      )}
    </div>
  );
}
