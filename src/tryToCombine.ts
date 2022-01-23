import { Quantity } from '.';
import { addQuantities } from './internal/quantities';
import { MergedGroup, ParseResult } from './types';

/**
 * Attempts to combine a parsed ingredient's quantity into a merged group. An ingredient can be combined
 * with a group quantity if the foods are the same and the units are compatible.
 *
 * @param group - the group to merge into
 * @param newIngredient - a parsed ingredient object to attempt to combine with the group quantity
 *
 * @returns {Quantity | null} the combined quantity if the ingredients can be merged, or null if they cannot
 */
export function tryToCombine(
  group: MergedGroup,
  newIngredient: ParseResult
): Quantity | null {
  if (group.food !== newIngredient.food.normalized) {
    return null;
  }

  try {
    const added = addQuantities(group.quantity, {
      value: newIngredient.quantity.normalized || 1,
      unit: newIngredient.unit.normalized,
    });

    return added;
  } catch (err) {
    return null;
  }
}
