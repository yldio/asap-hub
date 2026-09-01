export const urlExpression =
  "^(?:http(s)?:\\/\\/)[\\w.\\-]+(?:\\.[\\w\\.\\-]+)+[\\w\\-\\._~:\\/?#%\\[\\]@!\\$&'\\(\\)\\*\\+,;=.]+$";

export const emailExpression =
  "^[a-zA-Z0-9.!#$%&’*+\\/=?^_`'{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$";

// The regexp validations on each product's user email fields, mirrored here so a
// form refuses what Contentful would and the user sees the fault on blur rather
// than after a round-trip. The two content models disagree — GP2 allows no
// apostrophe — so neither product can borrow the other's rule.
//
// The lookahead in both is the `Symbol` cap. Without it the domain repetition
// backtracks over a multi-megabyte body and throws RangeError out of the AJV
// validator.
//
// Only CRN's trailing `?` admits '': its modal sends '' for a cleared field,
// while GP2 sends null and lists alternativeEmail in nullableKeys.
export const crnEmailExpression =
  "^(?=[\\s\\S]{0,256}$)(?:\\w[\\w.\\-+']*@([\\w-]+\\.)+[\\w-]+)?$";
export const gp2EmailExpression =
  '^(?=[\\s\\S]{0,256}$)\\w[\\w.\\-+]*@([\\w-]+\\.)+[\\w-]+$';

export const telephoneNumberExpression =
  '^\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{3,4}$';
export const telephoneCountryExpression = '^\\+*[1-9]{0,3}$';

export const orcidExpression = '^\\d{4}-\\d{4}-\\d{4}-\\d{3}(\\d|X)$';

export const amountExpression =
  '^(?:[1-9]\\d*(?:\\.\\d{0,2})?|0\\.(?:0[1-9]|[1-9]\\d?))$';
