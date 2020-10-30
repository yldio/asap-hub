import { createMailTo } from '../mail';

describe('createMailTo', () => {
  it('generates a mailto link', () => {
    expect(new URL(createMailTo('test@example.com')).protocol).toBe('mailto:');
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
