import { parseIngredient, ParseResult } from './parseIngredient';
import { addQuantities, Quantity } from './internal/quantities';
import shortid from 'shortid';

export type MergedGroup = {
  /**
   * A randomly generated ID to identify a group. If you need each group
   * to have a stable and unique ID, this is it - even if the library
   * fails to properly merge foods, at least the groups will have different
   * IDs.
   */
  id: string;
  /**
   * The total quantity of the ingredients in this group, based on a common
   * compatible unit
   */
  quantity: Quantity;
  /**
   * The normalized food name. In some cases, this can be null - that means
   * no food was detected for this ingredient.
   */
  food: string | null;
  /**
   * The individual ingredients which contributed to this group
   */
  items: ParseResult[];
};

/**
 * Merges multiple raw ingredient strings into groups of parsed ingredient
 * data, based on which ingredients call for the same food and have compatible
 * units. For example, if two ingredients called for Parmesan cheese with one
 * asking for 1 tbsp and another 1 cup, the result would have one item for Parmesan
 * cheese calling for 1.0625 cups. However, if one of the ingredients called for
 * "5 oz", there would be two groups for Parmesan cheese with one indicating
 * a volume-based value and the other using a weight-based value, since these
 * units cannot be converted to add together without knowing the density of
 * Parmesan cheese.
 *
 * @param rawIngredients - ingredient strings to merge
 * @param existingGroups - (optional) a previous merged list to add to
 *
 * @example
 * ```
 * const merged = mergeIngredients([
 *   '½ cup grated Parmesan cheese (plus additional for serving)',
 *   '1 pound skinless, boneless chicken thighs, quartered',
 *   '2 cans of olives',
 * ]);
 * ```
 */
export function mergeIngredients(
  rawIngredients: string[],
  existingGroups: MergedGroup[] = []
) {
  const parsedIngredients = rawIngredients.map(parseIngredient);
  const byFood = parsedIngredients.reduce(function (map, ingredient) {
    const existing = map.get(ingredient.food.normalized) ?? [];
    existing.push(ingredient);
    map.set(ingredient.food.normalized, existing);
    return map;
  }, new Map<string | null, ParseResult[]>());

  let finalMerged: MergedGroup[] = [...existingGroups];
  byFood.forEach(function (ingredientList, food) {
    // edge case - don't try to merge ingredients if no food was detected!
    if (!food) {
      finalMerged = finalMerged.concat(
        ingredientList.map(function (ingredient) {
          return {
            id: shortid(),
            quantity: {
              value: ingredient.quantity.normalized || 1,
              unit: ingredient.unit.normalized,
            },
            food: ingredient.food.normalized,
            items: [ingredient],
          };
        })
      );
    } else {
      // merge multiple ingredients - or not
      /** @warning - mutation below! */
      ingredientList.forEach(function (ingredient) {
        // iterate over existing merged items - if there are multiple items in the
        // merged list, that means they are mutually incompatible units, but the
        // current item might be compatible with any of them
        for (const mergedItem of finalMerged) {
          if (mergedItem.food === ingredient.food.normalized) {
            try {
              const added = addQuantities(mergedItem.quantity, {
                value: ingredient.quantity.normalized || 1,
                unit: ingredient.unit.normalized,
              });
              mergedItem.quantity = added;
              mergedItem.items.push(ingredient);

              /** @warning - existing loop prematurely! */
              return;
            } catch (err) {
              // looks like the units weren't compatible
            }
          }
        }

        // if we made it through every existing item in the group without
        // finding a compatible match, just add it on the end.
        finalMerged.push({
          id: shortid(),
          quantity: {
            value: ingredient.quantity.normalized || 1,
            unit: ingredient.unit.normalized,
          },
          food,
          items: [ingredient],
        });
      });
    }
  });

  return finalMerged;
}
