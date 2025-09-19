import { TeamCollaborationPerformance } from '@asap-hub/model';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface TeamCollaborationPerformanceState {
  // Client state only (optimistic updates, local state)
  performance: TeamCollaborationPerformance | null;

  // Actions
  setPerformance: (performance: TeamCollaborationPerformance | null) => void;
  reset: () => void;
}

const initialState = {
  performance: null,
};

export const useTeamCollaborationPerformanceStore =
  create<TeamCollaborationPerformanceState>()(
    devtools(
      (set, get) => ({
        ...initialState,

        setPerformance: (performance: TeamCollaborationPerformance | null) =>
          set({ performance }, false, 'setPerformance'),

        reset: () => set(initialState, false, 'reset'),
      }),
      {
        name: 'team-collaboration-performance-store',
      },
    ),
  );

// Selectors for better performance
export const selectPerformance = (state: TeamCollaborationPerformanceState) =>
  state.performance;
