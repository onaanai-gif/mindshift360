// In-page router for the single-file preview. Stands in for next/link and
// next/navigation so the real components run unchanged.
import { createContext, useCallback, useContext, useState, type AnchorHTMLAttributes, type ReactNode } from "react";

type Navigate = (href: string) => void;
const RouterContext = createContext<{ path: string; navigate: Navigate }>({ path: "/", navigate: () => {} });

export function PreviewRouter({ children }: { children: (path: string) => ReactNode }) {
  const [path, setPath] = useState("/");
  const navigate = useCallback<Navigate>((href) => {
    const [p, anchor] = href.split("#");
    setPath(p || "/");
    window.setTimeout(() => {
      const target = anchor ? document.getElementById(anchor) : null;
      if (target) {
        target.scrollIntoView();
        target.focus();
      } else {
        window.scrollTo(0, 0);
      }
    }, 0);
  }, []);
  return <RouterContext.Provider value={{ path, navigate }}>{children(path)}</RouterContext.Provider>;
}

export default function Link({
  href,
  onClick,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const { navigate } = useContext(RouterContext);
  return (
    <a
      {...rest}
      href={href}
      onClick={(e) => {
        onClick?.(e);
        e.preventDefault();
        navigate(href);
      }}
    >
      {children}
    </a>
  );
}

export function usePathname() {
  return useContext(RouterContext).path;
}

export function useRouter() {
  const { navigate } = useContext(RouterContext);
  return { push: navigate, replace: navigate, back: () => navigate("/") };
}
