    interface FileCardProps {
  name?: string;
  mimeType?: string;
  size?: string;
  modifiedTime?: string;
}

export const FileCard = ({ name, mimeType, size, modifiedTime }: FileCardProps) => {
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
      </div>
    </div>
  );
};