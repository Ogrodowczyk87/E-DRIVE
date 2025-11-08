// Import hooka useQuery z React Query do zarządzania stanem serwera
import {useQuery} from '@tanstack/react-query';
// Import funkcji do komunikacji z Google Drive API
import {listFiles} from '../utils/drive';
// Import typu odpowiedzi z Google Drive API
import  type {DriveListResponse} from '../utils/types';

// Typ definiujący parametry dla hooka useFiles
type UseFilesParams = {
    token: string | null;    // Token autoryzacyjny Google OAuth (null gdy nie zalogowany)
    q?: string;             // Query do filtrowania plików (opcjonalne)
    pageSize?: number;      // Ilość plików na stronę (opcjonalne)
    pageToken?: string;     // Token do paginacji - kolejna strona (opcjonalne)
    orderBy?: string;       // Sposób sortowania wyników (opcjonalne)
}

/**
 * Custom hook do pobierania plików z Google Drive używając React Query
 * 
 * React Query zapewnia:
 * - Automatyczne cachowanie wyników
 * - Refetching w tle
 * - Loading/error states
 * - Optymistyczne aktualizacje
 * - Automatyczne invalidation
 * 
 * @param params - Parametry zapytania do Google Drive API
 * @returns Obiekt z danymi, stanem ładowania, błędami i funkcjami React Query
 */
export function useFiles(params: UseFilesParams) {
    // Destrukturyzacja parametrów dla czytelności
    const { token, q, pageSize, pageToken, orderBy  } = params;

    // useQuery - główny hook React Query do pobierania danych
    return useQuery<DriveListResponse, Error>({
        
        // Unikalna identyfikacja zapytania - używana do cachowania
        // Zmiana którejkolwiek wartości spowoduje ponowne zapytanie
        queryKey: [
            "files",  // Namespace dla zapytań o pliki
            { token, q, pageSize, pageToken, orderBy }  // Parametry jako część klucza
        ],
        
        // Funkcja wykonująca faktyczne zapytanie do API
        queryFn: async () => {
            // Sprawdzenie czy token istnieje - bez tokena nie można pobrać plików
            if (!token) {
                throw new Error("No token provided");
            }
            
            // Wywołanie funkcji API z przekazanymi parametrami
            return listFiles(token, { q, pageSize, pageToken, orderBy });
        },
        
        // Zapytanie wykonuje się tylko gdy token istnieje
        // Boolean(token) konwertuje string na true, null na false
        enabled: Boolean(token),
        
        // Czas przez który dane są uważane za "świeże" (30 sekund)
        // Przez ten czas React Query nie wykona ponownego zapytania
        staleTime: 30_000, // 30 sekund
        
        // Wyłączenie automatycznego refetch gdy użytkownik wraca do okna
        // Zapobiega niepotrzebnym zapytaniom przy przełączaniu kart
        refetchOnWindowFocus: false,
    })
}