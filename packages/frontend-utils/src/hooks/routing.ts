import { useLocation } from 'react-router-dom';

export const useBackHref = (): string | null => {
  const location = useLocation();
  // In React Router v6, we use location state to track the previous location
  // If there's a state.from, use it; otherwise, use the referrer
  const state = location.state as { from?: { pathname: string; search: string; hash: string } } | null;
  
  if (state?.from) {
    return state.from.pathname + state.from.search + state.from.hash;
  }
  
  // Fallback to document.referrer if available and it's from the same origin
  if (document.referrer && document.referrer.startsWith(window.location.origin)) {
    const url = new URL(document.referrer);
    return url.pathname + url.search + url.hash;
  }
  
  return null;
};
