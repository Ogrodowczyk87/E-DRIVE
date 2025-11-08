// Import typu odpowiedzi z Google Drive API
import type { DriveListResponse } from "./types";

// Bazowy URL dla Google Drive API v3 - endpoint do operacji na plikach
const BASE = "https://www.googleapis.com/drive/v3/files";

// Parametr 'fields' określa jakie dane chcemy otrzymać z API
// files(...) - dane o plikach: id, nazwa, rozmiar, data modyfikacji, typ MIME
// nextPageToken - token do paginacji (następna strona wyników)
const  fields = "files(id,name,size,modifiedTime, mimeType),nextPageToken";

/**
 * Pobiera listę plików z Google Drive
 * @param token - Token autoryzacyjny Google OAuth (Bearer token)
 * @param opts - Opcjonalne parametry filtrowania i paginacji
 * @param opts.q - Query do filtrowania plików (np. "name contains 'document'")
 * @param opts.pageSize - Ilość plików na stronę (domyślnie 20, max 1000)
 * @param opts.pageToken - Token do pobrania kolejnej strony wyników
 * @param opts.orderBy - Sposób sortowania (np. "modifiedTime desc", "name")
 * @returns Promise z listą plików i tokenem następnej strony
 */
export async function listFiles(
    token: string,
    opts?: { q?: string; pageSize?: number; pageToken?: string; orderBy?: string }
): Promise<DriveListResponse> {
    
    // Tworzenie obiektu URLSearchParams do budowy query string
    const params = new URLSearchParams()
    
    // Ustawienie stałych parametrów
    params.set("fields", fields);                         // Jakie dane pobrać
    params.set("pageSize", String(opts?.pageSize ?? 20)); // Rozmiar strony (domyślnie 20)
    
    // Ustawienie opcjonalnych parametrów (tylko jeśli zostały przekazane)
    if (opts?.q) params.set("q", opts.q);                    // Filtrowanie
    if (opts?.pageToken) params.set("pageToken", opts.pageToken); // Paginacja
    if (opts?.orderBy) params.set("orderBy", opts.orderBy);       // Sortowanie

    // Wykonanie zapytania HTTP GET do Google Drive API
    const res = await fetch(`${BASE}?${params.toString()}`, {
        headers: {
            // Autoryzacja za pomocą Bearer token
            Authorization: `Bearer ${token}`,
        },
    });

    // Obsługa błędów autoryzacji (401 - nieautoryzowany, 403 - brak uprawnień)
    if (res.status === 401 || res.status === 403) {
        throw new Error("Unauthorized: Invalid or expired token");
    }

    // Obsługa innych błędów HTTP
    if (!res.ok) {
        const errorData = await res.text();
        throw new Error(errorData || "Error fetching files");
    }

    // Zwrócenie sparsowanej odpowiedzi JSON
    // Zawiera: { files: DriveFile[], nextPageToken?: string }
    return res.json();

}