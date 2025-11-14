import { useFileDetails } from "../../hooks/useDriveAPI";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";

type FileDetailsModalProps = {
  open: boolean;
  fileId: string | null;
  onClose: () => void;
};

export const FileDetailsModal = ({ open, onClose, fileId }: FileDetailsModalProps) => {
  const { token } = useGoogleAuth();
  const { data, isLoading } = useFileDetails(token, fileId);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-96 shadow-xl">

        <h3 className="text-lg font-medium mb-4">Szczegóły pliku</h3>

        {isLoading && <p className="text-sm">Wczytywanie...</p>}

        {data && (
          <div className="space-y-2 text-sm">
            <p><strong>Nazwa:</strong> {data.name}</p>
            <p><strong>Typ:</strong> {data.mimeType}</p>
            <p><strong>Rozmiar:</strong> {data.size ?? "—"}</p>
            <p><strong>Zmodyfikowano:</strong> {data.modifiedTime}</p>
            <p><strong>ID:</strong> {data.id}</p>
          </div>
        )}

        <button onClick={onClose} className="mt-4 border px-4 py-2 rounded-lg">
          Zamknij
        </button>
      </div>
    </div>
  );
};
