module.exports.description =
  'Move tech support after open science team member in editor layout';

module.exports.up = (migration) => {
  const users = migration.editContentType('users');
  const editorLayout = users.editEditorLayout();
  editorLayout.moveField('techSupport').afterField('openScienceTeamMember');
};

module.exports.down = (migration) => {
  const users = migration.editContentType('users');
  const editorLayout = users.editEditorLayout();
  editorLayout.moveField('techSupport').afterField('userSocials');
};
