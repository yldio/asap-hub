import {
  mapManuscriptLifecycleToType,
  mapManuscriptTypeToSubType,
  ListResearchOutputResponse,
  ResearchOutputResponse,
  ResearchOutputTeamResponse,
  ResearchOutputWorkingGroupResponse,
  UserResponse,
} from '@asap-hub/model';
import {
  getUserRole,
  hasEditResearchOutputPermission,
} from '@asap-hub/validation';
import Boom from '@hapi/boom';
import { Response, Router } from 'express';
import ManuscriptController from '../controllers/manuscript.controller';
import ResearchOutputController from '../controllers/research-output.controller';
import {
  validateResearchOutputParameters,
  validateResearchOutputPostRequestParameters,
  validateResearchOutputPostRequestParametersIdentifiers,
  validateResearchOutputPutRequestParameters,
  validateResearchOutputFetchOptions,
  validateResearchOutputPostPreprintRequestParameters,
} from '../validation/research-output.validation';

export const researchOutputRouteFactory = (
  researchOutputController: ResearchOutputController,
  manuscriptController: ManuscriptController,
): Router => {
  const researchOutputRoutes = Router();

  researchOutputRoutes.get(
    '/research-outputs',
    async (req, res: Response<ListResearchOutputResponse>) => {
      const { query, loggedInUser } = req;
      const { teamId, status, workingGroupId, filter, ...options } =
        validateResearchOutputFetchOptions(query);
      const isRequestingDrafts = status === 'draft';

      if (isRequestingDrafts) {
        const hasTeamRole = teamId
          ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            getUserRole(loggedInUser!, 'teams', [teamId]) !== 'None'
          : false;

        const hasWorkingGroupRole = workingGroupId
          ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            getUserRole(loggedInUser!, 'workingGroups', [workingGroupId]) !==
            'None'
          : false;

        if (!hasTeamRole && !hasWorkingGroupRole) {
          throw Boom.forbidden();
        }
      }

      const result = await researchOutputController.fetch({
        ...options,
        ...(isRequestingDrafts
          ? {
              includeDrafts: true,
              filter: {
                documentType: filter,
                status,
                workingGroupId,
                teamId,
              },
            }
          : { filter }),
      });

      res.json(result);
    },
  );

  researchOutputRoutes.get<{ researchOutputId: string }>(
    '/research-outputs/:researchOutputId',
    async (req, res: Response<ResearchOutputResponse>) => {
      const { params } = req;

      if (!req.loggedInUser) throw Boom.forbidden();

      const { researchOutputId } = validateResearchOutputParameters(params);

      const result = await researchOutputController.fetchById(researchOutputId);

      if (!result.published && !hasAccessToDraft(req.loggedInUser, result)) {
        throw Boom.notFound(
          'You do not have permission to view this research-output',
        );
      }

      res.json(result);
    },
  );

  researchOutputRoutes.post('/research-outputs', async (req, res) => {
    const { body, loggedInUser } = req;
    const createRequest = validateResearchOutputPostRequestParameters(body);
    validateResearchOutputPostRequestParametersIdentifiers(createRequest);

    const workingGroupOutput = createRequest.workingGroups.length;

    const userRole = getUserRole(
      loggedInUser as UserResponse,
      workingGroupOutput ? 'workingGroups' : 'teams',
      workingGroupOutput ? createRequest.workingGroups : createRequest.teams,
    );

    if (
      !loggedInUser ||
      !hasEditResearchOutputPermission(userRole, createRequest.published)
    ) {
      throw Boom.forbidden();
    }

    const researchOutput = await researchOutputController.create({
      ...createRequest,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      createdBy: loggedInUser!.id,
    });

    res.status(201).json(researchOutput);
  });

  researchOutputRoutes.put(
    '/research-outputs/:researchOutputId',
    async (req, res) => {
      const { body, params, loggedInUser } = req;
      const { researchOutputId } = validateResearchOutputParameters(params);
      const updateRequest = validateResearchOutputPutRequestParameters(body);
      validateResearchOutputPostRequestParametersIdentifiers(body);

      const workingGroupOutput = updateRequest.workingGroups.length;

      const userRole = getUserRole(
        loggedInUser as UserResponse,
        workingGroupOutput ? 'workingGroups' : 'teams',
        workingGroupOutput ? updateRequest.workingGroups : updateRequest.teams,
      );

      if (
        !loggedInUser ||
        !hasEditResearchOutputPermission(userRole, updateRequest.published)
      ) {
        throw Boom.forbidden();
      }

      const researchOutput = await researchOutputController.update(
        researchOutputId,
        {
          ...updateRequest,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          updatedBy: loggedInUser!.id,
        },
      );

      res.status(200).json(researchOutput);
    },
  );

  researchOutputRoutes.post('/research-outputs/preprint', async (req, res) => {
    const { body, loggedInUser } = req;

    // loggedInUser is guaranteed to be defined by the permissionHandler middleware
    // but TypeScript doesn't know this, so we use a type assertion
    const user = loggedInUser as UserResponse;

    const { manuscriptId } =
      validateResearchOutputPostPreprintRequestParameters(body);
    const manuscript = await manuscriptController.fetchById(
      manuscriptId,
      user.id,
    );
    if (!manuscript) {
      throw Boom.notFound('Manuscript not found');
    }

    const preprintManuscriptVersion = manuscript.versions.find(
      (version) => version.lifecycle === 'Preprint',
    );

    if (!preprintManuscriptVersion) {
      return res.status(200).json({
        message: 'Manuscript version with lifecycle preprint not found',
      });
    }

    const hasPreprintResearchOutput =
      await manuscriptController.checkResearchOutputLinked(
        preprintManuscriptVersion?.id,
      );

    if (hasPreprintResearchOutput) {
      return res.status(200).json({
        message: 'Research output already exists for this manuscript version',
      });
    }

    const authors = Array.from(
      new Set([
        ...preprintManuscriptVersion.firstAuthors.map((author) => author.id),
        ...preprintManuscriptVersion.correspondingAuthor.map(
          (author) => author.id,
        ),
        ...preprintManuscriptVersion.additionalAuthors.map(
          (author) => author.id,
        ),
      ]),
    );

    const researchOutput = await researchOutputController.create({
      title: manuscript.title,
      link: manuscript.url,
      type:
        preprintManuscriptVersion.lifecycle &&
        mapManuscriptLifecycleToType(preprintManuscriptVersion.lifecycle),
      subtype:
        preprintManuscriptVersion.type &&
        mapManuscriptTypeToSubType(preprintManuscriptVersion.type),
      descriptionMD: preprintManuscriptVersion.description,
      shortDescription: preprintManuscriptVersion.shortDescription,
      labs: preprintManuscriptVersion.labs?.map((lab) => lab.id) || [],
      authors: authors.map((author) => ({ userId: author })),
      teams: preprintManuscriptVersion.teams?.map((team) => team.id) || [],
      isInReview: false,
      sharingStatus: 'Public',
      asapFunded: true,
      usedInPublication: true,
      environments: [],
      documentType: 'Article',
      createdBy: user.id,
      methods: [],
      organisms: [],
      relatedEvents: [],
      relatedResearch: [],
      keywords: [],
      workingGroups: [],
      impact: manuscript.impact?.id,
      categories: manuscript.categories?.map((category) => category.id),
      relatedManuscriptVersion: preprintManuscriptVersion.id,
      relatedManuscript: manuscript.id,
      published: true,
    });

    return res.status(201).json(researchOutput);
  });

  return researchOutputRoutes;
};

export const hasAccessToDraft = (
  loggedInUser: UserResponse,
  researchOutput:
    | ResearchOutputTeamResponse
    | ResearchOutputWorkingGroupResponse,
): boolean => {
  if (loggedInUser.role === 'Staff') {
    return true;
  }
  if (!researchOutput.workingGroups) {
    return loggedInUser.teams.some((userTeam) =>
      researchOutput.teams.find((outputTeam) => outputTeam.id === userTeam.id),
    );
  }
  return loggedInUser.workingGroups.some(
    (userWorkingGroup) =>
      researchOutput?.workingGroups.find(
        (outputWorkingGroup) => outputWorkingGroup.id === userWorkingGroup.id,
      ),
  );
};
