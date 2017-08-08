export const tagToString = (tag: string, titleCase?: boolean): string => {
  let tagParts = tag.split('-');

  if (titleCase) {
  }

  return tagParts.join(' ');
};
