import React from 'react';
import { Paragraph, Link } from '../atoms';

interface AgreeToTermsProps {
  readonly termsHref: string;
  readonly privacyPolicyHref: string;
}
const AgreeToTerms: React.FC<AgreeToTermsProps> = ({
  termsHref,
  privacyPolicyHref,
}) => (
  <Paragraph accent="lead">
    By proceeding, you are agreeing to the{' '}
    <Link href={termsHref}>Terms and Conditions</Link> and confirm that you have
    read our <Link href={privacyPolicyHref}>Privacy Policy</Link>.
  </Paragraph>
);

export default AgreeToTerms;
