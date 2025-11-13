/**
 * @fileoverview Niestandardowe hooki React Query do operacji na Google Drive
 * 
 * @description Ten moduł dostarcza niestandardowe hooki, które opakowują operacje Google Drive API
 * za pomocą mutacji React Query. Każdy hook obsługuje konkretne operacje na plikach, takie jak upload,
 * usuwanie, tworzenie folderów itp. Zawierają one odpowiednią obsługę błędów, stany ładowania,
 * optymistyczne aktualizacje i automatyczną inwalidację cache dla optymalnego doświadczenia użytkownika.
 * 
 * @features
 * - Upload plików z automatycznym odświeżaniem cache
 * - Usuwanie plików z optymistycznymi aktualizacjami
 * - Tworzenie folderów z natychmiastowymi aktualizacjami UI
 * - Pobieranie i eksportowanie plików
 * - Kompleksowa obsługa błędów
 * - Typowanie w TypeScript
 * 
 * @requires
 * - @tanstack/react-query do zarządzania stanem
 * - Narzędzia Google Drive API z @/utils/drive
 * - Ważny token Google OAuth do autoryzacji
 * 
 * @author Aplikacja E-Drive
 * @version 1.0.0
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadFile, deleteFile, createFolder, downloadBinary, exportGoogleFile, createPublicPERmission } from "../utils/drive";

/**
 * Niestandardowy hook do uploadu plików na Google Drive
 * 
 * @description Ten hook dostarcza mutację React Query do uploadu plików na Google Drive.
 * Obsługuje proces uploadu, stany błędów, stany ładowania i automatycznie odświeża
 * listę plików po udanym uploadzie.
 * 
 * @param token - Token dostępu Google OAuth do autoryzacji API (null, jeśli brak autoryzacji)
 * @returns Obiekt mutacji React Query z funkcjonalnością uploadu
 * 
 * @example
 * ```typescript
 * const uploadMutation = useUploadFile(token);
 * 
 * const handleUpload = (file: File) => {
 *   uploadMutation.mutate({
 *     file,
 *     parentID: 'folder-id-here'
 *   });
 * };
 * 
 * // Sprawdzanie statusu uploadu
 * if (uploadMutation.isLoading) return <Spinner />;
 * if (uploadMutation.isError) return <ErrorMessage />;
 * ```
 */
export function useUploadFile(token: string | null) {
  // Uzyskanie dostępu do klienta cache React Query
  const qc = useQueryClient();

  return useMutation({
    /**
     * Główna funkcja uploadu wywoływana, gdy uruchamiana jest mutation.mutate()
     * @param args - Parametry uploadu zawierające plik i folder docelowy
     * @param args.file - Obiekt File do uploadu (z HTML5 File API)
     * @param args.parentID - ID folderu Google Drive, do którego plik ma być przesłany
     * @returns Promise rozwiązujący wynik uploadu z Google Drive API
     */
    mutationFn: async (args: { file: File; parentId?: string }) => {
      // Sprawdzenie bezpieczeństwa: zapobieganie uploadowi bez autoryzacji
      if (!token) throw new Error("NO_TOKEN");

      // Wywołanie rzeczywistej funkcji uploadu Google Drive API
      // Non-null assertion (!) jest bezpieczne, ponieważ sprawdziliśmy powyżej
      return uploadFile(token!, args.file, args.parentId || '');
    },
    
    /**
     * Callback wywoływany po udanym uploadzie
     * Zapewnia, że UI natychmiast pokazuje nowo przesłany plik
     */
    onSuccess: () => {
      // Inwalidacja cache zapytania "files", aby wymusić nowe pobranie
      // To zaktualizuje listę plików w UI, aby zawierała nowy plik
      qc.invalidateQueries({ queryKey: ["files"] });
    },
  });
}

/**
 * Niestandardowy hook do usuwania plików z Google Drive z optymistycznymi aktualizacjami
 * 
 * @description Ten hook dostarcza mutację React Query do usuwania plików z Google Drive.
 * Implementuje optymistyczne aktualizacje - plik znika z UI natychmiast, zanim
 * wywołanie API zostanie zakończone. Jeśli usunięcie się nie powiedzie, plik zostanie przywrócony do UI.
 * 
 * @param token - Token dostępu Google OAuth do autoryzacji API (null, jeśli brak autoryzacji)
 * @returns Obiekt mutacji React Query z funkcjonalnością usuwania i optymistycznymi aktualizacjami
 * 
 * @example
 * ```typescript
 * const deleteMutation = useDeleteFile(token);
 * 
 * const handleDelete = (fileId: string) => {
 *   if (confirm('Are you sure?')) {
 *     deleteMutation.mutate(fileId);
 *   }
 * };
 * 
 * // Plik zniknie natychmiast z UI
 * // Jeśli usunięcie się nie powiedzie, zostanie automatycznie przywrócony
 * ```
 * 
 * @see {@link https://tanstack.com/query/latest/docs/react/guides/optimistic-updates}
 */
export function useDeleteFile(token: string | null) {
  // Uzyskanie dostępu do cache React Query dla optymistycznych aktualizacji i inwalidacji
  const qc = useQueryClient();
  
  return useMutation({
    /**
     * Główna funkcja usuwania wywoływana, gdy uruchamiana jest mutation.mutate()
     * @param fileId - ID pliku Google Drive do usunięcia
     * @returns Promise rozwiązujący się, gdy plik zostanie usunięty z Google Drive
     */
    mutationFn: async (fileId: string) => {
      // Sprawdzenie bezpieczeństwa: zapobieganie usuwaniu bez autoryzacji
      if (!token) throw new Error("NO_TOKEN");
      
      // Wywołanie rzeczywistej funkcji usuwania Google Drive API
      return deleteFile(token, fileId);
    },
    
    /**
     * Optymistyczna aktualizacja: Usuń plik z UI przed zakończeniem wywołania API
     * To sprawia, że aplikacja wydaje się szybsza i bardziej responsywna
     * 
     * @param fileId - ID pliku, który jest usuwany
     * @returns Obiekt kontekstu z poprzednimi danymi do potencjalnego przywrócenia
     */
    onMutate: async (fileId) => {
      // Anulowanie wszelkich wychodzących odświeżeń, aby uniknąć warunków wyścigu
      await qc.cancelQueries({ queryKey: ["files"] });
      
      // Zrzut poprzedniej wartości do potencjalnego przywrócenia
      const prev = qc.getQueryData<any>(["files"]);
      
      // Optymistyczna aktualizacja cache poprzez usunięcie pliku
      // To natychmiast usuwa plik z UI
      if (prev?.files) {
        qc.setQueryData(["files"], {
          ...prev,
          files: prev.files.filter((f: any) => f.id !== fileId),
        });
      }
      
      // Zwrócenie kontekstu do przywrócenia w przypadku błędu
      return { prev };
    },
    
    /**
     * Obsługa błędów: Przywrócenie poprzedniego stanu, jeśli usunięcie się nie powiedzie
     * To "cofa" optymistyczną aktualizację, jeśli coś poszło nie tak
     * 
     * @param _err - Wystąpiły błąd (nieużywane)
     * @param _vars - Zmienne przekazane do mutationFn (nieużywane)
     * @param ctx - Kontekst zwrócony z onMutate zawierający poprzednie dane
     */
    onError: (_err, _vars, ctx) => {
      // Przywrócenie: przywrócenie pliku do UI, jeśli usunięcie się nie powiodło
      if (ctx?.prev) qc.setQueryData(["files"], ctx.prev);
    },
    
    /**
     * Zawsze uruchamiane po zakończeniu mutacji (sukces lub błąd)
     * Zapewnia spójność danych poprzez ponowne pobranie z serwera
     */
    onSettled: () => {
      // Inwalidacja i ponowne pobranie, aby zapewnić zgodność UI z serwerem
      // To jest siatka bezpieczeństwa, aby wychwycić wszelkie niespójności
      qc.invalidateQueries({ queryKey: ["files"] });
    }
  });
}

/**
 * Hook do tworzenia folderów na Google Drive
 * 
 * @description Ten hook umożliwia tworzenie nowych folderów na Google Drive za pomocą React Query.
 * Po udanym utworzeniu folderu automatycznie odświeża listę plików w cache.
 * 
 * @param token - Token autoryzacji Google OAuth (null, jeśli brak autoryzacji)
 * @returns Obiekt mutacji React Query do tworzenia folderów
 */
export function useCreateFolder(token: string | null) {
  const qc = useQueryClient(); // Uzyskanie dostępu do cache React Query

  return useMutation({
    /**
     * Funkcja odpowiedzialna za tworzenie folderu
     * @param args - Parametry tworzenia folderu
     * @param args.name - Nazwa nowego folderu
     * @param args.parentId - Opcjonalne ID folderu nadrzędnego
     * @returns Promise rozwiązujący się po utworzeniu folderu
     */
    mutationFn: async (args: { name: string; parentId?: string }) => {
      if (!token) throw new Error("NO_TOKEN"); // Sprawdzenie autoryzacji
      return createFolder(token, args.name, args.parentId); // Wywołanie API do tworzenia folderu
    },
    
    /**
     * Callback wywoływany po udanym utworzeniu folderu
     * Odświeża listę plików w cache
     */
    onSuccess: () => qc.invalidateQueries({ queryKey: ["files"] }),
  });
}

/**
 * Hook do pobierania plików z Google Drive
 * 
 * @description Ten hook umożliwia pobieranie plików z Google Drive, w tym eksportowanie
 * plików Google Docs, Sheets i Slides do formatu PDF.
 * 
 * @param token - Token autoryzacji Google OAuth (null, jeśli brak autoryzacji)
 * @returns Obiekt mutacji React Query do pobierania plików
 */
export function useDownloadFile(token: string | null) {
  return useMutation({
    /**
     * Funkcja odpowiedzialna za pobieranie pliku
     * @param args - Parametry pobierania pliku
     * @param args.fileId - ID pliku do pobrania
     * @param args.mimeType - Opcjonalny MIME type pliku (np. dla eksportu)
     * @param args.name - Nazwa pliku do zapisania
     * @returns Promise rozwiązujący się z obiektem Blob i nazwą pliku
     */
    mutationFn: async (args: { fileId: string; mimeType?: string; name: string }) => {
      if (!token) throw new Error("NO_TOKEN"); // Sprawdzenie autoryzacji

      // Eksport plików Google Docs, Sheets, Slides do PDF
      if ((args.mimeType || "").startsWith("application/vnd.google-apps")) {
        const blob = await exportGoogleFile(token, args.fileId, "application/pdf");
        return { blob, name: `${args.name}.pdf` };
      } else {
        // Pobieranie innych typów plików
        const blob = await downloadBinary(token, args.fileId);
        return { blob, name: args.name };
      }
    },
  });
}

/**
 * Hook do zarządzania mutacjami na Google Drive
 * 
 * @description Ten hook umożliwia wykonywanie różnych operacji na plikach Google Drive,
 * takich jak tworzenie uprawnień publicznych.
 * 
 * @param token - Token autoryzacji Google OAuth (null, jeśli brak autoryzacji)
 * @returns Obiekt z funkcją mutacji do zarządzania plikami
 */
export function useDriveMutations(token: string | null) {
  return {
    /**
     * Funkcja odpowiedzialna za tworzenie uprawnień publicznych dla pliku
     * @param fileId - ID pliku, dla którego mają zostać utworzone uprawnienia
     * @returns Promise rozwiązujący się po utworzeniu uprawnień
     */
    mutation: async (fileId: string) => {
      if (!token) throw new Error("NO_TOKEN"); // Sprawdzenie autoryzacji
      return createPublicPERmission(token, fileId); // Wywołanie API do tworzenia uprawnień
    },
  };
}