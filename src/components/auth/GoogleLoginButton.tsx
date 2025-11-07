// Import custom hooka do obsługi logowania Google
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
// Import kolorowej ikony Google z react-icons
import {FcGoogle} from "react-icons/fc";

/**
 * Komponent przycisku do logowania przez Google
 * Używa custom hooka useGoogleAuth do obsługi logiki autoryzacji
 */
export const GoogleLoginButton = () => {
    // Pobieramy funkcję logowania i stan ładowania z custom hooka
    const {login, loading} = useGoogleAuth();

    return (
        <button 
            // Handler kliknięcia - uruchamia proces logowania Google
            onClick={() => login()}
            
            // Klasy Tailwind CSS dla stylizacji:
            // flex items-center - układ flexbox z wycentrowanymi elementami
            // gap-2 - odstęp między ikoną a tekstem
            // px-4 py-2 - padding wewnętrzny
            // border rounded-lg - obramowanie i zaokrąglone rogi
            // hover:bg-gray-100 - efekt hover (szare tło)
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100"
            
            // Blokuje przycisk podczas ładowania (zapobiega wielokrotnym kliknięciom)
            disabled={loading}
        >
            {/* Kolorowa ikona Google w większym rozmiarze */}
            <FcGoogle className="text-xl" />
            
            {/* Warunkowo renderowany tekst - zmienia się podczas ładowania */}
            {loading ? "Loading..." : "Login with Google"}
        </button>
    )
}