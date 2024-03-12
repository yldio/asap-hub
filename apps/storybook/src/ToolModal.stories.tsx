import { ToolModal } from '@asap-hub/react-components';
import { text } from './knobs';
import { StaticRouter } from 'react-router-dom';

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
