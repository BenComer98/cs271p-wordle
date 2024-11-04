import { useContext } from "react";
import NavigationContext from "../context/navigation";

export default function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("NavigationContext not used in index.ts")
  }
  return context;
}