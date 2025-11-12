import { PageInfoContainer, TabNav, TabLink } from '@asap-hub/react-components';

export default {
  title: 'Templates / Layout / Page Info Container',
  component: PageInfoContainer,
};

const contentStyles: React.CSSProperties = {
  padding: '16px 0',
};

const sampleNav = (
  <TabNav>
    <TabLink href="/one">Tab One</TabLink>
    <TabLink href="/two">Tab Two</TabLink>
    <TabLink href="/three">Tab Three</TabLink>
  </TabNav>
);

export const Normal = () => (
  <PageInfoContainer>
    <div style={contentStyles}>
      <h1>Page Title</h1>
      <p>
        This is a PageInfoContainer without navigation. It provides a
        paper-colored background with a subtle shadow and consistent padding.
      </p>
    </div>
  </PageInfoContainer>
);

export const WithNavigation = () => (
  <PageInfoContainer nav={sampleNav}>
    <div style={contentStyles}>
      <h1>Page Title</h1>
      <p>
        This PageInfoContainer includes navigation tabs. When navigation is
        present, the bottom padding is removed to let the tabs sit flush against
        the content below.
      </p>
    </div>
  </PageInfoContainer>
);

export const WithRichContent = () => (
  <PageInfoContainer nav={sampleNav}>
    <div style={contentStyles}>
      <h1>Working Group Title</h1>
      <p>
        <strong>Description:</strong> This is a comprehensive example showing
        how PageInfoContainer is typically used in page headers. It can contain
        titles, descriptions, metadata, and navigation tabs.
      </p>
      <p>
        <strong>Members:</strong> 42 active members
      </p>
    </div>
  </PageInfoContainer>
);

export const MinimalHeader = () => (
  <PageInfoContainer>
    <div style={contentStyles}>
      <h1>Simple Page</h1>
    </div>
  </PageInfoContainer>
);

export const WithoutNavigation = () => (
  <PageInfoContainer>
    <div style={contentStyles}>
      <h1>Events Calendar</h1>
      <p>
        Find out about upcoming events from ASAP and Groups. You can easily add
        specific calendars to your own Google Calendar by clicking the subscribe
        button.
      </p>
    </div>
  </PageInfoContainer>
);
