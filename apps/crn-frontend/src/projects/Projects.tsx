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

const DiscoveryProjects = lazy(loadDiscoveryProjects);
const ResourceProjects = lazy(loadResourceProjects);
const TraineeProjects = lazy(loadTraineeProjects);

const Projects: FC<Record<string, never>> = () => {
  useEffect(() => {
    // Preload components for better performance
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadDiscoveryProjects()
      .then(loadResourceProjects)
      .then(loadTraineeProjects);
  }, []);

  const { path } = useRouteMatch();
  const { searchQuery, setSearchQuery, filters, toggleFilter } = useSearch();

  return (
    <Switch>
      <Route exact path={path + projects({}).discoveryProjects.template}>
        <DiscoveryProjects
          searchQuery={searchQuery}
          onChangeSearchQuery={setSearchQuery}
          filters={filters}
          onChangeFilter={toggleFilter}
        />
      </Route>
      <Route exact path={path + projects({}).resourceProjects.template}>
        <ResourceProjects
          searchQuery={searchQuery}
          onChangeSearchQuery={setSearchQuery}
          filters={filters}
          onChangeFilter={toggleFilter}
        />
      </Route>
      <Route exact path={path + projects({}).traineeProjects.template}>
        <TraineeProjects
          searchQuery={searchQuery}
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
