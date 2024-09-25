import Header from "./components/Header";
import Index from "./pages/Index";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-amber-50 text-amber-900">
      <Header />

      <main className="flex-grow container mx-auto p-4">
        <Index />
      </main>
    </div>
  );
}

export default App;
