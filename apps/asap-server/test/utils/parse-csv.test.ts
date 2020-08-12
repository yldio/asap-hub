import { parseCSV } from '../../src/utils/parse-mjff-csv';
import { CMSTeam } from '../../src/entities/team';
import { CMSUser } from '../../src/entities/user';
import { CMS } from '../../src/cms';

describe('Parse MJFF CSV file', () => {
  const cms = new CMS();
  let teams: CMSTeam[] = [];
  let users: Array<CMSUser | null> = [];

  beforeAll(async () => await parseCSV(), 10000);

  afterAll(async () => {
    await Promise.all(teams.map(({ id }) => cms.teams.delete(id)));
    await Promise.all(
      users.map((u) => (u?.id ? cms.users.delete(u.id) : null)),
    );
  });

  test('Should create 2 teams', async () => {
    teams = await Promise.all(
      ['ASAP-000282', 'ASAP-000296'].map((app) =>
        cms.teams.fetchByApplicationNumber(app),
      ),
    );
    expect(teams[0].id).toBeDefined();
    expect(teams[1].id).toBeDefined();
  });

  test('Should create 3 users', async () => {
    users = await Promise.all(
      [
        'miau@biochem.mpg.de',
        'jeringonca@ucl.ac.uk',
        'ronaldo@ucl.ac.uk',
      ].map((email) => cms.users.fetchByEmail(email)),
    );
    expect(users[0]?.id).toBeDefined();
    expect(users[1]?.id).toBeDefined();
    expect(users[2]?.id).toBeDefined();
  });
});
