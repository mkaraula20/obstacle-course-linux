/**
 * Native routing — a small stack router that mirrors the slice of the
 * react-router-dom API the shared pages use (`useNavigate` + `useParams`), so
 * the pages stay single-source. Paths are the same strings as on web
 * ("/", "/forms", "/catalog/gizmo"), and the Android hardware back button pops
 * the stack. Metro resolves this file for ios/android; web uses routing.ts.
 */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { BackHandler } from "react-native";

interface RouterValue {
  path: string;
  navigate: (to: string) => void;
  goBack: () => boolean;
  canGoBack: boolean;
}

const RouterContext = createContext<RouterValue>({
  path: "/",
  navigate: () => {},
  goBack: () => false,
  canGoBack: false,
});

export function NativeRouter({ children }: { children: React.ReactNode }) {
  const [stack, setStack] = useState<string[]>(["/"]);
  const stackRef = useRef(stack);
  stackRef.current = stack;

  const navigate = useCallback((to: string) => {
    setStack((s) => (to === s[s.length - 1] ? s : [...s, to]));
  }, []);

  const goBack = useCallback(() => {
    if (stackRef.current.length > 1) {
      setStack((s) => s.slice(0, -1));
      return true;
    }
    return false;
  }, []);

  // Android hardware back pops the stack; returning false at the root lets the
  // OS background the app.
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => goBack());
    return () => sub.remove();
  }, [goBack]);

  const path = stack[stack.length - 1];
  return (
    <RouterContext.Provider value={{ path, navigate, goBack, canGoBack: stack.length > 1 }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter(): RouterValue {
  return useContext(RouterContext);
}

export function useNavigate(): (to: string) => void {
  return useContext(RouterContext).navigate;
}

export function useParams(): { itemId?: string } {
  const { path } = useContext(RouterContext);
  const m = path.match(/^\/catalog\/([^/]+)$/);
  return m ? { itemId: decodeURIComponent(m[1]) } : {};
}
