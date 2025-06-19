"use client";

import { useState } from "react";
import { AirplayIcon, Trash, Upload } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";

interface FileUploadProps {
  children?: React.ReactNode;
  label: string;
  subLabel?: string;
  accept: string;
  files: File | null;
  setFiles: (files: File | null) => void;
  handleDelete?: () => void;
  height?: number;
}

const FileUpload = ({
  children,
  label,
  subLabel,
  accept,
  files,
  setFiles,
  handleDelete,
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(e.dataTransfer.files[0]);
    }
  };

  console.log(children);

  return (
    <div className="w-full">
      <label className="block text-gray-700 font-semibold mb-2">
        {label} <span className="text-red-500">*</span>
      </label>

      <div
        className={`relative
          flex flex-col h-[376px] items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-100 text-gray-400 font-semibold overflow-hidden
          ${height ? `h-${height}` : "p-16"}
          ${isDragging ? "border-blue-500" : ""}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {files ? (
          <>
            <Image
              className="rounded-lg cursor-pointer transition-transform duration-200 group-hover:brightness-75"
              src={URL.createObjectURL(files)}
              alt="Preview Image"
              height={150}
              width={150}
              onLoad={() => URL.revokeObjectURL(URL.createObjectURL(files))}
            />
            <Button
              variant={"outline"}
              className="absolute flex justify-center items-center gap-2 text-lg bottom-0 w-full h-12 bg-error"
              onClick={handleDelete}
            >
              <span>
                <Trash className="text-red-500" size={30} />
              </span>
              <h2>Delete</h2>
            </Button>
          </>
        ) : (
          <>
            <input
              id={label}
              type="file"
              accept={accept}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setFiles(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            <Upload size={60} color="#9ca3af" />
            <label htmlFor={label} className="cursor-pointer mt-2">
              Drag & Drop or{" "}
              <span className="text-blue-500 font-semibold">Choose file</span>{" "}
              to upload
            </label>

            <div className="text-center mt-2">
              {subLabel && <p className="text-xs font-thin">{subLabel}</p>}
              <p className="text-xs font-thin ">
                Accepted file formats: {accept === ".zip" ? "ZIP" : "JPG, PNG"}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
