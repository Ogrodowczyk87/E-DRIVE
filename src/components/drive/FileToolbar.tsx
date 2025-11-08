// Import hooka useState do zarządzania lokalnym stanem komponentu
import { useState } from "react";

// Interfejs definiujący właściwości komponentu FileToolbar
type Props = {
  initialOrder?: string;                    // Początkowa wartość sortowania (opcjonalna)
  onChangeOrder: (order: string) => void;  // Callback wywoływany przy zmianie sortowania
  onRefresh: () => void;                    // Callback wywoływany przy kliknięciu "Odśwież"
};

/**
 * Komponent paska narzędzi do zarządzania listą plików
 * Umożliwia sortowanie plików i odświeżanie listy
 * 
 * @param initialOrder - Początkowy sposób sortowania (domyślnie "modifiedTime desc")
 * @param onChangeOrder - Funkcja wywoływana gdy użytkownik zmieni sortowanie
 * @param onRefresh - Funkcja wywoływana gdy użytkownik kliknie przycisk odświeżania
 */
export const FileToolbar = ({ 
  initialOrder = "modifiedTime desc",  // Wartość domyślna - najnowsze pliki pierwsze
  onChangeOrder, 
  onRefresh 
}: Props) => {
  
  // Stan lokalny przechowujący aktualnie wybrany sposób sortowania
  // Inicjalizowany wartością initialOrder
  const [order, setOrder] = useState(initialOrder);

  return (
    // Kontener z flexboxem - elementy w rzędzie z odstępami
    <div className="flex items-center gap-3 mb-3">
      
      {/* Dropdown do wyboru sposobu sortowania */}
      <select
        value={order}  // Kontrolowana wartość - stan React kontroluje select
        
        // Handler zmiany wartości - aktualizuje lokalny stan i powiadamia rodzica
        onChange={(e) => { 
          setOrder(e.target.value);           // Aktualizuj lokalny stan
          onChangeOrder(e.target.value);      // Powiadom komponent rodzica
        }}
        
        // Stylizacja Tailwind CSS: obramowanie, zaokrąglone rogi, padding, mały tekst
        className="border rounded-lg px-3 py-2 text-sm"
      >
        {/* Opcje sortowania - wartości odpowiadają parametrom Google Drive API */}
        <option value="modifiedTime desc">Najnowsze</option>           {/* Ostatnio zmodyfikowane */}
        <option value="name">Nazwa (A→Z)</option>                      {/* Alfabetycznie rosnąco */}
        <option value="name desc">Nazwa (Z→A)</option>                 {/* Alfabetycznie malejąco */}
        <option value="quotaBytesUsed desc">Największe</option>        {/* Według rozmiaru */}
      </select>
      
      {/* Przycisk odświeżania */}
      <button 
        onClick={onRefresh}  // Wywołanie callback funkcji przy kliknięciu
        
        // Stylizacja: tekst mały, obramowanie, hover effect (szare tło)
        className="text-sm border rounded-lg px-3 py-2 hover:bg-gray-100"
      >
        Odśwież
      </button>
    </div>
  );
};
