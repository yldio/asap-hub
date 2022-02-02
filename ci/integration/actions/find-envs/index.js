const fetch = require('node-fetch');
const core = require('@actions/core');
const { URLSearchParams } = require('url');

const { SQUIDEX_CLIENT_ID, SQUIDEX_CLIENT_SECRET } = process.env;

const squidexUrl = 'https://cloud.squidex.io';

async function main() {
  try {
    const apps = await getAvailableApps();
    core.setOutput('availableApps', apps);
  } catch (error) {
    core.setFailed(error.message);
  }
}
main();

async function getAvailableApps() {
  const headers = await getClientHeaders();
  const appsReqest = await fetch(`${squidexUrl}/api/apps`, {
    headers,
  });
  const apps = await appsReqest.json();
  return apps.map((app) => app.name);
}

async function getClientHeaders() {
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    scope: 'squidex-api',
    client_id: SQUIDEX_CLIENT_ID,
    client_secret: SQUIDEX_CLIENT_SECRET,
  });
  const response = await fetch(`${squidexUrl}/identity-server/connect/token`, {
    method: 'POST',
    body: params,
  });

  const { access_token } = await response.json();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${access_token}`,
  };
}
