export function formatDuration(milliseconds: number, shortForm?: boolean): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    if (shortForm) return `${days}d`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }

  if (hours > 0) {
    if (shortForm) return `${hours}h`;
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }

  if (minutes > 0) {
    if (shortForm) return `${minutes}m`;
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }

  if (shortForm) return `1m`;
  return 'less than a minute ago';
}

export function shortenString(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length - 3) + '...';
}