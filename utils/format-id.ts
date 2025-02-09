export const formatId = (prefix: string, id: string): string => {
  const shortId = id.slice(0, 6);

  return `${prefix}-${shortId.toUpperCase()}`;
};
