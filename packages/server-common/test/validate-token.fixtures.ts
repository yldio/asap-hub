export const idToken = {
  [`${origin}/user`]: {
    id: 'userId',
    displayName: 'JT',
    email: 'joao.tiago@asap.science',
    firstName: 'Joao',
    lastName: 'Tiago',
    teams: [],
  },
  given_name: 'Joao',
  family_name: 'Tiago',
  nickname: 'joao.tiago',
  name: 'Joao Tiago',
  picture: 'https://lh3.googleusercontent.com/awesomePic',
  locale: 'en',
  updated_at: '2020-10-27T17:55:23.418Z',
  email: 'joao.tiago@asap.science',
  email_verified: true,
  iss: 'https://asap-hub.us.auth0.com/',
  sub: 'google-oauth2|awesomeGoogleCode',
  aud: 'audience',
  iat: 1603821328,
  exp: 1603857328,
  auth_time: 1603821323,
  nonce: 'onlyOnce',
};

export const getToken = (
  header = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlZoR0E4OHUxTmpDdEloNENzTVc3QyJ9',
  body = 'eyJodHRwczovLzQwNy5odWIuYXNhcC5zY2llbmNlL3VzZXIiOnsiaWQiOiJjZjNhZmNlZS05MzdkLTRkYmQtODFkNy0xZGVkNzNjZmExOTYiLCJkaXNwbGF5TmFtZSI6Ikpvw6NvIFRpYWdvIiwiZW1haWwiOiJqb2FvLnRpYWdvQHlsZC5pbyIsImZpcnN0TmFtZSI6Ikpvw6NvIiwibGFzdE5hbWUiOiJUaWFnbyIsInRlYW1zIjpbXX0sImdpdmVuX25hbWUiOiJKb2FvIiwiZmFtaWx5X25hbWUiOiJUaWFnbyIsIm5pY2tuYW1lIjoiam9hby50aWFnbyIsIm5hbWUiOiJKb2FvIFRpYWdvIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdoY1V5bUFZQURUT0ZUdFM3ekhkc1diZmkyQWJDSWJwQnR4QWROV3VnPXM5Ni1jIiwibG9jYWxlIjoiZW4iLCJ1cGRhdGVkX2F0IjoiMjAyMC0xMC0yOVQxMToyNDoxNi4yMjdaIiwiZW1haWwiOiJqb2FvLnRpYWdvQHlsZC5pbyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL2Rldi1hc2FwLWh1Yi51cy5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDk4NDA0MTMxNzUyODY0MDg1OTIiLCJhdWQiOiJ4UkR2Z1plM1FsM0xTWkRzMmRXUVl6Y29oRm5MeWVMMiIsImlhdCI6MTYwMzk3MDY2MCwiZXhwIjoxNjA0MDA2NjYwLCJhdXRoX3RpbWUiOjE2MDM5NzA2NTYsIm5vbmNlIjoiYkc5RlpIaDBkVkZKZEZSc1oxaHZlVmRSVTJ0dkxXTXRVemh6Y0VsbloyczBWazFrYmxsc2RGRm5RZz09In0',
  signature = 'XbiusLLgOeR63OGwnmbUS3ht1p4NAKwZoiVqmkj7si8KKhyJHrLom1IcIphaztmJYvzmE36EpV08heI0ktXUtg75tXI2CI2znUcpWHZasf56Vr8oKKWetmEmsDqmKCGEEyMeb29gM6hTjnmrSiY7hMYaUyN1qMongQpn-rFMz9ObIW4lsAiSjL-lkEOYpNK4_X7z3vBYJLkDVxEu2LaaDpQxlaEmcuWH_YvCp_ciBFzTfaHec6quy2D2j_uYQ4XK8Er3wWlYH4gnU3SQEPfYA2-spUnWLalrMyXjaNjdlF3Hgd9lbLu0J_ZVlCRR6wWGfwymyan8KtWLTykBJlXFXA',
) => {
  return [header, body, signature].join('.');
};
