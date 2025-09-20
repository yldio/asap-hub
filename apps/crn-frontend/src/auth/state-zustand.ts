// Zustand-based implementation for auth (POC)
// This file provides the same interface as state.ts but uses Zustand + React Query

// Re-export the new Zustand-based hooks
export { useAuthStore } from './stores/auth.store';
export { useAuthorization } from './hooks/use-authorization';
