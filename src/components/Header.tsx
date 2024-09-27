import DirectorySvg from "@/assets/DirectorySvg";

const Header = () => {
  return (
    <header className="px-5 py-3 bg-amber-9 00 text-amber-50 shadow-md">
      <h1 className="text-lg tracking-wider">
        <DirectorySvg className="h-6 mr-2 inline-block align-text-bottom" />
        Web File Browser
      </h1>
    </header>
  );
};

export default Header;
