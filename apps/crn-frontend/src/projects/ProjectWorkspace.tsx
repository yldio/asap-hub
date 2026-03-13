import { FC, useState } from 'react';
import { Route, Routes, useParams } from 'react-router';
import { ProjectTool } from '@asap-hub/model';
import {
  ConfirmModal,
  NotFoundPage,
  ProjectProfileWorkspace,
  ToolModal,
} from '@asap-hub/react-components';
import {
  useIsComplianceReviewer,
  useManuscriptById,
  usePutManuscript,
} from '../network/teams/state';
import { usePatchProjectById } from './state';
import { useEligibilityReason } from '../network/teams/useEligibilityReason';
import useDiscussionHandlers from '../network/teams/useDiscussionHandlers';

type ProjectToolModalProps = Pick<
  React.ComponentProps<typeof ToolModal>,
  | 'nameFirst'
  | 'urlTitle'
  | 'urlDescription'
  | 'descriptionDescription'
  | 'saveButtonText'
>;

type ProjectWorkspaceProps = Omit<
  React.ComponentProps<typeof ProjectProfileWorkspace>,
  | 'setEligibilityReasons'
  | 'useManuscriptById'
  | 'onUpdateManuscript'
  | 'isComplianceReviewer'
  | 'createDiscussion'
  | 'onReplyToDiscussion'
  | 'onMarkDiscussionAsRead'
  | 'onDeleteTool'
> & {
  readonly workspaceHref: string;
};

const ProjectWorkspace: FC<ProjectWorkspaceProps> = ({
  workspaceHref,
  ...props
}) => {
  const { setEligibilityReasons } = useEligibilityReason();
  const isComplianceReviewer = useIsComplianceReviewer();
  const updateManuscript = usePutManuscript();
  const {
    handleCreateDiscussion,
    handleReplyToDiscussion,
    handleMarkDiscussionAsRead,
  } = useDiscussionHandlers();

  const [deleteToolIndex, setDeleteToolIndex] = useState<number | null>(null);
  const patchProject = usePatchProjectById(props.id);

  const projectTools = props.tools;

  const toolModalProps: ProjectToolModalProps = {
    nameFirst: true,
    urlTitle: 'URL',
    urlDescription: '',
    descriptionDescription:
      'Explain the purpose of this tool and any important context.',
  };

  return (
    <>
      {deleteToolIndex !== null && (
        <ConfirmModal
          title="Delete Collaboration Tool?"
          description="This will remove the collaboration tool from this project. Project members will no longer be able to access it from this section. This action cannot be undone."
          confirmText="Delete Tool"
          cancelText="Cancel"
          confirmButtonStyle="warning"
          error="Something went wrong. Please try again."
          onCancel={() => setDeleteToolIndex(null)}
          onSave={async () => {
            const tools = projectTools.filter((_, i) => i !== deleteToolIndex);
            await patchProject({ tools: tools as ProjectTool[] });
            setDeleteToolIndex(null);
          }}
        />
      )}
      <ProjectProfileWorkspace
        {...props}
        setEligibilityReasons={setEligibilityReasons}
        isComplianceReviewer={isComplianceReviewer}
        useManuscriptById={useManuscriptById}
        onUpdateManuscript={updateManuscript}
        createDiscussion={handleCreateDiscussion}
        onReplyToDiscussion={handleReplyToDiscussion}
        onMarkDiscussionAsRead={handleMarkDiscussionAsRead}
        onDeleteTool={async (toolIndex) => setDeleteToolIndex(toolIndex)}
      />
      <Routes>
        <Route
          path="tools"
          element={
            <ToolModal
              title="Add Collaboration Tool"
              backHref={workspaceHref}
              onSave={(data: ProjectTool) =>
                patchProject({
                  tools: [...(projectTools as ProjectTool[]), data],
                })
              }
              {...toolModalProps}
              saveButtonText="Add Tool"
            />
          }
        />
        <Route
          path="tools/tool/:toolIndex"
          element={
            <EditTool
              projectId={props.id}
              tools={projectTools as ProjectTool[]}
              workspaceHref={workspaceHref}
              toolModalProps={toolModalProps}
            />
          }
        />
      </Routes>
    </>
  );
};

const EditTool: FC<{
  readonly projectId: string;
  readonly tools: ReadonlyArray<ProjectTool>;
  readonly workspaceHref: string;
  readonly toolModalProps: ProjectToolModalProps;
}> = ({ projectId, tools, workspaceHref, toolModalProps }) => {
  const { toolIndex } = useParams<{ toolIndex: string }>();
  const tool = tools[parseInt(toolIndex ?? '0', 10)];
  const patchProject = usePatchProjectById(projectId);

  if (!tool) {
    return <NotFoundPage />;
  }

  return (
    <ToolModal
      {...tool}
      title="Edit Collaboration Tool"
      backHref={workspaceHref}
      onSave={(data: ProjectTool) => {
        const newTools = [...tools];
        newTools[parseInt(toolIndex ?? '0', 10)] = data;
        return patchProject({ tools: newTools });
      }}
      {...toolModalProps}
      saveButtonText="Save Changes"
    />
  );
};

export default ProjectWorkspace;
