export const formatUploadedOn = (isoDate: string): string => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
};

export const videoCount = (count: number): string =>
  `${count} ${count === 1 ? 'video' : 'videos'}`;

export const folderCount = (count: number): string =>
  `${count} ${count === 1 ? 'folder' : 'folders'}`;
