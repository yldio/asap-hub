module.exports.description =
  'Change Resource fields field control to use team-resource-validation app';

const getAppId = () => {
  const raw = process.env.CONTENTFUL_APP_TEAM_RESOURCE_VALIDATION;
  if (!raw) {
    // Skip if app ID not provided (e.g., in CI integration environments)
    const envId = process.env.CONTENTFUL_ENV_ID;
    if (envId && envId.startsWith('integration-')) {
      return null;
    }
    throw new Error(
      'Missing CONTENTFUL_APP_TEAM_RESOURCE_VALIDATION (Contentful App Definition ID)',
    );
  }

  // Sanitize: remove trailing backslashes from multiline env commands
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

  // Change field controls for Resource fields to use our validation app
  // This will show warnings directly under each Resource field input
  teams.changeFieldControl('resourceTitle', 'app', appId, {});
  teams.changeFieldControl('resourceDescription', 'app', appId, {});
  teams.changeFieldControl('resourceButtonCopy', 'app', appId, {});
  teams.changeFieldControl('resourceContactEmail', 'app', appId, {});
};

module.exports.down = (migration) => {
  const appId = getAppId();
  if (!appId) return;

  const teams = migration.editContentType('teams');

  // Revert to builtin field controls
  teams.changeFieldControl('resourceTitle', 'builtin', 'singleLine', {
    helpText:
      '⚠️ If you fill any Resource field (Title, Description, Button Copy, or Contact Email), please fill all of them. Resource Link is optional.',
  });
  teams.changeFieldControl('resourceDescription', 'builtin', 'multipleLine', {
    helpText:
      '⚠️ If you fill any Resource field (Title, Description, Button Copy, or Contact Email), please fill all of them. Resource Link is optional.',
  });
  teams.changeFieldControl('resourceButtonCopy', 'builtin', 'singleLine', {
    helpText:
      '⚠️ If you fill any Resource field (Title, Description, Button Copy, or Contact Email), please fill all of them. Resource Link is optional.',
  });
  teams.changeFieldControl('resourceContactEmail', 'builtin', 'singleLine', {
    helpText:
      '⚠️ If you fill any Resource field (Title, Description, Button Copy, or Contact Email), please fill all of them. Resource Link is optional.',
  });
};
