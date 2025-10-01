import { Card } from '@asap-hub/react-components';
import { useState } from 'react';
import { useTeamCollaborationPerformanceZustand } from '../hooks/use-team-collaboration-performance';
import { useTeamCollaborationPerformance as useRecoilTeamCollaborationPerformance } from '../state';

/**
 * Demo component comparing Recoil vs React Query + Zustand implementations
 *
 * This component demonstrates:
 * - Side-by-side comparison of both approaches
 * - Performance differences
 * - Developer experience differences
 * - Bundle size impact
 */
const TeamCollaborationPerformanceDemo = () => {
  const [showComparison, setShowComparison] = useState(false);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Team Collaboration Performance - State Management Comparison</h1>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setShowComparison(!showComparison)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {showComparison ? 'Hide Comparison' : 'Show Side-by-Side Comparison'}
        </button>
      </div>

      {showComparison ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
          }}
        >
          <RecoilImplementation />
          <ReactQueryZustandImplementation />
        </div>
      ) : (
        <ReactQueryZustandImplementation />
      )}
    </div>
  );
};

export default TeamCollaborationPerformanceDemo;

/**
 * Original Recoil implementation
 */
const RecoilImplementation = () => {
  const performance = useRecoilTeamCollaborationPerformance({
    timeRange: 'all',
  });

  return (
    <Card>
      <h2>🔵 Recoil Implementation</h2>
      <div style={{ marginBottom: '10px' }}>
        <strong>Status:</strong> {performance ? '✅ Loaded' : '⏳ Loading...'}
      </div>
      {performance && (
        <div>
          <h3>Performance Data:</h3>
          <pre
            style={{
              backgroundColor: '#f5f5f5',
              padding: '10px',
              borderRadius: '4px',
              fontSize: '12px',
              overflow: 'auto',
            }}
          >
            {JSON.stringify(performance, null, 2)}
          </pre>
        </div>
      )}
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        <strong>Features:</strong>
        <ul>
          <li>Complex atom/selector setup</li>
          <li>Manual cache management</li>
          <li>No background refetching</li>
          <li>Larger bundle size</li>
        </ul>
      </div>
    </Card>
  );
};

/**
 * New React Query + Zustand implementation
 */
const ReactQueryZustandImplementation = () => {
  const {
    performance,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
    dataUpdatedAt,
    setOptimisticPerformance,
    resetOptimisticState,
  } = useTeamCollaborationPerformanceZustand();

  return (
    <Card>
      <h2>🟢 React Query + Zustand Implementation</h2>

      <div style={{ marginBottom: '10px' }}>
        <strong>Status:</strong>
        {isLoading && ' ⏳ Loading...'}
        {isError && ' ❌ Error'}
        {performance && ' ✅ Loaded'}
        {isFetching && !isLoading && ' 🔄 Refetching...'}
      </div>

      {isError && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          <strong>Error:</strong> {error?.message}
        </div>
      )}

      {performance && (
        <div>
          <h3>Performance Data:</h3>
          <pre
            style={{
              backgroundColor: '#f5f5f5',
              padding: '10px',
              borderRadius: '4px',
              fontSize: '12px',
              overflow: 'auto',
            }}
          >
            {JSON.stringify(performance, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => refetch()}
          disabled={isLoading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          {isLoading ? 'Loading...' : 'Refetch Data'}
        </button>

        <button
          onClick={() =>
            setOptimisticPerformance({
              withinTeam: {
                article: {
                  belowAverageMin: 0,
                  belowAverageMax: 25,
                  averageMin: 25,
                  averageMax: 75,
                  aboveAverageMin: 75,
                  aboveAverageMax: 100,
                },
                bioinformatics: {
                  belowAverageMin: 0,
                  belowAverageMax: 25,
                  averageMin: 25,
                  averageMax: 75,
                  aboveAverageMin: 75,
                  aboveAverageMax: 100,
                },
                dataset: {
                  belowAverageMin: 0,
                  belowAverageMax: 25,
                  averageMin: 25,
                  averageMax: 75,
                  aboveAverageMin: 75,
                  aboveAverageMax: 100,
                },
                labMaterial: {
                  belowAverageMin: 0,
                  belowAverageMax: 25,
                  averageMin: 25,
                  averageMax: 75,
                  aboveAverageMin: 75,
                  aboveAverageMax: 100,
                },
                protocol: {
                  belowAverageMin: 0,
                  belowAverageMax: 25,
                  averageMin: 25,
                  averageMax: 75,
                  aboveAverageMin: 75,
                  aboveAverageMax: 100,
                },
              },
              acrossTeam: {
                article: {
                  belowAverageMin: 0,
                  belowAverageMax: 25,
                  averageMin: 25,
                  averageMax: 75,
                  aboveAverageMin: 75,
                  aboveAverageMax: 100,
                },
                bioinformatics: {
                  belowAverageMin: 0,
                  belowAverageMax: 25,
                  averageMin: 25,
                  averageMax: 75,
                  aboveAverageMin: 75,
                  aboveAverageMax: 100,
                },
                dataset: {
                  belowAverageMin: 0,
                  belowAverageMax: 25,
                  averageMin: 25,
                  averageMax: 75,
                  aboveAverageMin: 75,
                  aboveAverageMax: 100,
                },
                labMaterial: {
                  belowAverageMin: 0,
                  belowAverageMax: 25,
                  averageMin: 25,
                  averageMax: 75,
                  aboveAverageMin: 75,
                  aboveAverageMax: 100,
                },
                protocol: {
                  belowAverageMin: 0,
                  belowAverageMax: 25,
                  averageMin: 25,
                  averageMax: 75,
                  aboveAverageMin: 75,
                  aboveAverageMax: 100,
                },
              },
            })
          }
          style={{
            padding: '8px 16px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Optimistic Update
        </button>

        <button
          onClick={() => resetOptimisticState()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
      </div>

      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        <strong>Features:</strong>
        <ul>
          <li>Simple, intuitive API</li>
          <li>Automatic caching & background updates</li>
          <li>Built-in retry logic</li>
          <li>Optimistic updates support</li>
          <li>Clean separation of server/client state</li>
          <li>Smaller bundle size</li>
          <li>Better TypeScript support</li>
          <li>DevTools integration</li>
        </ul>
        <div style={{ marginTop: '5px' }}>
          <strong>Last Updated:</strong>{' '}
          {dataUpdatedAt
            ? new Date(dataUpdatedAt).toLocaleTimeString()
            : 'Never'}
        </div>
      </div>
    </Card>
  );
};
