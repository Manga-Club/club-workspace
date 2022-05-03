export const clearText = (text: string) => text.trim().replaceAll('\n', '');

export const toUniqueString = (text: string) =>
  clearText(text)
    .replaceAll(' ', '_')
    .replaceAll(/[^A-z0-9]/g, '')
    .toLowerCase();
