module.exports.description =
  'Updates projects with additional fields for data related to opportunities';

module.exports.up = (migration) => {
  const projects = migration.editContentType('projects');

  projects
    .createField('opportunitiesAvailable')
    .name('Opportunities Available')
    .type('Boolean')
    .localized(false)
    .required(false)
    .validations([])
    .defaultValue({
      'en-US': false,
    })
    .disabled(false)
    .omitted(false);

  projects
    .createField('opportunitiesShortText')
    .name('Opportunities Short Text')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  projects
    .createField('opportunitiesLinkName')
    .name('Opportunities Link Name')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  projects.editField('pmEmail').required(true);

  projects.moveField('opportunitiesAvailable').afterField('traineeProject');
  projects
    .moveField('opportunitiesShortText')
    .afterField('opportunitiesAvailable');
  projects
    .moveField('opportunitiesLinkName')
    .afterField('opportunitiesShortText');

  projects.changeFieldControl('opportunitiesAvailable', 'builtin', 'boolean', {
    helpText: 'Check this to display opportunities available in the Hub',
    trueLabel: 'Yes',
    falseLabel: 'No',
  });
};

module.exports.down = (migration) => {
  const projects = migration.editContentType('projects');

  projects.deleteField('opportunitiesAvailable');
  projects.deleteField('opportunitiesShortText');
  projects.deleteField('opportunitiesLinkName');

  projects.editField('pmEmail').required(false);
};
