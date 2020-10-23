exports.subject = 'Welcome {{ firstName }}!';

// Go to https://hub.asap.science/.storybook/iframe.html?id=pages-emails--welcome&viewMode=story
// Open console and use `copy([...document.styleSheets].flatMap(s => [...s.cssRules].flatMap(a => a.cssText)).join('\n'));` to copy the styles
exports.styles = `
<style>
  html { 
    font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    font-size: 17px;
    line-height: 1.41176em;
    background-color: rgb(255, 255, 255);
    color: rgb(0, 34, 44);
  }
  #root[hidden],
  #docs-root[hidden] {
    display: none !important;
  }
  html {
    line-height: 1.15;
    text-size-adjust: 100%;
  }
  body {
    margin: 0px;
  }
  main {
    display: block;
  }
  h1 {
    font-size: 2em;
    margin: 0.67em 0px;
  }
  hr {
    box-sizing: content-box;
    height: 0px;
    overflow: visible;
  }
  pre {
    font-family: monospace, monospace;
    font-size: 1em;
  }
  a {
    background-color: transparent;
  }
  abbr[title] {
    border-bottom: none;
    text-decoration: underline dotted;
  }
  b,
  strong {
    font-weight: bolder;
  }
  code,
  kbd,
  samp {
    font-family: monospace, monospace;
    font-size: 1em;
  }
  small {
    font-size: 80%;
  }
  sub,
  sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }
  sub {
    bottom: -0.25em;
  }
  sup {
    top: -0.5em;
  }
  img {
    border-style: none;
  }
  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: inherit;
    font-size: 100%;
    line-height: 1.15;
    margin: 0px;
  }
  button,
  input {
    overflow: visible;
  }
  button,
  select {
    text-transform: none;
  }
  button,
  [type='button'],
  [type='reset'],
  [type='submit'] {
    appearance: button;
  }
  fieldset {
    padding: 0.35em 0.75em 0.625em;
  }
  legend {
    box-sizing: border-box;
    color: inherit;
    display: table;
    max-width: 100%;
    padding: 0px;
    white-space: normal;
  }
  progress {
    vertical-align: baseline;
  }
  textarea {
    overflow: auto;
  }
  [type='checkbox'],
  [type='radio'] {
    box-sizing: border-box;
    padding: 0px;
  }
  [type='number']::-webkit-inner-spin-button,
  [type='number']::-webkit-outer-spin-button {
    height: auto;
  }
  [type='search'] {
    appearance: textfield;
    outline-offset: -2px;
  }
  [type='search']::-webkit-search-decoration {
    appearance: none;
  }
  ::-webkit-file-upload-button {
    appearance: button;
    font: inherit;
  }
  details {
    display: block;
  }
  summary {
    display: list-item;
  }
  template {
    display: none;
  }
  [hidden] {
    display: none;
  }
  html {
    font-family: Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    font-size: 17px;
    line-height: 1.41176em;
    background-color: rgb(255, 255, 255);
    color: rgb(0, 34, 44);
  }
  html,
  body,
  #root {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }
  p {
    letter-spacing: 0.00588235em;
  }
  .css-18lglfx {
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  .css-d0dsfd-css {
    background-image: linear-gradient(
      to right,
      rgb(0, 140, 198),
      rgb(52, 162, 112)
    );
    height: 6px;
  }
  .css-1ns5f5t {
    padding-left: 24px;
  }
  .css-1hu3r73 {
    height: 32px;
    padding-top: 6px;
    margin-top: 24px;
    margin-bottom: 24px;
  }
  .css-fbri2d {
    margin-top: 72px;
    margin-bottom: 72px;
  }
  .css-14wrtma-css {
    margin-top: 12px;
    margin-bottom: 12px;
    font-weight: bold;
    font-size: calc(23.3736px + 0.295035vmin);
    line-height: calc(26.8085px + 0.851064vmin);
  }
  .css-14wrtma-css:empty {
    display: none;
  }
  .css-12sudue-secondaryStyles-css {
    margin-top: 12px;
    margin-bottom: 12px;
    font-size: 1em;
    line-height: 1.41176em;
  }
  .css-12sudue-secondaryStyles-css:empty {
    display: none;
  }
  .css-gwvbiu {
    margin: 0px;
    padding: 12px 12px 12px 16px;
  }
  .css-1onflup-styles-largeStyles-primaryStyles-largeTextOnlyStyles {
    text-decoration: none;
    -webkit-box-flex: 1;
    flex-grow: 1;
    display: inline-flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    white-space: pre;
    max-width: 20.8235em;
    outline: none;
    box-sizing: border-box;
    border-style: solid;
    border-width: 1px;
    border-radius: 4px;
    cursor: pointer;
    line-height: unset;
    font-weight: bold;
    transition: all 200ms ease 0s;
    height: 3.29412em;
    margin-top: 0.941176em;
    margin-bottom: 0.941176em;
    padding: 0.882353em 2.47059em;
    color: rgb(255, 255, 255);
    background-color: rgb(52, 162, 112);
    border-color: rgb(40, 121, 83);
    box-shadow: rgb(40, 121, 83) 0px 2px 4px -2px;
  }
  .css-1onflup-styles-largeStyles-primaryStyles-largeTextOnlyStyles:hover,
  .css-1onflup-styles-largeStyles-primaryStyles-largeTextOnlyStyles:focus {
    text-decoration: none;
  }
  .css-1onflup-styles-largeStyles-primaryStyles-largeTextOnlyStyles:active {
    color: unset;
  }
  .css-1onflup-styles-largeStyles-primaryStyles-largeTextOnlyStyles + button {
    margin-top: 0px;
  }
  .css-1onflup-styles-largeStyles-primaryStyles-largeTextOnlyStyles > svg {
    height: 1.41176em;
  }
  .css-1onflup-styles-largeStyles-primaryStyles-largeTextOnlyStyles
    > svg
    + span {
    margin-left: 0.705882em;
  }
  .css-1onflup-styles-largeStyles-primaryStyles-largeTextOnlyStyles
    > span
    + svg {
    margin-left: 0.705882em;
  }
  .css-1onflup-styles-largeStyles-primaryStyles-largeTextOnlyStyles svg {
    stroke: rgb(255, 255, 255);
  }
  .css-1onflup-styles-largeStyles-primaryStyles-largeTextOnlyStyles:hover,
  .css-1onflup-styles-largeStyles-primaryStyles-largeTextOnlyStyles:focus {
    background-color: rgb(40, 121, 83);
    border-color: rgb(40, 121, 83);
    box-shadow: rgb(77, 100, 107) 0px 2px 4px -2px;
  }
  .css-1onflup-styles-largeStyles-primaryStyles-largeTextOnlyStyles:active {
    background-color: rgb(40, 121, 83);
    border-color: rgb(40, 121, 83);
    box-shadow: none;
  }
  .css-8c7at3-footerContainerStyles {
    background-color: rgb(237, 241, 243);
    padding-top: 12px;
    padding-bottom: 12px;
  }
  .css-12lktuf-footerContentContainerStyles-css {
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    gap: 16px;
  }
  .css-17novhv-light {
    outline: none;
    color: rgb(52, 162, 112);
    text-decoration: underline;
  }
  .css-17novhv-light:hover,
  .css-17novhv-light:focus {
    text-decoration: none;
  }
  .css-17novhv-light:active {
    color: unset;
  }
  .css-17novhv-light:active {
    color: rgb(40, 121, 83);
  }
  @font-face {
    font-weight: 400;
    font-style: normal;
    font-family: Inter-Loom;
    src: url('https://cdn.loom.com/assets/fonts/inter/Inter-UI-Regular.woff2')
      format('woff2');
  }
  @font-face {
    font-weight: 400;
    font-style: italic;
    font-family: Inter-Loom;
    src: url('https://cdn.loom.com/assets/fonts/inter/Inter-UI-Italic.woff2')
      format('woff2');
  }
  @font-face {
    font-weight: 500;
    font-style: normal;
    font-family: Inter-Loom;
    src: url('https://cdn.loom.com/assets/fonts/inter/Inter-UI-Medium.woff2')
      format('woff2');
  }
  @font-face {
    font-weight: 500;
    font-style: italic;
    font-family: Inter-Loom;
    src: url('https://cdn.loom.com/assets/fonts/inter/Inter-UI-MediumItalic.woff2')
      format('woff2');
  }
  @font-face {
    font-weight: 700;
    font-style: normal;
    font-family: Inter-Loom;
    src: url('https://cdn.loom.com/assets/fonts/inter/Inter-UI-Bold.woff2')
      format('woff2');
  }
  @font-face {
    font-weight: 700;
    font-style: italic;
    font-family: Inter-Loom;
    src: url('https://cdn.loom.com/assets/fonts/inter/Inter-UI-BoldItalic.woff2')
      format('woff2');
  }
  @font-face {
    font-weight: 900;
    font-style: normal;
    font-family: Inter-Loom;
    src: url('https://cdn.loom.com/assets/fonts/inter/Inter-UI-Black.woff2')
      format('woff2');
  }
  @font-face {
    font-weight: 900;
    font-style: italic;
    font-family: Inter-Loom;
    src: url('https://cdn.loom.com/assets/fonts/inter/Inter-UI-BlackItalic.woff2')
      format('woff2');
  }
</style>
`;

// Go to https://hub.asap.science/.storybook/iframe.html?id=pages-emails--welcome&viewMode=story
// Open console and use `copy(document.getElementById("root").innerHTML)` to copy the styles
exports.html = `
  <div class="css-18lglfx">
    <div role="presentation" class="css-d0dsfd-css"></div>
    <div class="css-1ns5f5t">
      <img
        alt="ASAP Hub logo"
        src="https://hub.asap.science/static/media/asap.9aad0908.png"
        class="css-1hu3r73"
      />
      <div class="css-fbri2d">
        <h1 class="css-14wrtma-css">Dear {{ firstName }}</h1>
        <p class="css-12sudue-secondaryStyles-css">
          Congratulations on being awarded the ASAP Grant.
        </p>
        <p class="css-12sudue-secondaryStyles-css">
          We're delighted to be able to invite you to join the ASAP Hub!
        </p>
        <p class="css-12sudue-secondaryStyles-css">
          The ASAP Hub is the perfect place to:
        </p>
        <ul class="css-gwvbiu">
          <li>Collaborate with your team</li>
          <li>Expand your wider network</li>
          <li>Gain access to new resources</li>
        </ul>
        <p class="css-12sudue-secondaryStyles-css">
          Join the community and set up your profile.
        </p>
        <a
          href="{{ link }}"
          class="css-1onflup-styles-largeStyles-primaryStyles-largeTextOnlyStyles"
          ><span>Create account</span></a
        >
      </div>
    </div>
  </div>
  <div class="css-8c7at3-footerContainerStyles">
    <ul class="css-12lktuf-footerContentContainerStyles-css">
      <a
        href="https://hub.asap.science/privacy-policy"
        class="css-17novhv-light"
        >Privacy policy</a
      ><a
        href="https://hub.asap.science/terms-and-conditions"
        class="css-17novhv-light"
        >Terms and conditions</a
      >
    </ul>
  </div>
`;
