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
  if (doc['aimNumbers'].size() == 0) { return ''; }
  def s = doc['aimNumbers'].value;
  if (s == null || s.isEmpty()) { return ''; }
  def parts = s.splitOnToken(',');
  def out = new StringBuilder();
  for (int i = parts.length - 1; i >= 0; i--) {
    if (i < parts.length - 1) out.append('|');
    int n = Integer.parseInt(parts[i]);
    int inv = 999 - n;
    out.append(String.format('%03d', new def[]{ inv }));
  }
  return out.toString();
`;
