export const aimNumbersAscSortScript = `
  if (doc['aimNumbers'].size() == 0) { emit(''); return; }
  def s = doc['aimNumbers'].value;
  if (s == null || s.isEmpty()) { emit(''); return; }
  def parts = s.splitOnToken(',');
  def out = new StringBuilder();
  for (int i = 0; i < parts.length; i++) {
    if (i > 0) out.append(',');
    out.append(String.format('%03d', new def[]{ Integer.parseInt(parts[i]) }));
  }
  emit(out.toString());
`;

export const aimNumbersDescSortScript = `
  if (doc['aimNumbers'].size() == 0) { emit('999|999|'); return; }
  def s = doc['aimNumbers'].value;
  if (s == null || s.isEmpty()) { emit('999|999|'); return; }
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
  emit(String.format('%03d|%03d|%s', new def[]{ invMax, count, aims.toString() }));
`;
