import { OpenQuestionsModal } from '@asap-hub/react-components';
import { StaticRouter } from 'react-router-dom';

export default {
  title: 'Templates / User Profile / Open Questions Modal',
  component: OpenQuestionsModal,
};

export const Normal = () => (
  <StaticRouter>
    <OpenQuestionsModal questions={['Q1', 'Q2']} backHref="#" />
  </StaticRouter>
);
