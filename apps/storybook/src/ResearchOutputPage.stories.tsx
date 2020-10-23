import React from 'react';
import { text } from '@storybook/addon-knobs';
import { ResearchOutputPage } from '@asap-hub/react-components';

import { LayoutDecorator } from './decorators';

export default {
  title: 'Pages / Research Output Page',
  decorators: [LayoutDecorator],
};

export const Normal = () => (
  <ResearchOutputPage
    created={'2020-09-24T17:01:05.599Z'}
    type="Proposal"
    title={text(
      'title',
      'Molecular actions of PD-associated pathological proteins using in vitro human pluripotent stem cell-derived brains',
    )}
    text={text(
      'text',
      `
<h1>Summary</h1>
<p> Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.</p>
<p>Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution. User generated content in real-time will have multiple touchpoints for offshoring.</p>
<p>Capitalize on low hanging fruit to identify a ballpark value added activity to beta test. Override the digital divide with additional clickthroughs from DevOps. Nanotechnology immersion along the information highway will close the loop on focusing solely on the bottom line.</p>
<h1>Rationale and Preliminary Data</h1>
<h3>Leverage agile frameworks to provide a robust synopsis for high level overviews.</h3>
<p>Override the digital divide with additional clickthroughs from DevOps. Nanotechnology immersion along the information highway will close the loop on focusing solely on the bottom line.</p>
<h3>Capitalize on low hanging fruit to identify a ballpark value added activity to beta test. </h3>
<p>Override the digital divide with additional clickthroughs from DevOps. Nanotechnology immersion along the information highway will close the loop on focusing solely on the bottom line. Podcasting operational change management inside of workflows to establish a framework. Taking seamless key performance indicators offline to maximise the long tail. Keeping your eye on the ball while performing a deep dive on the start-up mentality to derive convergence on cross-platform integration.</p>
<p>Podcasting operational change management inside of workflows to establish a framework. Taking seamless key performance indicators offline to maximise the long tail. Keeping your eye on the ball while performing a deep dive on the start-up mentality to derive convergence on cross-platform integration.</p>
<h1>Research Tools, Models and Resources</h1>
<p>Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution. User generated content in real-time will have multiple touchpoints for offshoring.</p>

<h1>Study Plan</h1>
<p>Efficiently unleash cross-media information without cross-media value. Quickly maximize timely deliverables for real-time schemas. Dramatically maintain clicks-and-mortar solutions without functional solutions.</p>
<p>Completely synergize resource taxing relationships via premier niche markets. Professionally cultivate one-to-one customer service with robust ideas. Dynamically innovate resource-leveling customer service for state of the art customer service.</p>
        `,
    )}
    team={{
      id: '1',
      displayName: text('Team Name', 'asdf'),
      href: '#',
    }}
    profileHref="#"
    libraryHref="#"
  />
);
