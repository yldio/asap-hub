module.exports.description =
  'Add bulkImported, status audit, and outputs-linked audit fields to milestones';

module.exports.up = (migration) => {
  const milestones = migration.editContentType('milestones');

  milestones
    .createField('bulkImported')
    .name('Bulk Imported')
    .type('Boolean')
    .localized(false)
    .required(false)
    .validations([])
    .defaultValue({ 'en-US': false })
    .disabled(true)
    .omitted(false);

  milestones
    .createField('statusUpdatedAt')
    .name('Status Updated At')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  milestones
    .createField('statusUpdatedBy')
    .name('Status Updated By')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['users'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  milestones
    .createField('outputsLinkedAt')
    .name('Outputs Linked At')
    .type('Date')
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  milestones
    .createField('outputsLinkedBy')
    .name('Outputs Linked By')
    .type('Link')
    .localized(false)
    .required(false)
    .validations([
      {
        linkContentType: ['users'],
      },
    ])
    .disabled(false)
    .omitted(false)
    .linkType('Entry');

  milestones.moveField('statusUpdatedAt').afterField('status');
  milestones.moveField('statusUpdatedBy').afterField('statusUpdatedAt');
  milestones.moveField('outputsLinkedAt').afterField('relatedArticles');
  milestones.moveField('outputsLinkedBy').afterField('outputsLinkedAt');
};

module.exports.down = (migration) => {
  const milestones = migration.editContentType('milestones');
  milestones.deleteField('outputsLinkedBy');
  milestones.deleteField('outputsLinkedAt');
  milestones.deleteField('statusUpdatedBy');
  milestones.deleteField('statusUpdatedAt');
  milestones.deleteField('bulkImported');
};
