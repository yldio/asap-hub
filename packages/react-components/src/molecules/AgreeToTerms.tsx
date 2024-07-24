import { staticPages } from '@asap-hub/routing';

import { Paragraph, Link } from '../atoms';

interface AgreeToTermsProps {
  readonly appOrigin: string;
}
const AgreeToTerms: React.FC<AgreeToTermsProps> = ({ appOrigin }) => (
  <Paragraph accent="lead">
    By proceeding, you are agreeing to the{' '}
    <Link href={new URL(staticPages.DEFAULT.TERMS.path, appOrigin).toString()}>
      Terms and Conditions
    </Link>{' '}
    and confirm that you have read our{' '}
    <Link
      href={new URL(
        staticPages.DEFAULT.PRIVACY_POLICY.path,
        appOrigin,
      ).toString()}
    >
      Privacy Policy
    </Link>
    .
  </Paragraph>
);

export default AgreeToTerms;
