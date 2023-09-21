import { gp2 as gp2Model } from '@asap-hub/model';

export const isSharingStatus = (
  status: string,
): status is gp2Model.OutputSharingStatus =>
  (gp2Model.sharingStatuses as ReadonlyArray<string>).includes(status);
