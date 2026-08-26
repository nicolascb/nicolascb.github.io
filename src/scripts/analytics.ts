export {};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __GA_ID?: string;
  }
}

function isLocalHost(): boolean {
  const { hostname } = window.location;
  return (
    hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1"
  );
}

function sendPageView(): void {
  const measurementId = window.__GA_ID;
  if (!measurementId || !window.gtag || isLocalHost()) return;

  window.gtag("event", "page_view", {
    send_to: measurementId,
    page_title: document.title,
    page_location: window.location.href,
    page_path: `${window.location.pathname}${window.location.search}`,
  });
}

document.addEventListener("astro:page-load", sendPageView);
