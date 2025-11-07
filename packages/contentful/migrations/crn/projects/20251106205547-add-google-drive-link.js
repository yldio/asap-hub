module.exports.description = 'Add Google Drive link field to Projects';

module.exports.up = (migration) => {
  const projects = migration.editContentType('projects');

  projects
    .createField('googleDriveLink')
    .name('Google Drive Link')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        regexp: {
          pattern:
            '^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-/]))?$',
          flags: null,
        },
        message: 'URL must start with http://, https://, or ftp://',
      },
    ])
    .disabled(false)
    .omitted(false);

  projects.changeFieldControl('googleDriveLink', 'builtin', 'urlEditor', {
    helpText: 'Link to Google Drive folder or document',
  });

  // Position it after contactEmail field
  projects.moveField('googleDriveLink').afterField('contactEmail');
};

module.exports.down = (migration) => {
  const projects = migration.editContentType('projects');
  projects.deleteField('googleDriveLink');
};
