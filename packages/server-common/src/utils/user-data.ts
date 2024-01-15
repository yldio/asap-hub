const getFirstLettersInCapitalsAndDots = (str: string) => {
  const firstLetters = str
    .split(' ')
    .map((word) => `${word.charAt(0).toUpperCase()}. `)
    .join('');

  return firstLetters;
};

export const parseUserDisplayName = (
  firstName: string,
  lastName: string,
  middleName?: string,
  nickname?: string,
) =>
  `${firstName} ${nickname ? `(${nickname}) ` : ''}${
    middleName ? `${getFirstLettersInCapitalsAndDots(middleName)}` : ''
  }${lastName}`;
