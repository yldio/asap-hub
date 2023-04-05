import {
  createMailTo,
  mailToFeedback,
  mailToGrants,
  mailToSupport,
} from '../mail';

describe('createMailTo', () => {
  it('generates a mailto link, when an single email is provided', () => {
    const mailTo = new URL(createMailTo('test@example.com'));
    expect(mailTo.protocol).toBe('mailto:');
    expect(mailTo.pathname).toBe('test@example.com');
  });

  it('generates a mailto link, when a list with a single email is provided', () => {
    const mailTo = new URL(createMailTo(['test@example.com']));
    expect(mailTo.protocol).toBe('mailto:');
    expect(mailTo.pathname).toBe('test@example.com');
  });

  it('generates a mailto link, when multiple emails are provided', () => {
    const mailTo = new URL(
      createMailTo(['test@example.com', 'test@example.com']),
    );
    expect(mailTo.protocol).toBe('mailto:');
    expect(mailTo.pathname).toBe('test@example.com,test@example.com');
  });

  it('escapes the email address', () => {
    expect(
      decodeURIComponent(new URL(createMailTo('te?st@example.com')).pathname),
    ).toBe('te?st@example.com');
  });

  it('does not escape the @ for email client compatibility', () => {
    expect(createMailTo('test@example.com')).toContain('@');
  });

  it('encodes subjects', () => {
    expect(
      new URL(
        createMailTo('test@example.com', { subject: 'T?est &123' }),
      ).searchParams.get('subject'),
    ).toEqual('T?est &123');
  });

  it('encodes body', () => {
    expect(
      new URL(
        createMailTo('test@example.com', { body: 'T?est &123' }),
      ).searchParams.get('body'),
    ).toEqual('T?est &123');
  });

  it('encodes body & subject', () => {
    const mailTo = new URL(
      createMailTo('test@example.com', {
        body: 'b?ody &123',
        subject: 's?ubject &123',
      }),
    );
    expect(mailTo.searchParams.get('body')).toEqual('b?ody &123');
    expect(mailTo.searchParams.get('subject')).toEqual('s?ubject &123');
  });
});

describe('mailToFeedback', () => {
  it('creates default mail', () => {
    expect(mailToFeedback()).toMatchInlineSnapshot(
      `"mailto:techsupport@asap.science?subject=ASAP+Hub%3A+Hub+Feedback"`,
    );
  });

  it('overrides defaults', () => {
    const mailTo = new URL(
      mailToFeedback({ body: 'body123', subject: 'subject123' }),
    );
    expect(mailTo.searchParams.get('body')).toEqual('body123');
    expect(mailTo.searchParams.get('subject')).toEqual('subject123');
  });
});

describe('mailToGrants', () => {
  it('creates default mail', () => {
    expect(mailToGrants()).toMatchInlineSnapshot(
      `"mailto:grants@parkinsonsroadmap.org?subject=ASAP+Hub%3A+Grant+support"`,
    );
  });

  it('overrides defaults', () => {
    const mailTo = new URL(
      mailToGrants({ body: 'body123', subject: 'subject123' }),
    );
    expect(mailTo.searchParams.get('body')).toEqual('body123');
    expect(mailTo.searchParams.get('subject')).toEqual('subject123');
  });
});

describe('mailToSupport', () => {
  it('creates default mail', () => {
    expect(mailToSupport()).toMatchInlineSnapshot(
      `"mailto:techsupport@asap.science?subject=ASAP+Hub%3A+Tech+support"`,
    );
  });

  it('overrides defaults', () => {
    const mailTo = new URL(
      mailToSupport({ body: 'body123', subject: 'subject123' }),
    );
    expect(mailTo.searchParams.get('body')).toEqual('body123');
    expect(mailTo.searchParams.get('subject')).toEqual('subject123');
  });
});
