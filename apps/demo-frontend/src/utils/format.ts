import type { Role } from '../api/types';

export const formatUploadedOn = (isoDate: string): string => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
};

export const roleLabel = (role: Role): string =>
  ({ admin: 'Admin', creator: 'Creator', member: 'Member' })[role];

export const videoCount = (count: number): string =>
  `${count} ${count === 1 ? 'video' : 'videos'}`;

export const folderCount = (count: number): string =>
  `${count} ${count === 1 ? 'folder' : 'folders'}`;
