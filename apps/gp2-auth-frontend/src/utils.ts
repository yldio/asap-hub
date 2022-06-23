export const getHubUrlFromRedirect = (): string => {
  const redirectUri = new URLSearchParams(window.location.search).get(
    'redirect_uri',
  );
  if (!redirectUri) {
    throw new Error('Redirect uri must be provided');
  }
  return new URL(redirectUri).origin;
};
