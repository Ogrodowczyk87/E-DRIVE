import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import { useDeleteFile, useDownloadFile } from "../../hooks/useDriveMutations";
import { saveBlob } from "../../utils/download";

export const FileActions = ({ id, name, mimeType }: { id: string; name: string; mimeType: string }) => {
  const { token } = useGoogleAuth();
  const del = useDeleteFile(token);
  const dl = useDownloadFile(token);

  return (
    <div className="flex items-center gap-2">
      {/* Pobieranie pliku */}
      <button
        className="text-sm border rounded-lg px-2 py-1 hover:bg-gray-100"
        onClick={async () => {
          try {
            // ⬇️ PRAWIDŁOWA wersja — bez tworzenia nowego Blob
            const { blob, name: filename } = await dl.mutateAsync({
              fileId: id,
              name,
              mimeType
            });

            saveBlob(blob, filename); // zapis
          } catch (e) {
            console.error("Błąd pobierania", e);
          }
        }}
      >
        Pobierz
      </button>

      {/* Usuwanie pliku */}
      <button
        className="text-sm border rounded-lg px-2 py-1 hover:bg-red-50 text-red-600 border-red-200"
        onClick={() => del.mutate(id)}
      >
        Usuń
      </button>
    </div>
  );
};
