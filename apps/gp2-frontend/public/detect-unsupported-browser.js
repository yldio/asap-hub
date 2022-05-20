
  if (!/((CPU[ +]OS|iPhone[ +]OS|CPU[ +]iPhone|CPU IPhone OS)[ +]+(13|(1[4-9]|[2-9]\d|\d{3,})|14|(1[5-9]|[2-9]\d|\d{3,})|15|(1[6-9]|[2-9]\d|\d{3,}))[_.]\d+(?:[_.]\d+)?)|((?:Chrome).*OPR\/(82|(8[3-9]|9\d|\d{3,}))\.\d+\.\d+)|(SamsungBrowser\/(16|(1[7-9]|[2-9]\d|\d{3,}))\.\d+)|(Edge\/(97|(9[8-9]|\d{3,}))(?:\.\d+)?)|((Chromium|Chrome)\/(79|([8-9]\d|\d{3,})|93|(9[4-9]|\d{3,})|96|(9[7-9]|\d{3,}))\.\d+(?:\.\d+)?)|(Version\/(13|(1[4-9]|[2-9]\d|\d{3,})|14|(1[5-9]|[2-9]\d|\d{3,})|15|(1[6-9]|[2-9]\d|\d{3,}))\.\d+(?:\.\d+)? Safari\/)|(Firefox\/(96|(9[7-9]|\d{3,}))\.\d+\.\d+)|(Firefox\/(96|(9[7-9]|\d{3,}))\.\d+(pre|[ab]\d+[a-z]*)?)/.test(navigator.userAgent)) {
    var messageAlreadyShownKey = 'unsupported-browser-page-shown';
    if (!window.sessionStorage || window.sessionStorage.getItem(messageAlreadyShownKey)) {
      window.open('/unsupported-browser.html', 'Unsupported Browser');
    } else {
      if (window.sessionStorage) {
        window.sessionStorage.setItem(messageAlreadyShownKey, true);
      }
      window.location.assign('/unsupported-browser.html');
    }
  }
