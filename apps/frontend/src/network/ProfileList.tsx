import React from 'react';

import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { Paragraph, NetworkPeople } from '@asap-hub/react-components';
import { join } from 'path';
import { UserResponse } from '@asap-hub/model';

import { useUsers } from '../api';

const Page: React.FC<{}> = () => {
  const { path } = useRouteMatch();
  const { loading, data: usersData, error } = useUsers();

  if (loading) {
    return <Paragraph>Loading...</Paragraph>;
  }

  if (usersData) {
    const users = usersData.map((user: UserResponse) => ({
      ...user,
      profileHref: join('/users', user.id),
    }));
    return (
      <Switch>
        <Route exact path={path}>
          <NetworkPeople people={users} />
        </Route>
      </Switch>
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

export default Page;
