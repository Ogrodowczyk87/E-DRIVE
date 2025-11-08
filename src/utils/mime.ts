/**
 * Mapuje typ MIME pliku na odpowiednią nazwę ikony
 * Używane do wyświetlania odpowiednich ikon w UI na podstawie typu pliku
 * 
 * @param mime - Typ MIME pliku (np. "image/jpeg", "application/pdf")
 * @returns Nazwa ikony jako string (np. "image", "pdf", "folder")
 */
export const iconFromMime = (mime: string) => {
  // Google Drive specjalny typ MIME dla folderów
  if (mime === "application/vnd.google-apps.folder") return "folder";
  
  // Wszystkie typy obrazów: image/jpeg, image/png, image/gif, image/webp, itp.
  if (mime.startsWith("image/")) return "image";
  
  // Wszystkie typy wideo: video/mp4, video/avi, video/mkv, video/webm, itp.
  if (mime.startsWith("video/")) return "video";
  
  // Wszystkie typy audio: audio/mp3, audio/wav, audio/ogg, audio/flac, itp.
  if (mime.startsWith("audio/")) return "audio";
  
  // Pliki PDF: application/pdf, application/x-pdf
  if (mime.includes("pdf")) return "pdf";
  
  // Archiwa: application/zip, application/x-rar-compressed, application/x-7z-compressed
  if (mime.includes("zip") || mime.includes("rar")) return "archive";
  
  // Pliki kodu: application/json, application/javascript, text/typescript, itp.
  if (mime.includes("json") || mime.includes("javascript") || mime.includes("typescript")) return "code";
  
  // Wszystkie pliki tekstowe: text/plain, text/html, text/css, text/csv, itp.
  if (mime.startsWith("text/")) return "text";
  
  // Domyślna ikona dla nierozpoznanych typów plików
  return "file";
};
