export function sanitize(text: string) {
  // remove weird characters
  return text.replace(/[\*&:]/g, '');
}
