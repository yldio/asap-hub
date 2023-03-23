/* istanbul ignore file */

// remember to update link patterns in the squidex schema

export const urlExpression =
  "^(?:http(s)?:\\/\\/)[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:\\/?#%[\\]@!\\$&'\\(\\)\\*\\+,;=.]+$";

export const emailExpression =
  "^[a-zA-Z0-9.!#$%&’*+\\/=?^_`'{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$";

export const telephoneNumberExpression =
  '^\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{3,4}$';
export const telephoneCountryExpression = '^\\+*[1-9]{0,3}$';
