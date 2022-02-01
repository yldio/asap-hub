const fetch = require('node-fetch');
const core = require('@actions/core');
const { URLSearchParams } = require('url');

const { SQUIDEX_CLIENT_ID, SQUIDEX_CLIENT_SECRET } = process.env;

const squidexUrl = 'https://cloud.squidex.io';

async function main() {
  const availableApps = await getAvailableApps();
  console.log({ availableApps });
  core.setOutput('availableApps', availableApps);
}
main();

async function getAvailableApps() {
  const headers = await getClientHeaders();
  const appsReqest = await fetch(squidexUrl + '/api/apps', {
    headers,
  });
  const apps = await appsReqest.json();
  return apps.map((app) => app.name);
}

async function getClientHeaders() {
  const tokenUrl = `${squidexUrl}/identity-server/connect/token`;
  const body = {
    grant_type: 'client_credentials',
    scope: 'squidex-api',
    client_id: SQUIDEX_CLIENT_ID,
    client_secret: SQUIDEX_CLIENT_SECRET,
  };
  const params = new URLSearchParams(body);
  const response = await fetch(tokenUrl, {
    method: 'POST',
    body: params,
  });

  const { access_token } = await response.json();
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${access_token}`,
  };
  return headers;
}
