import { manuscriptStatus, Message } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { StatusType } from '..';

export const getReviewerStatusType = (
  statusItem: (typeof manuscriptStatus)[number],
): StatusType =>
  (
    ({
      [manuscriptStatus[0]]: 'warning',
      [manuscriptStatus[1]]: 'default',
      [manuscriptStatus[2]]: 'warning',
      [manuscriptStatus[3]]: 'default',
      [manuscriptStatus[4]]: 'default',
      [manuscriptStatus[5]]: 'final',
      [manuscriptStatus[6]]: 'final',
    }) as Record<string, StatusType>
  )[statusItem] || 'none';

export const getUserHref = (id: string) =>
  network({}).users({}).user({ userId: id }).$;

export const getTeams = (teams: Message['createdBy']['teams']) =>
  teams.map((team) => ({
    href: network({}).teams({}).team({ teamId: team.id }).$,
    name: team.name,
  }));
