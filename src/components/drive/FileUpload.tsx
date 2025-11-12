/**
 * Komponent do przesyłania plików na Google Drive
 *
 * @description Ten komponent umożliwia przesyłanie plików na Google Drive za pomocą przeciągania i upuszczania
 * lub poprzez wybór pliku z systemowego okna dialogowego. Obsługuje różne stany przesyłania, takie jak ładowanie,
 * sukces i błąd.
 *
 * @requires
 * - useGoogleAuth: Hook do uzyskania tokenu autoryzacji Google OAuth
 * - useUploadFile: Hook do obsługi przesyłania plików za pomocą React Query
 *
 * @example
 * ```tsx
 * <FileUpload />
 * ```
 */

import { useState } from "react";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import { useUploadFile } from "../..//hooks/useDriveMutations";


export const FileUpload = () => {
  // Pobranie tokenu autoryzacji z hooka useGoogleAuth
  const { token } = useGoogleAuth();

  // Hook do przesyłania plików z obsługą React Query
  const upload = useUploadFile(token);

  // Stan dla obsługi efektu "drag over" (przeciąganie pliku nad obszarem)
  const [dragOver, setDragOver] = useState(false);

  /**
   * Funkcja obsługująca przesyłanie pliku
   * @param file - Plik do przesłania
   */
  const onFile = async (file: File) => {
    await upload.mutateAsync({ file });
  };

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-6 text-center ${dragOver ? "bg-sky-50 border-sky-400" : "bg-white"}`}
      // Obsługa przeciągania pliku nad obszarem
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      // Obsługa opuszczenia obszaru przeciągania
      onDragLeave={() => setDragOver(false)}
      // Obsługa upuszczenia pliku na obszar
      onDrop={(e) => {
        e.preventDefault(); setDragOver(false);
        const f = e.dataTransfer.files?.[0]; // Pobranie pierwszego pliku z przeciągniętych
        if (f) onFile(f);
      }}
    >
      <p className="text-sm text-gray-600">Przeciągnij i upuść plik tutaj</p>
      <div className="mt-3">
        {/* Pole wyboru pliku */}
        <input
          type="file"
          onChange={(e) => {
            const f = e.target.files?.[0]; // Pobranie pierwszego wybranego pliku
            if (f) onFile(f);
          }}
        />
      </div>

      {/* Wyświetlanie stanu przesyłania */}
      {upload.isPending && <p className="mt-3 text-sm text-gray-500">Przesyłanie...</p>}
      {upload.isSuccess && <p className="mt-3 text-sm text-green-600">Gotowe ✅</p>}
      {upload.isError && <p className="mt-3 text-sm text-red-600">Błąd uploadu</p>}
    </div>
  );
};
