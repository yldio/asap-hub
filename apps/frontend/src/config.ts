export const STORAGE_PREFIX = 'asapHub.';
export const STORAGE_KEY_INVITATION_CODE = `${STORAGE_PREFIX}invitationCode`;

let baseUrl: string;
switch (window.location.host.split('.').length) {
  /* istanbul ignore next */
  case 3: {
    baseUrl = `${window.location.protocol}//api.${window.location.host}`;
    break;
  }
  /* istanbul ignore next */
  case 4: {
    baseUrl = `${window.location.protocol}//api-${window.location.host}`;
    break;
  }
  default: {
    baseUrl = 'http://localhost:3333/development';
  }
}
export const API_BASE_URL = baseUrl.toString();
