import FileList from "@/components/FileList";
import Header from "@/components/Header";
import PagePath from "@/components/PagePath";
import ModalProvider from "@/contexts/ModalProvider";

const App = () => {
  return (
    <ModalProvider>
      <div className="flex flex-col min-h-screen bg-amber-50 text-amber-900">
        <Header />
        <PagePath paths={["1", "2"]} />

        <main className="flex-grow container mx-auto p-4">
          <FileList />
        </main>
      </div>
    </ModalProvider>
  );
};

export default App;
