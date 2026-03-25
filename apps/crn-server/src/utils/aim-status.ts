import type { Aim } from '@asap-hub/model';

/**
 * Derives the status of an aim from its linked milestones.
 * Rules:
 * - No milestones → 'Pending'
 * - All 'Pending' → 'Pending'
 * - All 'Complete' → 'Complete'
 * - All 'Terminated' → 'Terminated'
 * - All 'Complete' or 'Terminated' → 'Complete'
 * - Any other mix → 'In Progress'
 */
export const deriveAimStatus = (
  milestones: Array<{ status?: string | null } | null> | undefined,
): Aim['status'] => {
  const statuses = (milestones ?? [])
    .map((m) => m?.status)
    .filter(Boolean) as string[];
  if (statuses.length === 0) return 'Pending';
  if (statuses.every((s) => s === 'Pending')) return 'Pending';
  if (statuses.every((s) => s === 'Complete')) return 'Complete';
  if (statuses.every((s) => s === 'Terminated')) return 'Terminated';
  if (statuses.every((s) => s === 'Complete' || s === 'Terminated'))
    return 'Complete';
  return 'In Progress';
};
