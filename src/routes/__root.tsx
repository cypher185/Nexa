import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-vault-bg px-4">
      <div className="max-w-md text-center">
        <h1 className="font-sora text-7xl font-semibold gold-text">404</h1>
        <h2 className="mt-4 font-sora text-xl font-semibold text-white">Page not found</h2>
        <p className="mt-2 text-sm text-zinc-500">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-vault-gold px-5 py-2.5 text-sm font-semibold text-vault-bg transition-colors hover:bg-vault-gold-light"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-vault-bg px-4">
      <div className="max-w-md text-center">
        <h1 className="font-sora text-xl font-semibold tracking-tight text-white">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Something went wrong on our end. Try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-lg bg-vault-gold px-5 py-2.5 text-sm font-semibold text-vault-bg transition-colors hover:bg-vault-gold-light"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "NexaLogs — Premium aged social accounts, delivered instantly" },
      {
        name: "description",
        content:
          "Nigeria's premium marketplace for aged social media accounts. Facebook, Instagram, TikTok, X, Gmail and more — delivered instantly to your wallet.",
      },
      { property: "og:title", content: "NexaLogs — Premium aged social accounts, delivered instantly" },
      {
        property: "og:description",
        content: "Nigeria's premium marketplace for aged social media accounts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "theme-color", content: "#0d0d0d" },
      { name: "twitter:title", content: "NexaLogs — Premium aged social accounts, delivered instantly" },
      { name: "description", content: "NexaLogs Social Hub is a web-based platform for managing and selling social media accounts." },
      { property: "og:description", content: "NexaLogs Social Hub is a web-based platform for managing and selling social media accounts." },
      { name: "twitter:description", content: "NexaLogs Social Hub is a web-based platform for managing and selling social media accounts." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a2cf8103-1534-471f-82c5-dbd6c8be67ea/id-preview-bcdb72ac--50a5aaac-0d32-4bfc-94a2-80ae87096309.lovable.app-1782032789334.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a2cf8103-1534-471f-82c5-dbd6c8be67ea/id-preview-bcdb72ac--50a5aaac-0d32-4bfc-94a2-80ae87096309.lovable.app-1782032789334.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Sora:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="bg-vault-bg text-foreground">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
        <Toaster theme="dark" position="top-right" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}
