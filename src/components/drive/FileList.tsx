import { useState } from "react";
import { useFiles } from "../../hooks/useDriveAPI";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import { FileToolbar } from "./FileToolbar";
import { FileCard } from "./FileCard";
import { FileDetailsModal } from "./FileDetailsModal";


export const FileList = () => {
  const { token } = useGoogleAuth();
  const [orderBy, setOrderBy] = useState("modifiedTime desc");
  const [pageToken, setPageToken] = useState<string | undefined>(undefined);

  
  // Stan do zarządzania szczegółami pliku
  const [detailsId, setDetailsId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useFiles({
    token,
    orderBy,
    pageSize: 25,
    pageToken,
  });

  if (!token) {
    return <div className="text-gray-600">Zaloguj się, aby zobaczyć pliki.</div>;
  }

  return (
    <div className="space-y-3">
      <FileToolbar
        initialOrder={orderBy}
        onChangeOrder={(o) => { setOrderBy(o); setPageToken(undefined); }}
        onRefresh={() => refetch()}
      />

      {isLoading && <div className="text-sm text-gray-500">Ładowanie plików...</div>}

      {isError && <div className="text-sm text-red-600">Błąd ładowania listy plików.</div>}

      {!isLoading && data?.files?.length === 0 && (
        <div className="text-sm text-gray-500 border rounded-xl px-4 py-6 text-center bg-white">
          Brak plików. Prześlij coś, aby zacząć.
        </div>
      )}

      <div className="grid gap-2">
        {data?.files?.map((f) => (
          <FileCard
            key={f.id}
            name={f.name}
            mimeType={f.mimeType}
            size={f.size}
            modifiedTime={f.modifiedTime}
            onClick={() => setDetailsId(f.id)} // Ustawienie ID pliku do wyświetlenia szczegółów
          />
        ))}
      </div>

      {data?.nextPageToken && (
        <div className="pt-2">
          <button
            className="text-sm border rounded-lg px-3 py-2 hover:bg-gray-100"
            onClick={() => setPageToken(data.nextPageToken)}
          >
            Załaduj więcej
          </button>
        </div>
      )}

      {/* Modal do wyświetlania szczegółów pliku */}
      <FileDetailsModal
        open={Boolean(detailsId)}
        fileId={detailsId}
        onClose={() => setDetailsId(null)}
      />
    </div>
  );
};

