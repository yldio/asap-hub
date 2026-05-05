export const aimNumbersAscSortScript = `
  if (doc['aimNumbers'].size() == 0) { return ''; }
  def s = doc['aimNumbers'].value;
  if (s == null || s.isEmpty()) { return ''; }
  def parts = s.splitOnToken(',');
  def out = new StringBuilder();
  for (int i = 0; i < parts.length; i++) {
    if (i > 0) out.append(',');
    out.append(String.format('%03d', new def[]{ Integer.parseInt(parts[i]) }));
  }
  return out.toString();
`;

export const aimNumbersDescSortScript = `
  if (doc['aimNumbers'].size() == 0) { return '999|999|'; }
  def s = doc['aimNumbers'].value;
  if (s == null || s.isEmpty()) { return '999|999|'; }
  def parts = s.splitOnToken(',');
  int max = 0;
  for (int i = 0; i < parts.length; i++) {
    int n = Integer.parseInt(parts[i]);
    if (n > max) max = n;
  }
  int invMax = 999 - max;
  int count = parts.length;
  def aims = new StringBuilder();
  for (int i = 0; i < parts.length; i++) {
    if (i > 0) aims.append(',');
    aims.append(String.format('%03d', new def[]{ Integer.parseInt(parts[i]) }));
  }
  return String.format('%03d|%03d|%s', new def[]{ invMax, count, aims.toString() });
`;
