import {
  GP2ResearchOutputSharingStatus,
  gp2SharingStatuses,
} from '@asap-hub/model';

export const isSharingStatus = (
  status: string,
): status is GP2ResearchOutputSharingStatus =>
  (gp2SharingStatuses as ReadonlyArray<string>).includes(status);
