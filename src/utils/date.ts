function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function formatDateToDDMMYYHHmm(date: Date): string {
  const d = new Date(date);
  const day = pad2(d.getDate());
  const month = pad2(d.getMonth() + 1);
  const year = `${d.getFullYear()}`.slice(-2);
  const hours = pad2(d.getHours());
  const minutes = pad2(d.getMinutes());
  return `${day}-${month}-${year} ${hours}:${minutes}`;
}



