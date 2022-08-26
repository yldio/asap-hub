import { css } from '@emotion/react';

import { HelpSection } from '../organisms';
import { perRem } from '../pixels';
import { Headline2, Paragraph } from '../atoms';
import { Accordion } from '../molecules';
import {
  giftIcon,
  dashboardIcon,
  budgetIcon,
  reportIcon,
  shareIcon,
  moneyIcon,
  toolsIcon,
} from '../icons';
import policyIcon from '../icons/policy';

const styles = css({
  display: 'flex',
  flexFlow: 'column',
  gap: `${12 / perRem}em`,
  marginBottom: `${57 / perRem}em`,
});

const DiscoverGuides: React.FC = () => (
  <>
    <div css={styles}>
      <div>
        <Headline2 styleAsHeading={3}>Guides</Headline2>
        <Paragraph accent="lead">
          Explore our guides, templates and forms to help you with your daily
          activities.
        </Paragraph>
      </div>
      <Accordion
        items={[
          {
            icon: giftIcon,
            title: 'Grant Welcome Packet',
            description:
              'All you need to know about the Network, the Hub, sharing, meetings, communications, publishing and more.',
            hrefText: 'Open the packet',
            href: 'https://drive.google.com/file/d/1AjFeIHqxSsfS_qVQaSydxK5HeFc-ClQg/view',
          },
          {
            icon: dashboardIcon,
            title: 'Grants Management Portal',
            description:
              'MJFF Grants Management Portal used for tracking administrative components of ASAP grant award.',
            hrefText: 'Explore the portal',
            href: 'https://grants.michaeljfox.org/welcome/asap',
          },
          {
            icon: budgetIcon,
            title: 'Budget Reallocation Request Form',
            description:
              'Form for general budget reallocation or new equipment support requests (when the request exceeds 5% of original budget). Click to download and submit to grants@parkinsonsroadmap.org.',
            hrefText: 'View form',
            href: 'https://drive.google.com/file/d/1O6SfL1gSlmrSgrs3AEbxCoyl-DzdpAtw/view',
          },
          {
            icon: reportIcon,
            title: 'Template Annual Progress and Expense Team Reports',
            description:
              'Templates for Team Progress Reports and Team Annual Expense Report Forms.',
            hrefText: 'View templates',
            href: 'https://drive.google.com/drive/folders/1lV6xtZDIv6ZEicrt0Dc2AnYTywjOj5vr',
          },
          {
            icon: policyIcon,
            title: 'Open Access Policy',
            description:
              'All work published with partial or full support by ASAP must be credited and published according to ASAP’s OA policies. Only grantees that are fully compliant with our OA policy will be considered in requests for follow-on funding requests. Please email openaccess@parkinsonsroadmap.org with any questions.',
            hrefText: 'Read More',
            href: 'https://parkinsonsroadmap.org/open-access-policy/',
          },
          {
            icon: shareIcon,
            title:
              'Sharing your ASAP supported articles on ASAP social media channels',
            description:
              'Want to promote your ASAP funded article through ASAP social channels? Share a blurb about it with our communications team!',
            hrefText: 'View Form',
            href: 'https://docs.google.com/forms/d/e/1FAIpQLSeQn-t_kK0bkXneSPEz83wTgzJjUv7uiC2VP9_Cbae6M5-iRQ/viewform',
          },
          {
            icon: moneyIcon,
            title: 'Coverage of Article Processing Fees',
            description:
              'ASAP through MJFF will pay reasonable article processing charges (APC fees) for open access articles that are ASAP funded and compliant with our policies.',
            hrefText: 'Submit request',
            href: 'https://docs.google.com/forms/d/e/1FAIpQLSfucx2y8MwoeWCOITNuPqX9CcPrGFl2aJXNLEM5U8Jz-HC9FQ/viewform',
          },
          {
            icon: toolsIcon,
            title: 'ASAP Tools Program',
            description:
              'To facilitate sharing of preclinical research tools and enable open science, ASAP is leveraging the Michael J. Fox Foundation Sponsored Tools Program to manage the transfer and distribution of your preclinical tools (such as reagents and models). We will cover the cost of deposition and coordinate deposition on your behalf! To learn how you can use the program, click on the link below.',
            hrefText: 'Read more',
            href: 'https://drive.google.com/file/d/1qJ2nbqFl5AquhgvUwwxxyOL_k_BMaD2X/view',
          },
        ]}
      />
    </div>
    <HelpSection />
  </>
);

export default DiscoverGuides;
