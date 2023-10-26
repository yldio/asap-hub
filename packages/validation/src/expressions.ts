/* istanbul ignore file */


export const urlExpression =
  "^(?:http(s)?:\\/\\/)[\\w.\\-]+(?:\\.[\\w\\.\\-]+)+[\\w\\-\\._~:\\/?#%\\[\\]@!\\$&'\\(\\)\\*\\+,;=.]+$";

export const emailExpression =
  "^[a-zA-Z0-9.!#$%&’*+\\/=?^_`'{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$";

export const telephoneNumberExpression =
  '^\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{3,4}$';
export const telephoneCountryExpression = '^\\+*[1-9]{0,3}$';

export const orcidExpression = '^\\d{4}-\\d{4}-\\d{4}-\\d{3}(\\d|X)$';
