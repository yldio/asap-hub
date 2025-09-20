import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Auth0 } from '@asap-hub/auth';

interface AuthState {
  auth0: Auth0 | undefined;
  authorization: string | null;
  setAuth0: (auth0: Auth0 | undefined) => void;
  getAuthorization: () => Promise<string>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        auth0: undefined,
        authorization: null,

        setAuth0: async (auth0) => {
          set({ auth0 }, false, 'setAuth0');

          // Auto-populate authorization when auth0 is available
          if (auth0) {
            try {
              const accessToken = await auth0.getTokenSilently();
              const authorization = `Bearer ${accessToken}`;
              set({ authorization }, false, 'setAuthorization');
            } catch (error) {
              console.error('Failed to get initial token:', error);
            }
          }
        },

        getAuthorization: async () => {
          const { auth0 } = get();

          if (!auth0) {
            throw new Error('Auth0 not available');
          }

          try {
            // This is smart - only fetches if needed
            const accessToken = await auth0.getTokenSilently();
            const newAuthorization = `Bearer ${accessToken}`;
            set({ authorization: newAuthorization }, false, 'setAuthorization');
            return newAuthorization;
          } catch (error) {
            console.error('Failed to get authorization token:', error);
            throw error;
          }
        },
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({ authorization: state.authorization }),
      },
    ),
  ),
);
