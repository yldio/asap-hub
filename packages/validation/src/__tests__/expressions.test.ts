import { readFileSync } from 'fs';
import { join } from 'path';
import { crnEmailExpression, gp2EmailExpression } from '../expressions';

describe('crnEmailExpression', () => {
  const email = new RegExp(crnEmailExpression);

  it.each([
    'name@gmail.com',
    'a.b+c@sub.domain.co.uk',
    "o'brien@x.com",
    'user_1@x-y.org',
    'research_lab@my_uni.edu',
  ])('should accept %s', (value) => {
    expect(email.test(value)).toBe(true);
  });

  it('should accept the empty string, which clears an optional field', () => {
    expect(email.test('')).toBe(true);
  });

  it.each([
    ['test@test', 'the content model requires a dot in the domain'],
    ['a!b@c.com', 'the content model disallows ! in the local part'],
    ['.leading@dot.com', 'the local part may not start with a dot'],
    ['not-an-email', 'there is no domain at all'],
    ['a b@c.com', 'an address may not contain a space'],
    [' ', 'a space is not an empty value'],
  ])('should reject %p, because %s', (value) => {
    expect(email.test(value)).toBe(false);
  });

  const addressOfLength = (length: number) =>
    `${'a'.repeat(length - '@example.com'.length)}@example.com`;

  it('should accept a value at the Contentful Symbol cap', () => {
    expect(email.test(addressOfLength(256))).toBe(true);
  });

  it('should reject a value one character over the cap', () => {
    expect(email.test(addressOfLength(257))).toBe(false);
  });

  // Without the length guard the domain repetition backtracks over the whole
  // body and throws RangeError rather than returning false.
  it('should not overflow the regexp stack on a runaway value', () => {
    const runaway = `a@${'a.'.repeat(2_500_000)}!`;
    expect(() => email.test(runaway)).not.toThrow();
  });

  it('should compile under the unicode flag AJV uses', () => {
    expect(() => new RegExp(crnEmailExpression, 'u')).not.toThrow();
  });
});

describe('parity with the CRN users content model', () => {
  // The expression is a hand-copy of a string in another package, and nothing
  // else here can observe the two drifting apart.
  const migrationBody = "\\w[\\w.\\-+']*@([\\w-]+\\.)+[\\w-]+";

  it.each([
    '20230814130100-email-validation.js',
    '20260727003012-add-personal-email-field.js',
  ])('should match the validation written by %s', (migration) => {
    const source = readFileSync(
      join(__dirname, '../../../contentful/migrations/crn/users', migration),
      'utf8',
    );

    // Every backslash is doubled in the migration's source literal.
    expect(source).toContain(`^${migrationBody}$`.replace(/\\/g, '\\\\'));
  });

  // Reconstructed and compared whole rather than with toContain, which would
  // also pass on an expression widened by alternation — the one drift this test
  // exists to catch.
  it('should wrap the migration body and nothing else', () => {
    expect(crnEmailExpression).toBe(
      `^(?=[\\s\\S]{0,256}$)(?:${migrationBody})?$`,
    );
  });
});

describe('gp2EmailExpression', () => {
  const email = new RegExp(gp2EmailExpression);

  it.each(['name@gmail.com', 'a.b+c@sub.domain.co.uk', 'user_1@x-y.org'])(
    'should accept %s',
    (value) => {
      expect(email.test(value)).toBe(true);
    },
  );

  it.each([
    ["o'brien@x.com", 'the GP2 content model disallows the apostrophe'],
    ['test@test', 'the content model requires a dot in the domain'],
    ['', 'GP2 clears the field with null, not an empty string'],
  ])('should reject %p, because %s', (value) => {
    expect(email.test(value)).toBe(false);
  });

  it('should not overflow the regexp stack on a runaway value', () => {
    expect(() => email.test(`a@${'a.'.repeat(2_500_000)}!`)).not.toThrow();
  });
});

describe('parity with the GP2 users content model', () => {
  const migrationBody = '\\w[\\w.\\-+]*@([\\w-]+\\.)+[\\w-]+';

  it('should match the validation written by the users migration', () => {
    const source = readFileSync(
      join(
        __dirname,
        '../../../contentful/migrations/gp2/users',
        '6ekgyp1432o9-create-users-1682073967694.js',
      ),
      'utf8',
    );

    expect(source).toContain(`^${migrationBody}$`.replace(/\\/g, '\\\\'));
  });

  it('should wrap the migration body and nothing else', () => {
    expect(gp2EmailExpression).toBe(`^(?=[\\s\\S]{0,256}$)${migrationBody}$`);
  });
});
