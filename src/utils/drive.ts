// Import typu odpowiedzi z Google Drive API
import type { DriveListResponse } from "./types";

// Bazowy URL dla Google Drive API v3 - endpoint do operacji na plikach
const BASE = "https://www.googleapis.com/drive/v3/files";
const UPLOAD = "https://www.googleapis.com/upload/drive/v3/files";

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


/**
 * Przesyła plik na Google Drive
 * @param token - Token autoryzacyjny Google OAuth (Bearer token)
 * @param file - Plik do przesłania (obiekt File z input[type="file"])
 * @param parentID - ID folderu docelowego na Google Drive
 * @returns Promise z danymi przesłanego pliku
 */
export async function uploadFile(
    token: string,
    file: File,
    parentID: string
){
    // Przygotowanie metadanych pliku dla Google Drive API
    const metadata: Record<string, any> = {
        name: file.name,                                    // Nazwa pliku
        mimeType: file.type || 'application/octet-stream', // Typ MIME z fallbackiem
    }
    
    // Jeśli podano folder docelowy, dodaj go do metadanych
    if (parentID) metadata.parents = [parentID];

    // Tworzenie FormData dla multipart upload (metadata + plik)
    const form = new FormData();
    
    // Dodanie metadanych jako JSON Blob z odpowiednim Content-Type
    form.append(
        'metadata',
        new Blob([JSON.stringify(metadata)], {type: 'application/json'})
    )
    
    // Dodanie rzeczywistego pliku
    form.append("file", file)

    // Wykonanie zapytania POST do upload endpoint
    const res = await fetch (`${UPLOAD}?uploadType=multipart`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`, // Autoryzacja Bearer token
            // Content-Type automatycznie ustawiony przez FormData jako multipart/form-data
        },
        body: form, // FormData z metadanymi i plikiem
    });

    // Obsługa błędów uploadu
    if(!res.ok) throw new Error("Error uploading file");
    
    // Zwrócenie danych przesłanego pliku (id, name, mimeType, itp.)
    return res.json();
}

/**
 * Usuwa plik z Google Drive
 * @param token - Token autoryzacyjny Google OAuth (Bearer token) 
 * @param fileID - Unikalny identyfikator pliku do usunięcia
 * @returns Promise z wartością true jeśli operacja się powiodła
 */
export async function deleteFile(
    token: string,
    fileID: string
){
    // Wykonanie zapytania DELETE do konkretnego pliku
    const res = await fetch(`${BASE}/${fileID}`, {
        method: 'DELETE',        // HTTP metoda dla usuwania zasobów
        headers: {
            Authorization: `Bearer ${token}`, // Autoryzacja - kto usuwa plik
        },
    });
    
    // Sprawdzenie czy operacja się powiodła
    if(!res.ok) throw new Error("Error deleting file");
    
    // Zwrócenie potwierdzenia usunięcia
    return true;
}

/**
 * Tworzy nowy folder na Google Drive
 * @param token - Token autoryzacyjny Google OAuth (Bearer token)
 * @param name - Nazwa nowego folderu
 * @param parentID - Opcjonalne ID folderu nadrzędnego (jeśli nie podano, folder będzie w katalogu głównym)
 * @returns Promise z danymi utworzonego folderu
 */
export async function createFolder(
    token: string,
    name: string,
    parentID?: string
){
    // Przygotowanie danych folderu - Record<string,any> pozwala na elastyczne dodawanie pól
    const body: Record<string, any> = {
        name,                                               // Nazwa folderu
        mimeType: 'application/vnd.google-apps.folder',    // Specjalny MIME type Google Drive dla folderów
    }
    
    // Jeśli podano folder nadrzędny, ustaw go jako parent
    if(parentID) body.parents = [parentID];
    
    // Wykonanie zapytania POST do tworzenia nowego zasobu
    const res = await fetch(`${BASE}`, {
        method: 'POST',                                     // HTTP metoda dla tworzenia nowych zasobów
        headers: {
            Authorization: `Bearer ${token}`,               // Autoryzacja użytkownika
            'Content-Type': 'application/json',             // Informuje że wysyłamy JSON
        },
        body: JSON.stringify(body),                         // Konwersja obiektu na JSON string
    });
    
    // Obsługa błędów tworzenia folderu
    if(!res.ok) throw new Error("Error creating folder");
    
    // Zwrócenie danych utworzonego folderu (id, name, mimeType, parents, itp.)
    return res.json();
}

/**
 * Pobiera binarne dane pliku z Google Drive (download)
 * @param token - Token autoryzacyjny Google OAuth (Bearer token)
 * @param fileID - Unikalny identyfikator pliku do pobrania
 * @returns Promise z ArrayBuffer zawierającym surowe dane pliku
 */
export async function downloadBinary(
    token: string,
    fileID: string
){
    // Zapytanie z parametrem alt=media - pobiera surową zawartość pliku zamiast metadanych
    const res = await fetch(`${BASE}/${fileID}?alt=media`, {
        headers: {
            Authorization: `Bearer ${token}`,               // Autoryzacja dostępu do pliku
        },
    });
    
    // Sprawdzenie czy download się powiódł
    if(!res.ok) throw new Error("Error downloading file");
    
    // Zwrócenie surowych danych binarnych pliku jako ArrayBuffer
    return res.blob();
}

/**
 * Eksportuje plik Google Workspace (Docs, Sheets, Slides) do określonego formatu
 * @param token - Token autoryzacyjny Google OAuth (Bearer token)  
 * @param fileID - Unikalny identyfikator pliku Google Workspace
 * @param mimeType - Docelowy typ MIME do eksportu (np. 'application/pdf', 'text/plain')
 * @returns Promise z ArrayBuffer zawierającym wyeksportowane dane
 */
export async function exportGoogleFile(
    token: string,
    fileID: string,
    mimeType: string
){
    // Endpoint /export służy do konwersji plików Google Workspace na standardowe formaty
    // encodeURIComponent zabezpiecza MIME type przed problemami z URL
    const res = await fetch(`${BASE}/${fileID}/export?mimeType=${encodeURIComponent(mimeType)}`, {
        headers: {
            Authorization: `Bearer ${token}`,               // Autoryzacja dostępu do pliku
        },
    });
    
    // Sprawdzenie czy eksport się powiódł
    if(!res.ok) throw new Error("Error exporting Google file");
    
    // Zwrócenie wyeksportowanych danych w wybranym formacie
    return res.blob();
}

export async function createPublicPERmission(
    token: string,
    fileID: string              
) {
    const body = {
        role: "reader",
        type: "anyone"
    };

    const res = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileID}/permissions`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body), 
        }
        
    )
    if (!res.ok) throw new Error("Error creating public permission");

    return res.json();
}

export async function getFileDetails(token: string, fileId: string) {
  const fields = "*"; // pobiera absolutnie wszystko
  const res = await fetch(
    `${BASE}/files/${fileId}?fields=${fields}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error("DETAILS_ERROR");
  return res.json();
}
