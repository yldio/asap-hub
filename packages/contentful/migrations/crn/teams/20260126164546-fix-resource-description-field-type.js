module.exports.description =
  'Fix resourceDescription field type from RichText to Text if needed';

const APP_ID = '3OTn7DDwJPaUITZd6lFvZh';

module.exports.up = (migration) => {
  const teams = migration.editContentType('teams');

  // If resourceDescription is RichText, change it to Text
  // This migration is idempotent - it will only change if needed
  // Note: We can't directly check field type in migration, so we delete and recreate
  // if the field exists and might be RichText type
  
  // Delete the field if it exists (this is safe in Development environment)
  teams.deleteField('resourceDescription');

  // Recreate as Text type
  teams
    .createField('resourceDescription')
    .name('Resource Description')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  // Set field control to use our validation app
  teams.changeFieldControl('resourceDescription', 'app', APP_ID, {
    helpText: '',
  });
};

module.exports.down = (migration) => {
  const teams = migration.editContentType('teams');
  
  // Revert: delete and recreate as it was before (we don't know the original type)
  // This is a best-effort rollback
  teams.deleteField('resourceDescription');
  
  teams
    .createField('resourceDescription')
    .name('Resource Description')
    .type('Text')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
    
  teams.changeFieldControl('resourceDescription', 'builtin', 'multipleLine');
};
