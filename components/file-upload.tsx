"use client";

import { useState } from "react";
import { AirplayIcon, Pencil, Trash, Upload } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Label } from "./ui/label";

interface FileUploadProps {
  url?: string;
  label: string;
  subLabel?: string;
  accept: string;
  files: File | null;
  setFiles: (files: File | null) => void;
  height?: number;
}

const FileUpload = ({
  url,
  label,
  subLabel,
  accept,
  files,
  setFiles,
  height,
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleChange = (file: File) => {
    // check file size < 1MB
    console.log("file size: ", file.size);
    if (file.size > 1024 * 1024) {
      toast.error("File size must be less than 1MB");
      return;
    }
    setFiles(file);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (
      e.dataTransfer.files &&
      e.dataTransfer.files.length > 0 &&
      e.dataTransfer.files[0]
    ) {
      handleChange(e.dataTransfer.files[0]);
    } else {
      toast.error("No file selected");
      return;
    }
  };

  const handleDelete = () => {
    setFiles(null);
  };

  return (
    <div className="w-full">
      <label className="block text-gray-700 font-semibold mb-2">
        {label} <span className="text-red-500">*</span>
      </label>

      <div
        className={`flex flex-col gap-5 p-5 w-full items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-100 text-gray-400 font-semibold
          ${height && `h-${height}`}
          ${isDragging ? "border-blue-500" : ""}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={`${(files || url) && "absolute"} flex-1 flex flex-col items-center justify-center`}>
          <input
            name={label}
            id={label}
            type="file"
            accept={accept}
            onChange={(e) => {
              if (
                e.target.files &&
                e.target.files.length > 0 &&
                e.target.files[0]
              ) {
                handleChange(e.target.files[0]);
              }
            }}
            className="hidden"
          />
          <Upload size={60} color="#9ca3af" />
          <label htmlFor={label} className="cursor-pointer mt-2">
            Drag & Drop or{" "}
            <span className="text-blue-500 font-semibold">Choose file</span> to
            upload
          </label>

          <div className="text-center mt-2">
            {subLabel && <p className="text-xs font-thin">{subLabel}</p>}
            <p className="text-xs font-thin ">
              Accepted file formats: {accept === ".zip" ? "ZIP" : "JPG, PNG"}
            </p>
          </div>
        </div>
        {(files || url) && (
          <Image
            className="rounded-lg cursor-pointer transition-transform duration-200 group-hover:brightness-75 z-10"
            src={files ? URL.createObjectURL(files) : url || ""}
            alt="Preview Image"
            height={150}
            width={1500}
            onLoad={() =>
              files ? URL.revokeObjectURL(URL.createObjectURL(files)) : null
            }
          />
        )}
        <Label
          htmlFor={label}
          className="flex justify-center items-center gap-2 text-lg h-12 rounded-lg outline p-2"
        >
          <span>
            <Pencil className="text-primary-500" size={30} />
          </span>
          <h2>{files || url ? "Change" : "Upload"}</h2>
        </Label>
      </div>
    </div>
  );
};

export default FileUpload;
