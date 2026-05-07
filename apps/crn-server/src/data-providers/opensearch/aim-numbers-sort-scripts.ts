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
  int max = 0;
  for (int i = 0; i < parts.length; i++) {
    int n = Integer.parseInt(parts[i]);
    if (n > max) max = n;
  }
  def out = new StringBuilder();
  out.append(String.format('%03d', new def[]{ 999 - max }));
  if (parts.length == 1) {
    out.append('|0');
    return out.toString();
  }
  out.append('|1|');
  out.append(String.format('%03d', new def[]{ 999 - parts.length }));
  for (int i = parts.length - 1; i >= 0; i--) {
    out.append('|');
    int n = Integer.parseInt(parts[i]);
    out.append(String.format('%03d', new def[]{ 999 - n }));
  }
  return out.toString();
`;
