import { CtaCard } from '@asap-hub/react-components';

import { text } from './knobs';

export default {
  title: 'Molecules / Cta Card',
  component: CtaCard,
};

export const Normal = () => (
  <CtaCard href="#" buttonText="Contact PM">
    <strong>{text('Title', `Interested in what you've seen?`)}</strong> <br />
    {text('Body', 'Reach out to this team and see how you can collaborate')}
  </CtaCard>
);

export const BasicCallToAction = () => (
  <CtaCard href="#" buttonText="Get Started">
    Ready to collaborate? Click the button to get in touch with the team.
  </CtaCard>
);

export const WithStrongEmphasis = () => (
  <CtaCard href="#contact" buttonText="Contact Us">
    <strong>Have questions about this research?</strong> Our team is here to
    help answer your questions and discuss collaboration opportunities.
  </CtaCard>
);

export const WithCopyEnabled = () => (
  <CtaCard href="mailto:team@example.com" buttonText="Email Team" displayCopy>
    <strong>Want to reach out via email?</strong> Copy the email address or
    click the button to open your email client.
  </CtaCard>
);

export const LongContent = () => (
  <CtaCard href="#" buttonText="Learn More">
    <strong>Interested in joining our research network?</strong> We're always
    looking for passionate researchers and collaborators who want to make a
    difference. Our team works on cutting-edge projects across multiple
    disciplines, and we'd love to hear from you about how we can work together.
  </CtaCard>
);

export const ShortContent = () => (
  <CtaCard href="#" buttonText="Join Now">
    <strong>Join us today!</strong>
  </CtaCard>
);

export const WithLineBreaks = () => (
  <CtaCard href="#apply" buttonText="Apply Now">
    <strong>Open Position Available</strong>
    <br />
    We're hiring a Senior Researcher to join our team.
    <br />
    Full-time, remote-friendly position with competitive benefits.
  </CtaCard>
);

export const ExternalLink = () => (
  <CtaCard href="https://example.com" buttonText="Visit Website">
    <strong>Learn more about our partner organization.</strong> Visit their
    website to explore additional resources and collaboration opportunities.
  </CtaCard>
);

export const WithEmailLink = () => (
  <CtaCard
    href="mailto:contact@research.org"
    buttonText="Send Email"
    displayCopy
  >
    <strong>Get in touch directly.</strong> Send us an email and we'll respond
    within 24 hours.
  </CtaCard>
);
