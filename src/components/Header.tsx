import DirectorySvg from "@/assets/DirectorySvg";
import Button from "@/components/Button";
import FileUploadButton from "@/components/FileUploadButton";
import { useModal } from "@/hooks/modalContext";

const Header = () => {
  const { showModal } = useModal();

  const handleFileChange = (files: File[]): void => {
    const upload = () => console.log(files);

    showModal(
      <div>
        <h2 className="flex gap-2 items-center">
          <span className="i-flat-color-icons-upload w-6 h-6"></span>
          <span className="text-xl">Upload</span>
        </h2>

        <p className="my-8 text-sm">{files[0].name}</p>

        <Button size="large" className="w-full text-center" onClick={upload}>
          Upload
        </Button>
      </div>
    );
  };

  return (
    <header className="flex justify-between px-5 py-3 bg-amber-900 text-amber-50 shadow-md">
      <h1 className="text-lg tracking-wider">
        <DirectorySvg className="h-6 mr-2 inline-block align-text-bottom" />
        Web File Browser
      </h1>

      <FileUploadButton onFilesSelected={handleFileChange} />
    </header>
  );
};

export default Header;
