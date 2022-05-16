export const clearText = (text: string) => text.trim().replace(/\n/g, '');

export const toUniqueString = (text: string) =>
  clearText(text)
    .replace(/ /g, '_')
    .replace(/[^A-z0-9]/g, '')
    .toLowerCase();
