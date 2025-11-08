import { Navbar } from './components/common/Navbar'
import { GoogleLoginButton } from './components/auth/GoogleLoginButton'
import { FileToolbar } from './components/drive/FileToolbar'
import { useGoogleAuth } from './hooks/useGoogleAuth'
import { useFiles } from './hooks/useDriveAPI'
import { useState } from 'react'

export default function App() {
  const { user, token } = useGoogleAuth();
  const [orderBy, setOrderBy] = useState("modifiedTime desc");
  
  const { data, isLoading, error, refetch } = useFiles({
    token,
    orderBy,
    pageSize: 20
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-6">
      {user ? ( 
        <div>
          <h2 className="text-2xl font-bold mb-6">Welcome {user?.name}</h2>
          
          <FileToolbar 
            initialOrder={orderBy}
            onChangeOrder={(newOrder) => setOrderBy(newOrder)}
            onRefresh={() => refetch()}
          />
          
          {isLoading ? (
            <div className="text-center py-8">Loading your files...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              Error loading files: {error.message}
            </div>
          ) : (
            <div className="grid gap-2">
              {data?.files?.map((file) => (
                <div key={file.id} className="border rounded-lg p-3 hover:bg-gray-50">
                  <div className="font-medium">{file.name}</div>
                  <div className="text-sm text-gray-500">
                    {file.modifiedTime && new Date(file.modifiedTime).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-20">
          <p className='text-lg text-gray-500'>Please log in to access your files.</p>
          <GoogleLoginButton />
        </div>
      )}
      </main>  
    </div>
  )
}
