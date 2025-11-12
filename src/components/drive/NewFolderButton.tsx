/**
 * Komponent przycisku do tworzenia nowych folderów na Google Drive
 *
 * @description Ten komponent umożliwia użytkownikowi tworzenie nowych folderów na Google Drive.
 * Po kliknięciu przycisku otwiera się pole tekstowe, w którym użytkownik może wpisać nazwę folderu.
 * Po zatwierdzeniu nazwy folder zostaje utworzony za pomocą Google Drive API.
 *
 * @requires
 * - useGoogleAuth: Hook do uzyskania tokenu autoryzacji Google OAuth
 * - useCreateFolder: Hook do obsługi tworzenia folderów za pomocą React Query
 *
 * @example
 * ```tsx
 * <NewFolderButton />
 * ```
 */

import { useState } from "react";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import { useCreateFolder } from "../../hooks/useCreateFolder";

export const NewFolderButton = () => {
  // Pobranie tokenu autoryzacji z hooka useGoogleAuth
  const { token } = useGoogleAuth();

  // Hook do tworzenia folderów z obsługą React Query
  const create = useCreateFolder(token);

  // Stan kontrolujący widoczność pola tekstowego
  const [open, setOpen] = useState(false);

  // Stan przechowujący nazwę nowego folderu
  const [name, setName] = useState("");

  /**
   * Funkcja obsługująca tworzenie nowego folderu
   * @description Sprawdza, czy nazwa folderu nie jest pusta, a następnie wywołuje mutację
   * do utworzenia folderu. Po zakończeniu resetuje stan komponentu.
   */
  const onCreate = async () => {
    if (!name.trim()) return; // Sprawdzenie, czy nazwa nie jest pusta
    await create.mutateAsync({ name: name.trim() }); // Wywołanie mutacji do utworzenia folderu
    setName(""); // Resetowanie nazwy
    setOpen(false); // Zamknięcie pola tekstowego
  };

  return (
    <div className="flex items-center gap-2">
      {/* Przycisk otwierający pole tekstowe do wpisania nazwy folderu */}
      <button className="text-sm border rounded-lg px-3 py-2 hover:bg-gray-100" onClick={() => setOpen(true)}>
        Nowy folder
      </button>

      {open && (
        <div className="flex items-center gap-2">
          {/* Pole tekstowe do wpisania nazwy folderu */}
          <input
            className="border rounded-lg px-2 py-1 text-sm"
            placeholder="Nazwa folderu"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {/* Przycisk do utworzenia folderu */}
          <button className="text-sm border rounded-lg px-3 py-1 hover:bg-gray-100" onClick={onCreate}>
            Utwórz
          </button>
          {/* Przycisk do anulowania operacji */}
          <button className="text-sm px-2 py-1" onClick={() => setOpen(false)}>
            Anuluj
          </button>
        </div>
      )}
    </div>
  );
};

