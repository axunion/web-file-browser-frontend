import DirectorySvg from "@/assets/DirectorySvg";
import FileUploadButton from "@/components/FileUploadButton";

const Header = () => {
  const handleFileChange = (files: File[]): void => {
    console.log(files);
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
