import { PageContraints as PageConstraints } from '@asap-hub/react-components';

import { select } from './knobs';

export default {
  title: 'Templates / Layout / Page Constraints',
  component: PageConstraints,
};

const contentStyles: React.CSSProperties = {
  padding: '16px',
  background: '#f0f0f0',
  border: '2px dashed #999',
  minHeight: '200px',
};

export const Normal = () => (
  <PageConstraints>
    <div style={contentStyles}>
      This content is constrained to a maximum width with consistent padding on
      all sides. Resize the viewport to see responsive padding behavior.
    </div>
  </PageConstraints>
);

export const AsHeader = () => (
  <PageConstraints as="header">
    <div style={contentStyles}>
      This PageConstraints is rendered as a &lt;header&gt; element.
    </div>
  </PageConstraints>
);

export const AsMain = () => (
  <PageConstraints as="main">
    <div style={contentStyles}>
      This PageConstraints is rendered as a &lt;main&gt; element.
    </div>
  </PageConstraints>
);

export const AsArticle = () => (
  <PageConstraints as="article">
    <div style={contentStyles}>
      This PageConstraints is rendered as an &lt;article&gt; element.
    </div>
  </PageConstraints>
);

export const NoPaddingBottom = () => (
  <PageConstraints noPaddingBottom>
    <div style={contentStyles}>
      This PageConstraints has no bottom padding. Useful when stacking multiple
      sections.
    </div>
  </PageConstraints>
);

export const NoPaddingTop = () => (
  <PageConstraints noPaddingTop>
    <div style={contentStyles}>
      This PageConstraints has no top padding. Useful when stacking multiple
      sections.
    </div>
  </PageConstraints>
);

export const NoPaddingTopOrBottom = () => (
  <PageConstraints noPaddingTop noPaddingBottom>
    <div style={contentStyles}>
      This PageConstraints has no top or bottom padding.
    </div>
  </PageConstraints>
);

export const Interactive = () => (
  <PageConstraints
    as={
      select('Element Type', ['div', 'header', 'main', 'article'], 'div') as
        | 'div'
        | 'header'
        | 'main'
        | 'article'
    }
    noPaddingBottom={select('No Padding Bottom', [true, false], false)}
    noPaddingTop={select('No Padding Top', [true, false], false)}
  >
    <div style={contentStyles}>
      Interactive demo - use the knobs to change the props and see the effect.
      The PageConstraints component provides consistent page-width constraints
      and responsive horizontal padding.
    </div>
  </PageConstraints>
);
