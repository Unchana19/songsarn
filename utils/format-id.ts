export const formatId = (prefix: string, id: string): string => {
  const shortId = id.slice(0, 8);

  return `${prefix}-${shortId.toUpperCase()}`;
};
