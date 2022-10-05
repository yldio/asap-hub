module.exports.description = 'Create content model for UserTeam'

module.exports.up = (migration) => {
  const userTeam = migration.createContentType('userTeam')
    .name('UserTeam')
    .description('')

  userTeam.createField('user')
    .name('User')
    .type('Link')
    .validations([{ linkContentType: ['users'] }])
    .linkType('Entry')

  userTeam.createField('team')
    .name('Team')
    .type('Link')
    .validations([{ linkContentType: ['teams'] }])
    .linkType('Entry')

  userTeam.changeFieldControl('user', 'builtin', 'entryLinkEditor')
  userTeam.changeFieldControl('team', 'builtin', 'entryLinkEditor')
}

module.exports.down = migration => migration.deleteContentType('userTeam')
