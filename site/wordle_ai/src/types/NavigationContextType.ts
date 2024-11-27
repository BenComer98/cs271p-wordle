export type NavigationContextType = {
  currentPath: string;
  navigate: (to: string) => void;
}