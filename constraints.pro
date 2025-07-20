constraints_min_version(1).

% Allow only private packages, since we do not plan to publish any of them to a registry
gen_enforced_field(WorkspaceCwd, 'private', true).

% Rules copied from https://github.com/yarnpkg/berry/blob/69866525f566bcb2d98d2cad566cc7492235930b/constraints.pro

% This rule will enforce that a workspace MUST depend on the same version of a dependency as the one used by the other workspaces
% BUT exclude React-related dependencies since we handle those separately
gen_enforced_dependency(WorkspaceCwd, DependencyIdent, DependencyRange2, DependencyType) :-
  % Iterates over all dependencies from all workspaces
    workspace_has_dependency(WorkspaceCwd, DependencyIdent, DependencyRange, DependencyType),
  % Iterates over similarly-named dependencies from all workspaces (again)
    workspace_has_dependency(OtherWorkspaceCwd, DependencyIdent, DependencyRange2, DependencyType2),
  % Ignore peer dependencies
    DependencyType \= 'peerDependencies',
    DependencyType2 \= 'peerDependencies',
  % Exclude React-related dependencies from this general rule
    DependencyIdent \= 'react',
    DependencyIdent \= 'react-dom',
    DependencyIdent \= '@types/react',
    DependencyIdent \= '@types/react-dom',
    DependencyIdent \= '@testing-library/react',
    DependencyIdent \= 'react-router-dom',
    DependencyIdent \= '@types/react-router-dom'.

% This rule will prevent workspaces from depending on non-workspace versions of available workspaces
gen_enforced_dependency(WorkspaceCwd, DependencyIdent, WorkspaceRange, DependencyType) :-
  % Iterates over all dependencies from all workspaces
    workspace_has_dependency(WorkspaceCwd, DependencyIdent, DependencyRange, DependencyType),
  % Only consider those that target something that could be a workspace
    workspace_ident(DependencyCwd, DependencyIdent),
  % Obtain the version from the dependency
    workspace_field(DependencyCwd, 'version', DependencyVersion),
  % Quirk: we must discard the workspaces that don't declare a version
    atom(DependencyVersion),
  % Only proceed if the dependency isn't satisfied by a workspace
    \+ project_workspaces_by_descriptor(DependencyIdent, DependencyRange, DependencyCwd),
  % Derive the expected range from the version
    (
      DependencyType \= 'peerDependencies' ->
        atom_concat('workspace:^', DependencyVersion, WorkspaceRange)
      ;
        atom_concat('^', DependencyVersion, WorkspaceRange)
    ).

% REACT 18 CONSTRAINTS - ONLY for crn-frontend
gen_enforced_dependency(WorkspaceCwd, 'react', '18.3.1', dependencies) :-
  workspace_ident(WorkspaceCwd, '@asap-hub/crn-frontend').

gen_enforced_dependency(WorkspaceCwd, 'react-dom', '18.3.1', dependencies) :-
  workspace_ident(WorkspaceCwd, '@asap-hub/crn-frontend').

gen_enforced_dependency(WorkspaceCwd, '@types/react', '18.2.24', devDependencies) :-
  workspace_ident(WorkspaceCwd, '@asap-hub/crn-frontend').

gen_enforced_dependency(WorkspaceCwd, '@types/react-dom', '18.2.11', devDependencies) :-
  workspace_ident(WorkspaceCwd, '@asap-hub/crn-frontend').

gen_enforced_dependency(WorkspaceCwd, '@testing-library/react', '14.1.2', devDependencies) :-
  workspace_ident(WorkspaceCwd, '@asap-hub/crn-frontend').

gen_enforced_dependency(WorkspaceCwd, 'react-router-dom', '5.3.4', dependencies) :-
  workspace_ident(WorkspaceCwd, '@asap-hub/crn-frontend').

gen_enforced_dependency(WorkspaceCwd, '@types/react-router-dom', '5.3.3', devDependencies) :-
  workspace_ident(WorkspaceCwd, '@asap-hub/crn-frontend').

% REACT 17 CONSTRAINTS - For ALL other packages that use React
gen_enforced_dependency(WorkspaceCwd, 'react', '17.0.2', dependencies) :-
  workspace_ident(WorkspaceCwd, WorkspaceIdent),
  WorkspaceIdent \= '@asap-hub/crn-frontend',
  workspace_has_dependency(WorkspaceCwd, 'react', _, dependencies).

gen_enforced_dependency(WorkspaceCwd, 'react-dom', '17.0.2', dependencies) :-
  workspace_ident(WorkspaceCwd, WorkspaceIdent),
  WorkspaceIdent \= '@asap-hub/crn-frontend',
  workspace_has_dependency(WorkspaceCwd, 'react-dom', _, dependencies).

gen_enforced_dependency(WorkspaceCwd, 'react-dom', '17.0.2', devDependencies) :-
  workspace_ident(WorkspaceCwd, WorkspaceIdent),
  WorkspaceIdent \= '@asap-hub/crn-frontend',
  workspace_has_dependency(WorkspaceCwd, 'react-dom', _, devDependencies).

gen_enforced_dependency(WorkspaceCwd, '@types/react', '17.0.65', devDependencies) :-
  workspace_ident(WorkspaceCwd, WorkspaceIdent),
  WorkspaceIdent \= '@asap-hub/crn-frontend',
  workspace_has_dependency(WorkspaceCwd, '@types/react', _, devDependencies).

gen_enforced_dependency(WorkspaceCwd, '@types/react-dom', '17.0.20', devDependencies) :-
  workspace_ident(WorkspaceCwd, WorkspaceIdent),
  WorkspaceIdent \= '@asap-hub/crn-frontend',
  workspace_has_dependency(WorkspaceCwd, '@types/react-dom', _, devDependencies).

gen_enforced_dependency(WorkspaceCwd, '@testing-library/react', '12.1.5', devDependencies) :-
  workspace_ident(WorkspaceCwd, WorkspaceIdent),
  WorkspaceIdent \= '@asap-hub/crn-frontend',
  workspace_has_dependency(WorkspaceCwd, '@testing-library/react', _, devDependencies).

gen_enforced_dependency(WorkspaceCwd, 'react-router-dom', '5.3.4', dependencies) :-
  workspace_ident(WorkspaceCwd, WorkspaceIdent),
  WorkspaceIdent \= '@asap-hub/crn-frontend',
  workspace_has_dependency(WorkspaceCwd, 'react-router-dom', _, dependencies).

gen_enforced_dependency(WorkspaceCwd, '@types/react-router-dom', '5.3.3', devDependencies) :-
  workspace_ident(WorkspaceCwd, WorkspaceIdent),
  WorkspaceIdent \= '@asap-hub/crn-frontend',
  workspace_has_dependency(WorkspaceCwd, '@types/react-router-dom', _, devDependencies).