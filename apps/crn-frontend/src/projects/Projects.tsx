import { FC, lazy, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
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

  const {
    searchQuery,
    debouncedSearchQuery,
    setSearchQuery,
    filters,
    toggleFilter,
  } = useSearch();

  return (
    <Routes>
      {/* Project Detail Routes - must come before list routes */}
      <Route
        path="discovery/:projectId/*"
        element={<DiscoveryProjectDetail />}
      />
      <Route path="resource/:projectId/*" element={<ResourceProjectDetail />} />
      <Route path="trainee/:projectId/*" element={<TraineeProjectDetail />} />

      {/* Project List Routes */}
      <Route
        path={projects({}).discoveryProjects.template}
        element={
          <DiscoveryProjects
            searchQuery={searchQuery}
            debouncedSearchQuery={debouncedSearchQuery}
            onChangeSearchQuery={setSearchQuery}
            filters={filters}
            onChangeFilter={toggleFilter}
          />
        }
      />
      <Route
        path={projects({}).resourceProjects.template}
        element={
          <ResourceProjects
            searchQuery={searchQuery}
            debouncedSearchQuery={debouncedSearchQuery}
            onChangeSearchQuery={setSearchQuery}
            filters={filters}
            onChangeFilter={toggleFilter}
          />
        }
      />
      <Route
        path={projects({}).traineeProjects.template}
        element={
          <TraineeProjects
            searchQuery={searchQuery}
            debouncedSearchQuery={debouncedSearchQuery}
            onChangeSearchQuery={setSearchQuery}
            filters={filters}
            onChangeFilter={toggleFilter}
          />
        }
      />
      <Route
        path="*"
        element={
          <Navigate
            to={projects.template + projects({}).discoveryProjects.template}
            replace
          />
        }
      />
    </Routes>
  );
};

export default Projects;
