export function timeSince(timestampStr) {
  const timestamp = new Date(timestampStr);
  const now = new Date();
  const timeDiff = Math.abs(now - timestamp);

  // Convert milliseconds to minutes, hours, and days
  const minutes = Math.floor(timeDiff / 60000);
  const hours = Math.floor(timeDiff / 3600000);
  const days = Math.floor(timeDiff / 86400000);

  let humanReadable;

  if (days > 0) {
    humanReadable = `${days} day${days > 1 ? "s" : ""}`;
  } else if (hours > 0) {
    humanReadable = `${hours} hour${hours > 1 ? "s" : ""}`;
  } else if (minutes > 0) {
    humanReadable = `${minutes} min`;
  } else {
    humanReadable = "Just now";
  }

  return humanReadable;
}
