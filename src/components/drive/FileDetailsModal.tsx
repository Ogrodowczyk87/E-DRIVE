import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import { useFileDetails } from "../../hooks/useDriveAPI";

/**
 * Komponent FileDetailsModal
 * 
 * Ten komponent wyświetla modal z szczegółowymi informacjami o wybranym pliku.
 * Pobiera szczegóły pliku za pomocą hooka `useFileDetails` i wyświetla je w stylizowanym modalu.
 * Modal jest widoczny tylko wtedy, gdy właściwość `open` jest ustawiona na true.
 * 
 * Propsy:
 * - `open` (boolean): Określa, czy modal jest widoczny.
 * - `fileId` (string | null): ID pliku, którego szczegóły mają być wyświetlone.
 * - `onClose` (function): Funkcja zwrotna do zamknięcia modalu.
 */

export const FileDetailsModal = ({ open, onClose, fileId }: FileDetailsModalProps) => {
  // Pobierz token uwierzytelniający za pomocą hooka Google Auth
  const { token } = useGoogleAuth();

  // Pobierz szczegóły pliku za pomocą niestandardowego hooka `useFileDetails`
  const { data, isLoading } = useFileDetails(token, fileId);

  // Jeśli modal nie jest otwarty, nie renderuj niczego
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-96 shadow-xl">
        {/* Nagłówek modalu */}
        <h3 className="text-lg font-medium mb-4">Szczegóły pliku</h3>

        {/* Stan ładowania */}
        {isLoading && <p className="text-sm">Wczytywanie...</p>}

        {/* Wyświetl szczegóły pliku */}
        {data && (
          <div className="space-y-2 text-sm">
            <p><strong>Nazwa:</strong> {data.name}</p>
            <p><strong>Typ:</strong> {data.mimeType}</p>
            <p><strong>Rozmiar:</strong> {data.size ?? "—"}</p>
            <p><strong>Zmodyfikowano:</strong> {data.modifiedTime}</p>
            <p><strong>ID:</strong> {data.id}</p>
          </div>
        )}

        {/* Przycisk zamknięcia */}
        <button onClick={onClose} className="mt-4 border px-4 py-2 rounded-lg">
          Zamknij
        </button>
      </div>
    </div>
  );
};

interface FileDetailsModalProps {
  open: boolean;
  fileId: string | null;
  onClose: () => void;
}
