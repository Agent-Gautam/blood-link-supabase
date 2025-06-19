"use server";

import { getUser } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { Buffer, FileOptions } from "buffer";

type EntityType = "donor" | "organisation" | "camp";

const bucketMap: Record<EntityType, string> = {
  donor: "donor-photo",
  organisation: "organisation-photo",
  camp: "camp-banner",
};

interface UploadParams {
  entityType: EntityType;
  entityId: string;
  file: File;
}

export async function uploadEntityImage(entityType: EntityType, entityId: string, file: File) {
  const bucket = bucketMap[entityType];
  const extension = file.name.split(".").pop() || "jpg";
  const path = `${entityId}/photo.${extension}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Full access key (server only)
    {
      global: {
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        },
      },
    }
  );
  
  const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
    contentType: file.type,
    upsert: true, // allow replacing the existing image
  });

  if (error) {
    console.log("Error uploading image:", error);
    return { success: false, error: { message: error.message } };
  }

  return {
    success: true,
  };
}
