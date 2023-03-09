import { gp2 as gp2Model } from '@asap-hub/model';
import { Router } from 'express';
import { validateFetchUsersOptions } from '@asap-hub/server-common';
import Boom from '@hapi/boom';
import { ExternalUsersController } from '../controllers/external-users.controller';

export const externalUserRouteFactory = (
  externalUsersController: ExternalUsersController,
): Router =>
  Router().get<gp2Model.FetchUsersOptions, gp2Model.ListExternalUserResponse>(
    '/external-users',
    async (req, res) => {
      const options = validateFetchUsersOptions(req.query);

      if (
        options.filter?.onlyOnboarded === false &&
        req.loggedInUser?.role !== 'Administrator'
      ) {
        throw Boom.forbidden('Only administrators can list unonboarded users');
      }

      const users = await externalUsersController.fetch(options);

      res.json(users);
    },
  );
