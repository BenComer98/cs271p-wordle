import { createContext, useState, useEffect, ReactNode } from "react";

type NavigationContextType = {
  currentPath: string;
  navigate: (to: string) => void;
};

const NavigationContext = createContext<NavigationContextType | null>(null);

type NavigationProviderProps = {
  children: ReactNode;
};

export function NavigationProvider(props: NavigationProviderProps) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const backForwardHandler = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", backForwardHandler);
    return () => {
      window.removeEventListener("popstate", backForwardHandler);
    };
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, "", to);
    setCurrentPath(to);
  };

  return (
    <NavigationContext.Provider value={{ currentPath, navigate }}>
      {props.children}
    </NavigationContext.Provider>
  );
}

export default NavigationContext;