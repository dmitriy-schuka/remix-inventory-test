import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import {AppProvider, Banner, Page, Text} from "@shopify/polaris";
import enTranslations from '@shopify/polaris/locales/en.json';

import type {Route} from "./+types/root";
import "@shopify/polaris/build/esm/styles.css";
import "./app.css";

export const links = () => [
  {rel: "preconnect", href: "https://fonts.googleapis.com"},
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({children}: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <head>
      <meta charSet="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <Meta/>
      <Links/>
    </head>
    <body>
    {children}
    <ScrollRestoration/>
    <Scripts/>
    </body>
    </html>
  );
}

export default function App() {
  return (
    <AppProvider i18n={enTranslations}>
      <Outlet/>
    </AppProvider>
  );
}

export function ErrorBoundary({error}: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
  }

  return (
    <AppProvider i18n={enTranslations}>
      <Page title="An Error Occurred">
        <Banner
          title="Something went wrong"
          status="critical"
        >
          <Text variant="headingLg" as="h5">
            {message}
          </Text>
          <Text variant="bodyMd" as="p">
            {details}
          </Text>
        </Banner>
      </Page>
    </AppProvider>
  );
}
