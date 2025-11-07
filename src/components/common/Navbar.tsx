export const Navbar = () => {
  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold text-sky-600">E-Drive</h1>
      <button className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-100">
        Sign-in
      </button>
    </nav>
  );
};
