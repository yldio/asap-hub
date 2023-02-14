import { FC, PropsWithChildren } from 'react';
import { Switch, Route } from 'react-router-dom';

import { Frame } from '@asap-hub/frontend-utils';

type ShareOutputSwitchProps = PropsWithChildren<{
  path: string;
  ShareOutput: FC;
}>;

const ShareOutputSwitch: FC<ShareOutputSwitchProps> = ({
  children,
  path,
  ShareOutput,
}) => (
  <Switch>
    <Route path={path}>
      <Frame title="Share Output">
        <ShareOutput />
      </Frame>
    </Route>
    {children}
  </Switch>
);

export default ShareOutputSwitch;
