import { sharingStatuses, TutorialsSharingStatus } from '@asap-hub/model';

export const isTutorialSharingStatus = (
  status: string,
): status is TutorialsSharingStatus =>
  (sharingStatuses as ReadonlyArray<string>).includes(status);
