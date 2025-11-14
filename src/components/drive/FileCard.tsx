interface FileCardProps {
  name?: string;
  mimeType?: string;
  size?: string;
  modifiedTime?: string;
  onClick?: () => void;
}

export const FileCard = ({ name, mimeType, size, modifiedTime, onClick }: FileCardProps) => {
  return (
    <div className="border rounded-lg p-3 bg-white hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="font-medium text-sm">{name}</div>
          <div className="text-xs text-gray-500 flex gap-2">
            {mimeType && <span>{mimeType}</span>}
            {size && <span>{size} bytes</span>}
            {modifiedTime && <span>{new Date(modifiedTime).toLocaleDateString()}</span>}
          </div>
        </div>
        <button onClick={onClick} className="text-gray-500 hover:text-gray-700" disabled={!onClick}>
          <span className="sr-only">Open details</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
      </div>
    </div>
  );
};
