module.exports.description = '<Put your description here>';

module.exports.up = (migration) => {
  migration
    .createContentType('foo')
    .name('Foo')
    .displayField('id')
    .description('Foo');
};

module.exports.down = (migration) => migration.deleteContentType('foo');
