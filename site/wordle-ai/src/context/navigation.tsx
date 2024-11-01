import { createContext, useState, useEffect, PropsWithChildren } from "react";
import INavigationContext from "./NavigationContext";

const NavigationContext = createContext<INavigationContext | undefined>(undefined);

export function NavigationProvider(props: PropsWithChildren) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  useEffect(() => {
    const backForwardHandler = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', backForwardHandler);
    return () => {
      window.removeEventListener('popstate', backForwardHandler);
    }
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, '', to);
    setCurrentPath(to);
  }

  return (
    <NavigationContext.Provider value={{ currentPath, navigate }}>
      {props.children}
    </NavigationContext.Provider>
  );
}

export default NavigationContext;