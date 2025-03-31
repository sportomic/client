export const trackEvent = (eventName, parameters = {}) => {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, parameters);
  }
};
