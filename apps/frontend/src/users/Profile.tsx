import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { join } from 'path';
import {
  Container,
  ProfileHeader,
  Paragraph,
  ProfileBiography,
} from '@asap-hub/react-components';

import { useUserById } from '../api';

const ProfilePage: React.FC<{}> = () => {
  const {
    url,
    path,
    params: { id },
  } = useRouteMatch();

  const { loading, data: profile, error } = useUserById(id);

  if (loading) {
    return <Paragraph>Loading...</Paragraph>;
  }

  if (profile) {
    const initials = `${(profile.firstName && profile.firstName[0]) || ''}${
      (profile.lastName && profile.lastName[0]) || ''
    }`;

    return (
      <Container>
        <ProfileHeader
          department={'Unknown Department'}
          displayName={profile.displayName}
          initials={initials}
          institution={profile.institution || 'Unknown Institution'}
          lastModified={new Date()}
          team={'Team Unknown'}
          title={'Unknown Title'}
          role={'Unknown Role'}
          aboutHref={join(url, 'about')}
          researchInterestsHref={join(url, './research-interests')}
          outputsHref={join(url, 'outputs')}
        />
        <Switch>
          <Route
            path={`${path}/about`}
            render={() => (
              <>
                {profile.biography && (
                  <ProfileBiography biography={profile.biography} />
                )}
              </>
            )}
          />
          <Route
            path={`${path}/research-interests`}
            render={() => 'Research interests'}
          />
          <Route path={`${path}/outputs`} render={() => 'Outputs'} />
          <Redirect to={join(url, 'about')} />
        </Switch>
      </Container>
    );
  }

  return (
    <Paragraph>
      {error.name}
      {': '}
      {error.message}
    </Paragraph>
  );
};

export default ProfilePage;
