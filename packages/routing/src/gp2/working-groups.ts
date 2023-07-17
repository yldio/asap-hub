import { route, stringParser } from 'typesafe-routes';
import resource from './resource';

export type OutputDocumentTypeParameter =
  | 'article'
  | 'code-software'
  | 'dataset'
  | 'procedural-form'
  | 'training-materials'
  | 'gp2-reports';

export const outputDocumentTypeParser = {
  parse: (data: string): OutputDocumentTypeParameter =>
    data as OutputDocumentTypeParameter,
  serialize: (data: OutputDocumentTypeParameter): string => data,
};

const workingGroup = (() => {
  const edit = route('/edit', {}, { resource });
  const add = route('/add', {}, {});
  const overview = route('/overview', {}, {});
  const workspace = route('/workspace', {}, { add, edit });

  const upcoming = route('/upcoming', {}, {});
  const past = route('/past', {}, {});
  const outputs = route('/outputs', {}, {});
  const createOutput = route(
    '/create-output/:outputDocumentType',
    { outputDocumentType: outputDocumentTypeParser },
    {},
  );

  return route(
    '/:workingGroupId',
    { workingGroupId: stringParser },
    { overview, workspace, outputs, upcoming, past, createOutput },
  );
})();

const workingGroups = route('/working-groups', {}, { workingGroup });

export default workingGroups;
