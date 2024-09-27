import Header from "@/components/Header";
import PagePath from "@/components/PagePath";
import Index from "@/pages/Index";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-amber-50 text-amber-900">
      <Header />
      <PagePath paths={["1", "2"]} />

      <main className="flex-grow container mx-auto p-4">
        <Index />
      </main>
    </div>
  );
};

export default App;
