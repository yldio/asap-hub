export const createMailTo = (
  email: string,
  { subject, body }: { subject?: string; body?: string } = {},
): string => {
  const mailTo = new URL(
    `mailto:${email.split('@').map(encodeURIComponent).join('@')}`,
  );

  if (subject) mailTo.searchParams.set('subject', subject);
  if (body) mailTo.searchParams.set('body', body);

  return mailTo.toString();
};

export const mailToFeedback = createMailTo('info@asap.science', {
  subject: 'ASAP Hub: Hub Feedback',
});

export const mailToGrants = createMailTo('grants@parkinsonsroadmap.org', {
  subject: 'ASAP Hub: Grant support',
});

export const mailToSupport = createMailTo('techsupport@asap.science', {
  subject: 'ASAP Hub: Tech support',
});
