import { MouseEventHandler } from "react";
import useNavigation from "./use-navigation";

export default function useRouteHandler(route: string): MouseEventHandler<HTMLElement> {
  const { navigate } = useNavigation()!;
  return (event: React.MouseEvent<HTMLElement>) => {
    if (event.metaKey || event.ctrlKey) {
      return;
    }

    event.preventDefault();
    navigate(route);
  }
}