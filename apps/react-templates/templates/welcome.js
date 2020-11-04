exports.subject = 'Welcome {{ firstName }} {{ lastName }}!';

// Go to https://hub.asap.science/.storybook/iframe.html?id=pages-emails--welcome&viewMode=story
// Open console and use `copy([...document.styleSheets].flatMap(s => [...s.cssRules].flatMap(a => a.cssText)).join('\n'));` to copy the styles
exports.styles = `
<style>
html { line-height: 1.15; text-size-adjust: 100%; }
body { margin: 0px; }
main { display: block; }
h1 { font-size: 2em; margin: 0.67em 0px; }
hr { box-sizing: content-box; height: 0px; overflow: visible; }
pre { font-family: monospace, monospace; font-size: 1em; }
a { background-color: transparent; }
abbr[title] { border-bottom: none; text-decoration: underline dotted; }
b, strong { font-weight: bolder; }
code, kbd, samp { font-family: monospace, monospace; font-size: 1em; }
small { font-size: 80%; }
sub, sup { font-size: 75%; line-height: 0; position: relative; vertical-align: baseline; }
sub { bottom: -0.25em; }
sup { top: -0.5em; }
img { border-style: none; }
button, input, optgroup, select, textarea { font-family: inherit; font-size: 100%; line-height: 1.15; margin: 0px; }
button, input { overflow: visible; }
button, select { text-transform: none; }
button, [type="button"], [type="reset"], [type="submit"] { appearance: button; }
fieldset { padding: 0.35em 0.75em 0.625em; }
legend { box-sizing: border-box; color: inherit; display: table; max-width: 100%; padding: 0px; white-space: normal; }
progress { vertical-align: baseline; }
textarea { overflow: auto; }
[type="checkbox"], [type="radio"] { box-sizing: border-box; padding: 0px; }
[type="number"]::-webkit-inner-spin-button, [type="number"]::-webkit-outer-spin-button { height: auto; }
[type="search"] { appearance: textfield; outline-offset: -2px; }
[type="search"]::-webkit-search-decoration { appearance: none; }
::-webkit-file-upload-button { appearance: button; font: inherit; }
details { display: block; }
summary { display: list-item; }
template { display: none; }
[hidden] { display: none; }
html { font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif; -webkit-font-smoothing: antialiased; font-size: 17px; line-height: 1.41176em; background-color: rgb(255, 255, 255); color: rgb(0, 34, 44); }
html, body, #root { box-sizing: border-box; width: 100%; height: 100%; }
p { letter-spacing: 0.00588235em; }
.css-171iby2-containerStyles { max-width: 600px; margin-left: auto; margin-right: auto; }
.css-zqf01y-coloredLineStyles-EmailLayout-css { background-image: linear-gradient(to right, rgb(0, 140, 198), rgb(52, 162, 112)); height: 6px; }
.css-1u400-EmailLayout { padding-left: 24px; }
.css-1nvcooh-imageContainerStyle { height: 32px; padding-top: 6px; margin-top: 24px; margin-bottom: 24px; }
.css-4t1wsg-contentContainerStyles { margin-top: 72px; margin-bottom: 72px; }
.css-110s1rt-Display-css { margin-top: 12px; margin-bottom: 12px; font-weight: bold; font-size: calc(23.3736px + 0.295035vmin); line-height: calc(26.8085px + 0.851064vmin); }
.css-110s1rt-Display-css:empty { display: none; }
.css-18rh3oz-secondaryStyles-secondaryStyles-Paragraph-css { margin-top: 12px; margin-bottom: 12px; font-size: 1em; line-height: 1.41176em; }
.css-18rh3oz-secondaryStyles-secondaryStyles-Paragraph-css:empty { display: none; }
.css-bh4t7b-Welcome { font-weight: bold; }
.css-989pl-styles-styles-styles-largeStyles-largeStyles-primaryStyles-primaryStyles-largeTextOnlyStyles-largeTextOnlyStyles { text-decoration: none; -webkit-box-flex: 1; flex-grow: 1; display: inline-flex; -webkit-box-pack: center; justify-content: center; -webkit-box-align: center; align-items: center; white-space: pre; max-width: 20.8235em; outline: none; box-sizing: border-box; border-style: solid; border-width: 1px; border-radius: 4px; cursor: pointer; line-height: unset; font-weight: bold; transition: all 200ms ease 0s; height: 3.29412em; margin-top: 0.941176em; margin-bottom: 0.941176em; padding: 0.882353em 2.47059em; color: rgb(255, 255, 255); background-color: rgb(52, 162, 112); border-color: rgb(40, 121, 83); box-shadow: rgb(40, 121, 83) 0px 2px 4px -2px; }
.css-989pl-styles-styles-styles-largeStyles-largeStyles-primaryStyles-primaryStyles-largeTextOnlyStyles-largeTextOnlyStyles:hover, .css-989pl-styles-styles-styles-largeStyles-largeStyles-primaryStyles-primaryStyles-largeTextOnlyStyles-largeTextOnlyStyles:focus { text-decoration: none; }
.css-989pl-styles-styles-styles-largeStyles-largeStyles-primaryStyles-primaryStyles-largeTextOnlyStyles-largeTextOnlyStyles:active { color: unset; }
.css-989pl-styles-styles-styles-largeStyles-largeStyles-primaryStyles-primaryStyles-largeTextOnlyStyles-largeTextOnlyStyles + button { margin-top: 0px; }
.css-989pl-styles-styles-styles-largeStyles-largeStyles-primaryStyles-primaryStyles-largeTextOnlyStyles-largeTextOnlyStyles > svg { height: 1.41176em; }
.css-989pl-styles-styles-styles-largeStyles-largeStyles-primaryStyles-primaryStyles-largeTextOnlyStyles-largeTextOnlyStyles > svg + span { margin-left: 0.705882em; }
.css-989pl-styles-styles-styles-largeStyles-largeStyles-primaryStyles-primaryStyles-largeTextOnlyStyles-largeTextOnlyStyles > span + svg { margin-left: 0.705882em; }
.css-989pl-styles-styles-styles-largeStyles-largeStyles-primaryStyles-primaryStyles-largeTextOnlyStyles-largeTextOnlyStyles svg { stroke: rgb(255, 255, 255); }
.css-989pl-styles-styles-styles-largeStyles-largeStyles-primaryStyles-primaryStyles-largeTextOnlyStyles-largeTextOnlyStyles:hover, .css-989pl-styles-styles-styles-largeStyles-largeStyles-primaryStyles-primaryStyles-largeTextOnlyStyles-largeTextOnlyStyles:focus { background-color: rgb(40, 121, 83); border-color: rgb(40, 121, 83); box-shadow: rgb(77, 100, 107) 0px 2px 4px -2px; }
.css-989pl-styles-styles-styles-largeStyles-largeStyles-primaryStyles-primaryStyles-largeTextOnlyStyles-largeTextOnlyStyles:active { background-color: rgb(40, 121, 83); border-color: rgb(40, 121, 83); box-shadow: none; }
.css-mq5qqe-footerContainerStyles-footerContainerStyles { background-color: rgb(237, 241, 243); padding-top: 12px; padding-bottom: 12px; }
.css-7azkan-containerStyles-footerContentContainerStyles-footerContentContainerStyles-EmailLayout-css { max-width: 600px; margin-left: auto; margin-right: auto; display: flex; gap: 16px; }
.css-oq0odr-styles-light-light-underlineStyles { outline: none; color: rgb(52, 162, 112); text-decoration: underline; }
.css-oq0odr-styles-light-light-underlineStyles:hover, .css-oq0odr-styles-light-light-underlineStyles:focus { text-decoration: none; }
.css-oq0odr-styles-light-light-underlineStyles:active { color: unset; }
.css-oq0odr-styles-light-light-underlineStyles:active { color: rgb(40, 121, 83); }
@font-face { font-weight: 400; font-style: normal; font-family: Inter-Loom; src: url("https://cdn.loom.com/assets/fonts/inter/Inter-UI-Regular.woff2") format("woff2"); }
@font-face { font-weight: 400; font-style: italic; font-family: Inter-Loom; src: url("https://cdn.loom.com/assets/fonts/inter/Inter-UI-Italic.woff2") format("woff2"); }
@font-face { font-weight: 500; font-style: normal; font-family: Inter-Loom; src: url("https://cdn.loom.com/assets/fonts/inter/Inter-UI-Medium.woff2") format("woff2"); }
@font-face { font-weight: 500; font-style: italic; font-family: Inter-Loom; src: url("https://cdn.loom.com/assets/fonts/inter/Inter-UI-MediumItalic.woff2") format("woff2"); }
@font-face { font-weight: 700; font-style: normal; font-family: Inter-Loom; src: url("https://cdn.loom.com/assets/fonts/inter/Inter-UI-Bold.woff2") format("woff2"); }
@font-face { font-weight: 700; font-style: italic; font-family: Inter-Loom; src: url("https://cdn.loom.com/assets/fonts/inter/Inter-UI-BoldItalic.woff2") format("woff2"); }
@font-face { font-weight: 900; font-style: normal; font-family: Inter-Loom; src: url("https://cdn.loom.com/assets/fonts/inter/Inter-UI-Black.woff2") format("woff2"); }
@font-face { font-weight: 900; font-style: italic; font-family: Inter-Loom; src: url("https://cdn.loom.com/assets/fonts/inter/Inter-UI-BlackItalic.woff2") format("woff2"); }
</style>
`;

// Go to https://hub.asap.science/.storybook/iframe.html?id=pages-emails--welcome&viewMode=story
// Open console and use `copy(document.getElementById("root").innerHTML)` to copy the html
exports.html = `
  <div class="css-171iby2-containerStyles"><div role="presentation" class="css-zqf01y-coloredLineStyles-EmailLayout-css"></div><div class="css-1u400-EmailLayout"><img alt="ASAP Hub logo" src="https://hub.asap.science/.storybook/static/media/asap.11229c9a.png" class="css-1nvcooh-imageContainerStyle"><div class="css-4t1wsg-contentContainerStyles"><h1 class="css-110s1rt-Display-css">Dear {{ firstName}} {{ lastName }}</h1><p class="css-18rh3oz-secondaryStyles-secondaryStyles-Paragraph-css">You are part of a team who has been awarded a grant by ASAP.</p><p class="css-18rh3oz-secondaryStyles-secondaryStyles-Paragraph-css">As part of the ASAP grant, you are required to <span class="css-bh4t7b-Welcome">activate your account</span> on the ASAP Hub, where we have created a profile on your behalf.</p><p class="css-18rh3oz-secondaryStyles-secondaryStyles-Paragraph-css">The ASAP Hub is the platform where all ASAP grantees share information and collaborate. You can access grantee and team profiles, all project proposals, and read the latest news and events from ASAP.</p><p class="css-18rh3oz-secondaryStyles-secondaryStyles-Paragraph-css">Activate your account to view your profile. This is your personal link and cannot be shared.</p><a href="{{ link }}" target="_blank" rel="noreferrer noopener" class="css-989pl-styles-styles-styles-largeStyles-largeStyles-primaryStyles-primaryStyles-largeTextOnlyStyles-largeTextOnlyStyles"><span>Activate account</span></a><p class="css-18rh3oz-secondaryStyles-secondaryStyles-Paragraph-css"><span class="css-bh4t7b-Welcome">Note:</span> Please be mindful that the ASAP Hub is a closed platform developed for ASAP grantees only. The closed nature of the Hub is meant to foster trust, candor, and connection. As a reminder, your commitment to confidentiality has been codified in the ASAP grant agreement to which your team has agreed.</p></div></div></div><div class="css-mq5qqe-footerContainerStyles-footerContainerStyles"><ul class="css-7azkan-containerStyles-footerContentContainerStyles-footerContentContainerStyles-EmailLayout-css"><a href="https://hub.asap.science/privacy-policy" target="_blank" rel="noreferrer noopener" class="css-oq0odr-styles-light-light-underlineStyles">Privacy policy</a><a href="https://hub.asap.science/terms-and-conditions" target="_blank" rel="noreferrer noopener" class="css-oq0odr-styles-light-light-underlineStyles">Terms and conditions</a></ul></div>
`;
