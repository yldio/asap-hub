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
