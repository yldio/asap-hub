module.exports.description = 'Create content model for Labs'

module.exports.up = (migration) => {
  const labs = migration.createContentType('labs')
    .name('Labs')
    .displayField('id')
    .description('')

  labs.createField('id')
    .name('ID')
    .type('Symbol')

  labs.createField('name')
    .name('Name')
    .type('Symbol')

  labs.createField('test')
    .name('test')
    .type('Integer')

  labs.changeFieldControl('id', 'builtin', 'singleLine')
  labs.changeFieldControl('name', 'builtin', 'singleLine')
  labs.changeFieldControl('test', 'builtin', 'numberEditor')
}

module.exports.down = migration => migration.deleteContentType('labs')
