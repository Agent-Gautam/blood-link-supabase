import { createClient } from "@/utils/supabase/server";

export default async function fetchImage(bucketName: string, id: string) {
    const folderName = id;
    const supabase = await createClient();
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(folderName);

    if (data && data.length > 0) {
      const fileName = data[0].name; // e.g., 'photo.png'
      const fullPath = `${folderName}/${fileName}`;
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fullPath);
      return urlData.publicUrl;
    }

}