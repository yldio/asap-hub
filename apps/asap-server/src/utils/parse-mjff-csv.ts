/* istanbul ignore file */
/* eslint-disable no-console, no-continue, no-restricted-syntax */

import parse from 'csv-parse';
import Intercept from 'apr-intercept';
import { createReadStream } from 'fs';
import path from 'path';
import { HTTPError } from 'got';

import { CMS } from '../cms';
import { TeamCreationRequest } from '../cms/teams';
import { CMSTeam } from '../entities/team';

const cache: { [key: string]: CMSTeam | string } = {};
const cms = new CMS();

const createTeam = async (
  piFirstName: string,
  piLastName: string,
  applicationNumber: string,
  projectTitle: string,
): Promise<CMSTeam | undefined> => {
  if (!cache[applicationNumber]) {
    const newTeam: TeamCreationRequest = {
      displayName: `${piLastName}, ${piFirstName[0]}.`,
      applicationNumber,
      projectTitle,
    };

    const [error, team] = await Intercept(cms.teams.create(newTeam));

    if (error) {
      // error might be due to duplicate, attempt to fetch team
      const [fetchError, fetchTeam] = await Intercept(
        cms.teams.fetchByApplicationNumber(applicationNumber),
      );

      if (fetchError) {
        console.log('Error creating Team:', newTeam);
        cache[applicationNumber] = 'FAILED';
        return undefined;
      }

      cache[applicationNumber] = fetchTeam;
    }

    cache[applicationNumber] = team;
  }
  return cache[applicationNumber] === 'FAILED'
    ? undefined
    : (cache[applicationNumber] as CMSTeam);
};

export const parseCSV = async (): Promise<void> => {
  const filePath = path.resolve(
    __dirname,
    '../../test/fixtures/mjff-sample.csv',
  );
  const parser = createReadStream(filePath).pipe(parse());

  for await (const record of parser) {
    const [
      applicationNumber,
      projectTitle,
      piFirstName,
      ,
      piLastName,
      ,
      ,
      ,
      ,
      ,
      memberName,
      ,
      role,
      ,
      jobTitle,
      institution,
      email,
      orcid,
    ] = record;

    if (applicationNumber === 'Application ID') continue; // header line ignore

    const team = await createTeam(
      piFirstName,
      piLastName,
      applicationNumber,
      projectTitle,
    );
    const [userError, user] = await Intercept(
      cms.users.create(
        { displayName: memberName, email, institution, orcid, jobTitle },
        { raw: true },
      ),
    );

    if (userError) {
      const err = userError as HTTPError;
      console.log(
        'Error creating user: ',
        record,
        'Error: ',
        err.response.body,
      );
      console.log(err.response.body);
      continue;
    }

    if (!team) {
      console.log("Couldn't add user to team: ", record);
      continue;
    }

    const [addError] = await Intercept(cms.users.addToTeam(user, role, team));

    if (addError) {
      const err = addError as HTTPError;
      console.log(
        'Error adding user to team: ',
        record,
        'Error: ',
        err.response.body,
      );
    }
  }
};
