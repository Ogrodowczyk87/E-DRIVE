/**
 * Formatuje rozmiar pliku z bajtów na czytelną jednostkę (B, KB, MB, GB, TB)
 * @param n - Rozmiar w bajtach jako string (z Google Drive API)
 * @returns Sformatowany rozmiar z jednostką lub '—' jeśli brak danych
 */
export const formatBytes = (n?: string) => {
    // Sprawdzenie czy wartość istnieje
    if (!n) return '—';
    
    // Konwersja string na number
    const bytes = Number(n);
    
    // Sprawdzenie czy konwersja się powiodła i czy wartość > 0
    if (!bytes) return "—";
    
    // Stała 1024 - standardowa jednostka dla jednostek binarnych
    const k = 1024;
    
    // Tablica jednostek od najmniejszej do największej
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    
    // Obliczanie indeksu odpowiedniej jednostki
    // Math.log(bytes) / Math.log(k) = log_k(bytes)
    // Pokazuje ile razy trzeba podzielić przez 1024
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    // Obliczanie końcowej wartości:
    // bytes / Math.pow(k, i) - dzielenie przez odpowiednią potęgę 1024
    // .toFixed(1) - zaokrąglenie do 1 miejsca po przecinku
    // parseFloat() - usunięcie zbędnych zer (np. "1.0" -> "1")
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Formatuje datę z formatu ISO na lokalny format daty i czasu
 * @param iso - Data w formacie ISO string (np. "2024-11-08T10:30:00Z")
 * @returns Sformatowana data w lokalnym formacie lub '—' jeśli brak danych
 */
export const formatDate = (iso?: string) => 
    // Operator ternary: jeśli iso istnieje, formatuj datę, w przeciwnym razie zwróć '—'
    // new Date(iso) - tworzy obiekt Date z ISO string
    // .toLocaleString() - formatuje według ustawień lokalnych użytkownika
    iso ? new Date(iso).toLocaleString() : '—';