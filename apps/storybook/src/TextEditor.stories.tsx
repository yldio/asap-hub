import { TextEditor } from '@asap-hub/react-components';

export default {
  title: 'Atoms / TextEditor',
};

export const Normal = () => <TextEditor onChange={console.log} value={''} />;
