/* istanbul ignore file */

// remember to update link pattern in the research-output.json squidex schema
export const UrlExpression =
  "^(?:http(s)?:\\/\\/)[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:\\/?#%[\\]@!\\$&'\\(\\)\\*\\+,;=.]+$";

// remember to update link pattern in the users.json squidex schema
export const emailExpression =
  "^[a-zA-Z0-9.!#$%&’*+\\/=?^_`'{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$";

// remember to update link pattern in the users.json squidex schema
export const telephoneNumberExpression =
  '^\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{3,4}$';
export const telephoneCountryExpression = '^\\+*[1-9]{0,3}$';
