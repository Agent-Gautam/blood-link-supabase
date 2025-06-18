export default function fetchImage(bucketName: string, id: string) {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${id}/photo.png`;
}