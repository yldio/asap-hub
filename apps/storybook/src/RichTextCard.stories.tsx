import { RichTextCard } from '@asap-hub/react-components';

import { text } from './knobs';

export default {
  title: 'Organisms / Rich Text Card',
  component: RichTextCard,
};

export const Normal = () => (
  <RichTextCard
    title={text('Title', 'My RTF Embed')}
    text={text(
      'Rich Text Notes',
      `
      <h1>How to Leverage PPMI?</h1>
<p>PPMI, an ASAP funded resource, can be leveraged for clinical recruitment, biosample and data access, as well as future data deposit (through <a href="https://ida.loni.usc.edu/login.jsp?search=true">LONI</a>). &nbsp;&nbsp;</p>
<p><strong>PPMI - <a href="http://www.ppmi-info.org">www.ppmi-info.org</a></strong></p>
<ul>
<li>PPMI has robust longitudinal data on ~ 1000 individuals (PD+HC)
<ul>
<li><a href="http://www.ppmi-info.org/wp-content/uploads/2018/02/PPMI-AM-13-Protocol_SCHEDULE-OF-ACTIVITIES-1.pdf">Click here</a> to view what else has already been collected</li>
<li>PPMI is now in expansion mode</li>
</ul>
</li>
</ul>
    <h1>Video</h1>
<p><strong><iframe src="https://player.vimeo.com/video/507828845" width="640" height="400" frameborder="0" allowfullscreen="allowfullscreen"></iframe></strong></p>
    `,
    )}
  />
);
