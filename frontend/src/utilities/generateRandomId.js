export const generateRandomId = () => {
  // Generate a random number between 0 and 999999.
  const num = Math.floor(Math.random() * 1000000);
  // Convert the number to a string and pad with leading zeros if necessary to ensure it's always 6 characters.
  const id = num.toString().padStart(6, "0");
  return id;
};
