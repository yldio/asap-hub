import { fontStyles } from '../text';

const { fontFamily, fontSize } = fontStyles;

/* istanbul ignore file */

const showPasswordIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 43 24">
    <title>Show</title>
    <text
      x="50%"
      y="50%"
      stroke="none"
      style={{
        fontFamily,
        fontSize,

        dominantBaseline: 'central',
        textAnchor: 'middle',
      }}
    >
      Show
    </text>
  </svg>
);

export default showPasswordIcon;
