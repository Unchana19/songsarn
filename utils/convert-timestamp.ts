export function convertTimestampToDateTime(timestamp: Date): string {
  const date = new Date(timestamp);
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function convertTimestampToDate(timestamp: Date): string {
  const date = new Date(timestamp);
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

