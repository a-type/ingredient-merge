declare module 'ingredients-parser' {
  type ParsedIngredient = {
    unit?: string;
    amount?: string;
    ingredient?: string;
  };
  type ParseFunction = {
    (text: string): ParsedIngredient;
  };
  type Parser = {
    parse: ParseFunction;
  };
  const parser: Parser;
  export default parser;
}
