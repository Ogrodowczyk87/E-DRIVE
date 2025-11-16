import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";

// Interfejs definiujący strukturę danych użytkownika Google
interface GoogleUser {
    name: string;
    picture: string;
    email: string;
}

type GoogleAuthContextValue = {
    user: GoogleUser | null;
    login: () => void;
    logout: () => void;
    loading: boolean;
    token: string | null;
}

const GoogleAuthContext = createContext<GoogleAuthContextValue | undefined>(undefined);

const useProvideGoogleAuth = (): GoogleAuthContextValue => {
    // Stan tokena - pobieramy z sessionStorage przy inicjalizacji (persystencja)
    const [token, setToken] = useState<string | null>(sessionStorage.getItem("google_access_token"));
   
    // Stan ładowania - informuje UI czy trwa pobieranie danych
    const [loading, setLoading] = useState<boolean>(false);
    
    // Stan użytkownika - przechowuje dane zalogowanego użytkownika
    const [user, setUser] = useState<GoogleUser | null>(null);

    // Konfiguracja logowania Google
    const login = useGoogleLogin({
        scope: 'openid profile email https://www.googleapis.com/auth/drive.readonly',  // ✅ + dostęp do Google Drive

        // Callback po udanym logowaniu
        onSuccess: (cred) => {
            const accessToken = cred.access_token;
            // Zapisujemy token w stanie i sessionStorage (persystencja)
            setToken(accessToken);
            sessionStorage.setItem("google_access_token", accessToken);
        },
        // Obsługa błędów logowania
        onError: (err) => {
            console.error("Google login error:", err);
        }
     });
     
    // Funkcja wylogowania
    const logout = () => {
        googleLogout(); // Wylogowanie z Google
        setToken(null); // Czyszczenie tokena ze stanu
        setUser(null); // Czyszczenie danych użytkownika
        sessionStorage.removeItem("google_access_token"); // Czyszczenie sessionStorage
    }

    // Efekt uruchamiany przy zmianie tokena - pobiera dane użytkownika
    useEffect(() => {
        const fetchUser = async () => {
            // Jeśli nie ma tokena, nie rób nic
            if (!token) return;
            
            // Włączamy wskaźnik ładowania
            setLoading(true);
            
            try {
                // Zapytanie do Google API o dane użytkownika
                const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: {
                        Authorization: `Bearer ${token}`, // Autoryzacja tokenem
                    },
                });
                
                // Parsowanie odpowiedzi JSON
                const data = await res.json();
                
                // Zapisanie danych użytkownika w stanie
                setUser(data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                // Wyłączamy wskaźnik ładowania (zawsze, niezależnie od sukcesu/błędu)
                setLoading(false);
            }
        }
        
        fetchUser();
    }, [token]); // Dependency array - efekt uruchamia się gdy token się zmieni

    return { user, login, logout, loading, token };
}

export const GoogleAuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
    const value = useProvideGoogleAuth();
    return React.createElement(
        GoogleAuthContext.Provider,
        { value },
        children
    );
}
export const useGoogleAuth = () => {
    const context = useContext(GoogleAuthContext);
    if (!context) {
        throw new Error("useGoogleAuth must be used within a GoogleAuthProvider");
    }
    return context;
}

