import { upload } from "@vercel/blob/client";

// Upload direct navigateur → Vercel Blob, contourne la limite de 4,5 Mo des
// Vercel Functions (le fichier ne transite jamais par le serveur). Route
// backend-myalfa dédiée (/api/creation-sct/upload-token), publique côté JWT
// car ce formulaire est utilisé par un associé/prospect sans compte — voir
// backend-myalfa/controllers/Mission/creationSctController.js (requireAuth: false).
//
// onProgress reçoit {loaded, total, percentage} à chaque avancée de l'envoi
// — utile pour informer l'utilisateur sur les gros fichiers.
export async function uploadFileToBlob(file, handleUploadUrl, onProgress) {
  const blob = await upload(file.name, file, {
    access: "public",
    handleUploadUrl,
    onUploadProgress: onProgress,
  });
  return blob.url;
}
