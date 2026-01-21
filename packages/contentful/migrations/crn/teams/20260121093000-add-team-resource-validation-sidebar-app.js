module.exports.description =
  'Add team-resource-validation sidebar app to Teams content model';

const getAppId = () => {
  const appId = process.env.CONTENTFUL_APP_TEAM_RESOURCE_VALIDATION;
  if (!appId) {
    throw new Error(
      'Missing CONTENTFUL_APP_TEAM_RESOURCE_VALIDATION (Contentful App Definition ID)',
    );
  }
  return appId;
};

module.exports.up = (migration) => {
  const teams = migration.editContentType('teams');
  teams.addSidebarWidget('app', getAppId(), {});
};

module.exports.down = (migration) => {
  const teams = migration.editContentType('teams');
  teams.removeSidebarWidget('app', getAppId());
};
