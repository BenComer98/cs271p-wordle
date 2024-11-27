import useNavigation from "../hooks/use-navigation";
import RouteProps from "../interfaces/RouteProps";

export default function Route({ path, children }: RouteProps) {
  const { currentPath } = useNavigation()!;
  if (path === currentPath) {
    return children;
  }

  return null;
}