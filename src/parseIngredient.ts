import parser from 'ingredients-parser';

import { depluralize } from './internal/depluralize';
import { getNumber } from './internal/getNumber';
import { getRange } from './internal/getRange';
import { lowercase } from './internal/lowercase';
import { removeComments } from './internal/removeComments';
import { removePreparations } from './internal/removePreparations';
import { sanitize } from './internal/sanitize';
import { unabbreviate } from './internal/unabbreviate';
import { replaceUnicodeFractions } from './internal/unicodeFractions';
import { ParseResult } from './types';

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
