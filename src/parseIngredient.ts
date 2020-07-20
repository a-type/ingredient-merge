import { replaceUnicodeFractions } from './internal/unicodeFractions';
import { sanitize } from './internal/sanitize';
import { removePreparations } from './internal/removePreparations';
import { removeComments } from './internal/removeComments';
import parser from 'ingredients-parser';
import { unabbreviate } from './internal/unabbreviate';
import { depluralize } from './internal/depluralize';
import { lowercase } from './internal/lowercase';
import { getNumber } from './internal/getNumber';
import { getRange } from './internal/getRange';

/**
 * A parsed value from a raw ingredient string - includes
 * details about the original text occurrence and the final processed
 * value
 */
export type ParsedEntity<T> = {
  /** how this piece of the ingredient appears in the original text */
  raw: string | null;
  /** how the parser interpreted this piece of the ingredient */
  normalized: T | null;
  /**
   * where in the original text this piece of the ingredient's raw value
   * can be found
   */
  range: [number, number] | [];
};

/**
 * A fully parsed ingredient string, including various bits of data you might
 * find in any ingredient
 */
export type ParseResult = {
  /** the original text before parsing */
  original: string;
  /** the text with a slight bit of sanitization, including removing strange characters */
  sanitized: string;
  /** the food name detected in the ingredient */
  food: ParsedEntity<string>;
  /** the unit detected in the ingredient */
  unit: ParsedEntity<string>;
  /** the quantity detected in the ingredient */
  quantity: ParsedEntity<number>;
  /**
   * a list of preparation statements found in the ingredient - like
   * "chopped" or "diced"
   */
  preparations: string[];
  /**
   * a list of author comments found in the ingredient - like brand recommendations,
   * personal notes, or anything in parenthesis at the end
   */
  comments: string[];
};

/**
 * Parses a raw ingredient string into detailed data
 *
 * @example
 * ```
 * const parseResult = parseIngredient(
 *  '½ cup grated Parmesan cheese (plus additional for serving)'
 * );
 * ```
 */
export function parseIngredient(text: string): ParseResult {
  const sanitized = replaceUnicodeFractions(sanitize(text));
  const { text: withoutPreparations, preparations } = removePreparations(
    sanitized
  );
  const { text: withoutComments, comments } = removeComments(
    withoutPreparations
  );
  const parsed = parser.parse(withoutComments);
  const unitRaw = (parsed.unit || '').trim();
  const unitNormalized = unabbreviate(depluralize(lowercase(unitRaw)));
  const quantityRaw = (parsed.amount || '').trim();
  const quantityNormalized = getNumber(quantityRaw);
  const foodRaw = (parsed.ingredient || '').trim();
  const foodNormalized = depluralize(lowercase(foodRaw));

  return {
    original: text,
    sanitized,
    food: {
      raw: foodRaw || null,
      normalized: foodNormalized || null,
      range: getRange(sanitized, foodRaw),
    },
    unit: {
      raw: unitRaw || null,
      normalized: unitNormalized || null,
      range: getRange(sanitized, unitRaw),
    },
    quantity: {
      raw: quantityRaw || null,
      normalized: quantityNormalized ?? null,
      range: getRange(sanitized, quantityRaw),
    },
    preparations,
    comments,
  };
}
