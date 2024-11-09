import { useState, useEffect } from "react";

const useHash = (): [string, (newHash: string) => void] => {
  const [hash, setHash] = useState(() =>
    typeof window !== "undefined" ? window.location.hash : ""
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleHashChange = () => {
      setHash(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const updateHash = (newHash: string) => {
    if (typeof window !== "undefined") {
      window.location.hash = newHash.startsWith("#") ? newHash : `#${newHash}`;
    }
  };

  return [hash, updateHash];
};

export default useHash;
