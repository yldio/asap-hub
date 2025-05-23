module.exports.description = '<Put your description here>';

module.exports.up = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');

  manuscripts.editField('apcRequested').defaultValue({});
};

module.exports.down = (migration) => {
  const manuscripts = migration.editContentType('manuscripts');

  manuscripts.editField('apcRequested').defaultValue({
    'en-US': false,
  });
};
