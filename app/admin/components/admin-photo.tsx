"use client"

import { uploadEntityImage } from "@/app/actions/bucket-actions/store";
import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";


export default function AdminPhoto() {
    const [file, setFile] = useState<File|null>(null);
    
    async function handleUpload() {
        if (!file) return;
        toast.loading("Uploading photo...");
        const res = await uploadEntityImage("donor","1234567890", file );
        toast.dismiss();
        if (res.error) {
            toast.error(`Upload failed: ${res.error.message}`);
            return;
        }
        toast.success("Photo uploaded successfully!");
    }
  return (
    <div>
          <FileUpload files={file} setFiles={setFile} label={"upload admin photo"} accept="image/*" />
          <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
}