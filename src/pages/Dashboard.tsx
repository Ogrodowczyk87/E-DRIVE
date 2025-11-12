import { FileUpload } from "../components/drive/FileUpload";
import { NewFolderButton } from "../components/drive/NewFolderButton";
import { FileList } from "../components/drive/FileList";

export const Dashboard = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Moje pliki</h2>
        <NewFolderButton />
      </div>

      <FileUpload />
      <FileList />
    </div>
  );
};
