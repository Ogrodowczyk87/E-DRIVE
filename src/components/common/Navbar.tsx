import { useGoogleAuth } from "../../hooks/useGoogleAuth";

export const Navbar = () => {
    const { user, logout } = useGoogleAuth();
  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold text-sky-600">E-Drive</h1>
        {user ? (
            <div className="flex items-center gap-4">
                <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" />
                <span className="text-sm font-medium">{user.name}</span>
                <button onClick={logout} className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-100">
                    Sign-out
                </button>
            </div>
        ) : (
            <span className="text-sm text-gray-500">Not logged in</span>
        )}
    </nav>
  );
};
