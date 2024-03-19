export const formatUserLocation = (
  city?: string,
  stateOrProvince?: string,
  country?: string,
): string => {
  let formattedLocation = '';

  if (city) {
    formattedLocation += city;
  }

  if (stateOrProvince) {
    formattedLocation += city ? `, ${stateOrProvince}` : stateOrProvince;
  }

  if (country) {
    formattedLocation += city || stateOrProvince ? `, ${country}` : country;
  }

  return formattedLocation;
};

const baseUrls = {
  twitter: 'https://twitter.com/',
  linkedIn: 'https://www.linkedin.com/in/',
  github: 'https://github.com/',
  googleScholar: 'https://scholar.google.co.uk/citations?user=',
  researchGate: 'https://www.researchgate.net/profile/',
};

export type UserSocialType = keyof typeof baseUrls;

export const formatUserSocial = (social: string, type: UserSocialType) =>
  social.startsWith(baseUrls[type]) ? social.split(baseUrls[type])[1] : social;
