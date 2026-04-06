export function formatRelativeDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function makeId() {
  return Math.random().toString(36).slice(2, 10);
}
