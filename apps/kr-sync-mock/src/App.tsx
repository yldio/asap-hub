/* eslint-env browser */
import { useAuth0 } from '@auth0/auth0-react';

function App() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } =
    useAuth0();

  if (isLoading) {
    return <div className="loading">Loading security context...</div>;
  }

  const hasMetadata =
    user &&
    (user['https://dev.hub.asap.science/user'] ||
      user['http://localhost:3000/user']);

  return (
    <div className="container">
      <header>
        <h1>ASAP KR-Sync</h1>
        <p className="subtitle">DataSeer Integration Simulation</p>
      </header>

      <main>
        {!isAuthenticated ? (
          <div className="card login-card">
            <h2>Authentication Required</h2>
            <p>
              This is a mock of the DataSeer environment. Log in to verify that
              your ASAP Hub account works here without a new signup.
            </p>
            <button
              onClick={() => loginWithRedirect()}
              className="btn btn-primary"
            >
              Log In with ASAP ID
            </button>
          </div>
        ) : (
          <div className="card profile-card">
            <div className="profile-header">
              <img src={user?.picture} alt={user?.name} className="avatar" />
              <div>
                <h2>Welcome, {user?.given_name || 'Scientist'}!</h2>
                <p className="email">{user?.email}</p>
              </div>
            </div>

            <div className="privacy-results">
              <h3>🔒 Privacy Verification</h3>
              {hasMetadata ? (
                <div className="alert error">
                  <strong>⚠️ WARNING: SENSITIVE DATA FOUND</strong>
                  <p>
                    The ID Token contains the full ASAP Hub metadata (teams,
                    projects, etc.). The filter is not working.
                  </p>
                </div>
              ) : (
                <div className="alert success">
                  <strong>✅ SUCCESS: PRIVACY GUARANTEED</strong>
                  <p>
                    No sensitive ASAP Hub metadata was found in the token.
                    DataSeer only knows your verified identity.
                  </p>
                </div>
              )}
            </div>

            <div className="token-inspector">
              <h3>Decoded Identity Packet (ID Token)</h3>
              <pre>{JSON.stringify(user, null, 2)}</pre>
            </div>

            <button
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
              className="btn btn-secondary"
            >
              Log Out
            </button>
          </div>
        )}
      </main>

      <footer>
        <p>Proof of Concept: Shared User Base & Restricted Claims</p>
      </footer>
    </div>
  );
}

export default App;
