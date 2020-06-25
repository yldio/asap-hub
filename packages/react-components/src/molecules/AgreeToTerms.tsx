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
  <Paragraph>
    By proceeding, you agree to our <Link href={termsHref}>Terms</Link> and
    confirm that you have read our{' '}
    <Link href={privacyPolicyHref}>Privacy policy</Link>.
  </Paragraph>
);

export default AgreeToTerms;
