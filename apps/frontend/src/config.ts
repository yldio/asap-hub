let baseUrl: string;
switch (window.location.host.split('.').length) {
  case 3: {
    baseUrl = `${window.location.protocol}//api.${window.location.host}`;
    break;
  }
  case 4: {
    baseUrl = `${window.location.protocol}//api-${window.location.host}`;
    break;
  }
  default: {
    baseUrl = 'http://localhost:3333/development';
  }
}
export const API_BASE_URL = baseUrl.toString();
