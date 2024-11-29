import FileList from "@/components/FileList";
import Header from "@/components/Header";
import PagePath from "@/components/PagePath";
import ModalProvider from "@/contexts/ModalProvider";
import useHash from "@/hooks/useHash";

const App = () => {
  const [hash] = useHash();
  const paths = hash.slice(1).split("/").filter(Boolean);

  return (
    <ModalProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <PagePath paths={paths} />

        <main className="flex-grow container mx-auto p-6">
          <FileList />
        </main>
      </div>
    </ModalProvider>
  );
};

export default App;
