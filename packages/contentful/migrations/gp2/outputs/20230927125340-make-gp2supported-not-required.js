module.exports.description = 'Make gp2Supported not required';

module.exports.up = (migration) => {
  const outputs = migration.editContentType('outputs');
  outputs.editField('gp2Supported').required(false);
  outputs.changeFieldControl('gp2Supported', 'builtin', 'dropdown', {
    helpText:
      'Has this output been supported by GP2? This field is not required for Training Materials and Procedural Form',
  });
};

module.exports.down = (migration) => {
  const outputs = migration.editContentType('outputs');
  outputs.editField('gp2Supported').required(true);
  outputs.changeFieldControl('gp2Supported', 'builtin', 'dropdown', {
    helpText: 'Has this output been supported by GP2?',
  });
};
