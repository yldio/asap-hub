module.exports.description =
  'Add team-resource-validation sidebar app to Teams content model';

const shouldSkipBecauseNoAppId = () => {
  const envId = process.env.CONTENTFUL_ENV_ID;
  // CI creates temporary environments like "integration-<id>".
  // Those environments are used for automated checks and don't need sidebar apps.
  return Boolean(envId && envId.startsWith('integration-'));
};

const getAppId = () => {
  const appId = process.env.CONTENTFUL_APP_TEAM_RESOURCE_VALIDATION;
  if (!appId) {
    if (shouldSkipBecauseNoAppId()) {
      return null;
    }
    throw new Error(
      'Missing CONTENTFUL_APP_TEAM_RESOURCE_VALIDATION (Contentful App Definition ID)',
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
