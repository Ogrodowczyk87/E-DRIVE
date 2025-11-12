/**
 * Zapisuje obiekt Blob jako plik na urządzeniu użytkownika
 *
 * @description Funkcja tworzy tymczasowy URL dla obiektu Blob, a następnie
 * generuje element <a>, który umożliwia pobranie pliku. Po kliknięciu linku
 * plik zostaje pobrany, a tymczasowy URL jest usuwany w celu zwolnienia zasobów.
 *
 * @param blob - Obiekt Blob reprezentujący dane do zapisania
 * @param filename - Nazwa pliku, który zostanie zapisany na urządzeniu użytkownika
 *
 * @example
 * ```typescript
 * const blob = new Blob(['Hello, world!'], { type: 'text/plain' });
 * saveBlob(blob, 'example.txt');
 * ```
 */
export function saveBlob(blob: Blob, filename: string) {
    // Tworzy tymczasowy URL dla obiektu Blob
    const url = window.URL.createObjectURL(blob);

    // Tworzy element <a>, który umożliwia pobranie pliku
    const a = document.createElement('a');
    a.href = url; // Ustawia URL jako źródło linku
    a.download = filename; // Ustawia nazwę pliku do pobrania

    // Symuluje kliknięcie na link, aby rozpocząć pobieranie
    a.click();

    // Usuwa tymczasowy URL, aby zwolnić zasoby
    URL.revokeObjectURL(url);
}