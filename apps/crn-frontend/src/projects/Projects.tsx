import { FC, lazy, useEffect } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { projects } from '@asap-hub/routing';
import { useSearch } from '../hooks';

const loadDiscoveryProjects = () =>
  import(/* webpackChunkName: "Discovery" */ './DiscoveryProjects');
const loadResourceProjects = () =>
  import(/* webpackChunkName: "Resource" */ './ResourceProjects');
const loadTraineeProjects = () =>
  import(/* webpackChunkName: "Trainee" */ './TraineeProjects');
const loadDiscoveryProjectDetail = () =>
  import(/* webpackChunkName: "DiscoveryDetail" */ './DiscoveryProjectDetail');
const loadResourceProjectDetail = () =>
  import(/* webpackChunkName: "ResourceDetail" */ './ResourceProjectDetail');
const loadTraineeProjectDetail = () =>
  import(/* webpackChunkName: "TraineeDetail" */ './TraineeProjectDetail');

const DiscoveryProjects = lazy(loadDiscoveryProjects);
const ResourceProjects = lazy(loadResourceProjects);
const TraineeProjects = lazy(loadTraineeProjects);
const DiscoveryProjectDetail = lazy(loadDiscoveryProjectDetail);
const ResourceProjectDetail = lazy(loadResourceProjectDetail);
const TraineeProjectDetail = lazy(loadTraineeProjectDetail);

const Projects: FC<Record<string, never>> = () => {
  useEffect(() => {
    // Preload components for better performance
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadDiscoveryProjects()
      .then(loadResourceProjects)
      .then(loadTraineeProjects);
  }, []);

  const { path } = useRouteMatch();
  const {
    searchQuery,
    debouncedSearchQuery,
    setSearchQuery,
    filters,
    toggleFilter,
  } = useSearch();

  return (
    <Switch>
      {/* Project Detail Routes - must come before list routes */}
      {/* Use full template path from routing package (like teams do) to include nested routes */}
      {/* Pattern: path + parent.template + parent({}).child.template */}
      <Route
        path={
          path +
          projects({}).discoveryProjects.template +
          projects({}).discoveryProjects({}).discoveryProject.template
        }
      >
        <DiscoveryProjectDetail />
      </Route>
      <Route
        path={
          path +
          projects({}).resourceProjects.template +
          projects({}).resourceProjects({}).resourceProject.template
        }
      >
        <ResourceProjectDetail />
      </Route>
      <Route
        path={
          path +
          projects({}).traineeProjects.template +
          projects({}).traineeProjects({}).traineeProject.template
        }
      >
        <TraineeProjectDetail />
      </Route>

      {/* Project List Routes */}
      <Route exact path={path + projects({}).discoveryProjects.template}>
        <DiscoveryProjects
          searchQuery={searchQuery}
          debouncedSearchQuery={debouncedSearchQuery}
          onChangeSearchQuery={setSearchQuery}
          filters={filters}
          onChangeFilter={toggleFilter}
        />
      </Route>
      <Route exact path={path + projects({}).resourceProjects.template}>
        <ResourceProjects
          searchQuery={searchQuery}
          debouncedSearchQuery={debouncedSearchQuery}
          onChangeSearchQuery={setSearchQuery}
          filters={filters}
          onChangeFilter={toggleFilter}
        />
      </Route>
      <Route exact path={path + projects({}).traineeProjects.template}>
        <TraineeProjects
          searchQuery={searchQuery}
          debouncedSearchQuery={debouncedSearchQuery}
          onChangeSearchQuery={setSearchQuery}
          filters={filters}
          onChangeFilter={toggleFilter}
        />
      </Route>
      <Redirect
        to={projects.template + projects({}).discoveryProjects.template}
      />
    </Switch>
  );
};

export default Projects;
