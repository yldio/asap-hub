module.exports.description =
  'Add team-resource-validation sidebar app to Teams content model';

const shouldSkipBecauseNoAppId = () => {
  const envId = process.env.CONTENTFUL_ENV_ID;
  // CI creates temporary environments like "integration-<id>".
  // Those environments are used for automated checks and don't need sidebar apps.
  return Boolean(envId && envId.startsWith('integration-'));
};

const getAppId = () => {
  const raw = process.env.CONTENTFUL_APP_TEAM_RESOURCE_VALIDATION;
  if (!raw) {
    if (shouldSkipBecauseNoAppId()) {
      return null;
    }
    throw new Error(
      'Missing CONTENTFUL_APP_TEAM_RESOURCE_VALIDATION (Contentful App Definition ID)',
    );
  }

  // Users sometimes accidentally include a trailing "\" when copy-pasting multiline env commands.
  // Contentful expects widgetId to match /^[a-zA-Z0-9-_.]{1,64}$/.
  let appId = raw.trim();
  while (appId.endsWith('\\')) {
    appId = appId.slice(0, -1).trim();
  }
  if (!/^[a-zA-Z0-9-_.]{1,64}$/.test(appId)) {
    throw new Error(
      `Invalid CONTENTFUL_APP_TEAM_RESOURCE_VALIDATION value: "${raw}". Expected an ID matching /^[a-zA-Z0-9-_.]{1,64}$/.`,
    );
  }

  return appId;
};

module.exports.up = (migration) => {
  const appId = getAppId();
  if (!appId) return;
  const teams = migration.editContentType('teams');
  teams.addSidebarWidget('app', appId, {});
};

module.exports.down = (migration) => {
  const appId = getAppId();
  if (!appId) return;
  const teams = migration.editContentType('teams');
  teams.removeSidebarWidget('app', appId);
};
