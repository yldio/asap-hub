import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { join } from 'path';
import {
  Paragraph,
  ProfilePage,
  ProfileAbout,
  ProfileResearch,
} from '@asap-hub/react-components';

import { useUserById } from '../api';

const Profile: React.FC<{}> = () => {
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
    const profilePageProps = {
      ...profile,
      aboutHref: join(url, 'about'),
      researchHref: join(url, 'research'),
      outputsHref: join(url, 'outputs'),
      teamProfileHref: profile.teams[0]
        ? `/teams/${profile.teams[0].id}`
        : undefined,
    };

    return (
      <ProfilePage {...profilePageProps}>
        <Switch>
          <Route path={`${path}/about`}>
            <ProfileAbout {...profile} />
          </Route>
          <Route path={`${path}/research`}>
            <ProfileResearch {...profile} />
          </Route>
          <Route path={`${path}/outputs`}>TODO Outputs here</Route>

          <Redirect to={join(url, 'about')} />
        </Switch>
      </ProfilePage>
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

export default Profile;
