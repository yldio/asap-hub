import { ResearchOutputSharingStatus, sharingStatuses } from '@asap-hub/model';

export const isSharingStatus = (
  status: string,
): status is ResearchOutputSharingStatus =>
  (sharingStatuses as ReadonlyArray<string>).includes(status);
