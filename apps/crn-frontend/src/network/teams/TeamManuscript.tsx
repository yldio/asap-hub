import { Frame } from '@asap-hub/frontend-utils';
import { ManuscriptForm, ManuscriptHeader } from '@asap-hub/react-components';
import { FormProvider, useForm } from 'react-hook-form';
import { usePostManuscript } from './state';

const TeamManuscript: React.FC = () => {
  const form = useForm();
  const createManuscript = usePostManuscript();

  return (
    <FormProvider {...form}>
      <Frame title="Create Manuscript">
        <ManuscriptHeader />
        <ManuscriptForm onSave={createManuscript} />
      </Frame>
    </FormProvider>
  );
};
export default TeamManuscript;
