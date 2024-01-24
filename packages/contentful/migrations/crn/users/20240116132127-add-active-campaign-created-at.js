module.exports.description = 'Add activeCampaignCreatedAt to users';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');
  users
    .createField('activeCampaignCreatedAt')
    .name('Active Campaign Contact Created At')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  users
    .createField('activeCampaignId')
    .name('Active Campaign Contact Id')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');
  users.deleteField('activeCampaignCreatedAt');
  users.deleteField('activeCampaignId');
};
