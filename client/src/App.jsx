import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import ProductDetails from "./pages/ProductDetails";
import "./App.css";

function App() {
  const [pathname, setPathname] = useState(window.location.pathname);
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem("pricepulse-theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("pricepulse-theme", theme);
  }, [theme]);

  const navigateTo = (nextPath) => {
    window.history.pushState({}, "", nextPath);
    setPathname(nextPath);
  };

  const match = pathname.match(/^\/product\/([^/]+)$/);

  const page = match ? (
    <ProductDetails
      productId={match[1]}
      onBackHome={() => navigateTo("/")}
    />
  ) : (
    <Dashboard onSelectProduct={(product) => navigateTo(`/product/${product._id}`)} />
  );

  return (
    <>
      <button
        type="button"
        className="theme-toggle"
        onClick={() => setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"))}
      >
        {theme === "dark" ? "Light mode" : "Dark mode"}
      </button>
      {page}
    </>
  );
}

export default App;
