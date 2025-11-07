/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string
  // dodaj tutaj inne zmienne środowiskowe z prefiksem VITE_
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}