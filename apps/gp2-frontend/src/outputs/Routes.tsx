import { ComponentProps, FC } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { OutputsPage } from '@asap-hub/gp2-components';
import { gp2 } from '@asap-hub/routing';

import OutputList from './OutputList';
import ShareOutput from './ShareOutput';
import Frame from '../Frame';

type OutputsProps = Pick<
  ComponentProps<typeof OutputsPage>,
  'dismissBanner' | 'outputBanner'
> &
  Pick<ComponentProps<typeof ShareOutput>, 'setBannerMessage'>;

const Outputs: FC<OutputsProps> = ({
  dismissBanner,
  outputBanner,
  setBannerMessage,
}) => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <Frame title="Outputs">
          <OutputsPage
            dismissBanner={dismissBanner}
            outputBanner={outputBanner}
          >
            <Frame title={null}>
              <OutputList />
            </Frame>
          </OutputsPage>
        </Frame>
      </Route>
      <Route path={path + gp2.outputs({}).output.template}>
        <Frame title="Output">
          <ShareOutput setBannerMessage={setBannerMessage} />
        </Frame>
      </Route>
    </Switch>
  );
};

export default Outputs;
