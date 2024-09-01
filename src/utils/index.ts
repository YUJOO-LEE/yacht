export const isNumber = (list: (number | undefined)[]): boolean => {
  return list.every((item) => typeof item === 'number');
};