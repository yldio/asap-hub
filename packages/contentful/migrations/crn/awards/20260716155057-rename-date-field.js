module.exports.description = 'Rename label of date field to Date Awarded';

module.exports.up = (migration) => {
  const awards = migration.editContentType('awards');

  awards.editField('date', { name: 'Date Awarded' });
};

module.exports.down = (migration) => {
  const awards = migration.editContentType('awards');
  awards.editField('date', {
    name: 'Date',
  });
};
