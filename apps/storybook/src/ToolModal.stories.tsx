import { ToolModal } from '@asap-hub/react-components';
import { StaticRouter } from 'react-router-dom';

import { text } from './knobs';

export default {
  title: 'Templates / Team Profile / Tool Modal',
  component: ToolModal,
};

export const Normal = () => (
  <StaticRouter>
    <ToolModal
      title={text('Title', 'Edit Tool')}
      name="Slack (#team-ferguson)"
      description="Chat privately with your team members or seek out others in the ASAP Network"
      url="https://asap.slack.com"
      backHref="#"
    />
  </StaticRouter>
);
