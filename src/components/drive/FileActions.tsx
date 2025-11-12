import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import { useDeleteFile } from "../../hooks/useDriveMutations";
import { useDownloadFile } from "../../hooks/useDownloadFile";
import { saveBlob } from "../../utils/download";

export const FileActions = ({ id, name, mimeType }: { id: string; name: string; mimeType: string }) => {
  const { token } = useGoogleAuth();
  const del = useDeleteFile(token);
  const dl = useDownloadFile(token);

  return (
    <div className="flex items-center gap-2">
      <button
        className="text-sm border rounded-lg px-2 py-1 hover:bg-gray-100"
        onClick={async () => {
          const { blob, name: filename } = await dl.mutateAsync({ fileId: id, name, mimeType });
          saveBlob(blob, filename);
        }}
      >
        Pobierz
      </button>

      <button
        className="text-sm border rounded-lg px-2 py-1 hover:bg-red-50 text-red-600 border-red-200"
        onClick={() => del.mutate(id)}
      >
        Usuń
      </button>
    </div>
  );
};
