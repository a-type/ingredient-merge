declare module 'parse-fraction' {
  type FractionParser = {
    (text: string): [number, number];
  }
  const parseFraction: FractionParser;
  export default parseFraction;
}
