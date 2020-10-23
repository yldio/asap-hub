const path = require('path');
const juice = require('juice');
const { titleCase } = require('title-case');

const htmlTemplate = (
  title,
  html,
  styles,
) => `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="https://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->
    <title>${title}</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0 ">
    <meta name="format-detection" content="telephone=no">
    <style>
      html {
        font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial,
          sans-serif;
        -webkit-font-smoothing: antialiased;
        font-size: 17px;
        line-height: 1.41176em;
        background-color: rgb(255, 255, 255);
        color: rgb(0, 34, 44);
      }
      body {
        margin: 0;
      }
    </style>
    ${styles}
</head>
<body>
  <div id="root">
    ${html}
  </div>
</body>
</html>`;

module.exports = (filepath) => {
  const { subject, html, styles } = require(filepath);

  const { name } = path.parse(filepath);
  const content = juice(htmlTemplate(subject, html, styles));

  return {
    HtmlPart: content,
    SubjectPart: subject,
    TemplateName: titleCase(name),
    TextPart: '',
  };
};
