# ingredient-merge

Merges multiple raw ingredient strings into groups of parsed ingredient data, based on which ingredients call for the same food and have compatible units.

For example, if two ingredients called for Parmesan cheese with one asking for 1 tbsp and another 1 cup, the result would have one item for Parmesan cheese calling for 1.0625 cups.

However, if one of the ingredients called for "5 oz", there would be two groups for Parmesan cheese with one indicating a volume-based value and the other using a weight-based value, since these units cannot be converted to add together without knowing the density of Parmesan cheese.

## How to use it

```ts
import { mergeIngredients } from 'ingredient-merge';

mergeIngredients([
  '1 cup of oats',
  '1/3 tablespoon chopped onion',
  '2c chopped onions',
  '2 eggs',
  '1 egg',
]);

// returns:
/**
  [
    {
      quantity: {
        value: 1,
        unit: 'cup',
      },
      items: [
        {
          original: '1 cup of oats',
          sanitized: '1 cup of oats',
          food: {
            raw: 'oats',
            normalized: 'oat',
            range: [9, 13],
          },
          unit: {
            raw: 'cup',
            normalized: 'cup',
            range: [2, 5],
          },
          quantity: {
            raw: '1',
            normalized: 1,
            range: [0, 1],
          },
          comments: [],
          preparations: [],
        }
      ],
    },
    {
      quantity: {
        value: 0.333333333333333 / 16.0 + 2,
        unit: 'cup',
      },
      items: [
        {
          food: {
            raw: 'onion',
            normalized: 'onion',
            range: [23, 28],
          },
          unit: {
            raw: 'tablespoon',
            normalized: 'tablespoon',
            range: [4, 14],
          },
          quantity: {
            raw: '1/3',
            normalized: 0.333333333333333,
            range: [0, 3],
          },
          comments: [],
          preparations: ['chopped'],
          original: '1/3 tablespoon chopped onion',
          sanitized: '1/3 tablespoon chopped onion',
        },
        {
          food: {
            raw: 'onions',
            normalized: 'onion',
            range: [11, 17],
          },
          unit: {
            raw: 'c',
            normalized: 'cup',
            range: [1, 2],
          },
          quantity: {
            raw: '2',
            normalized: 2,
            range: [0, 1],
          },
          comments: [],
          preparations: ['chopped'],
          original: '2c chopped onions',
          sanitized: '2c chopped onions',
        },
      ],
    },
    {
      quantity: {
        value: 3,
        unit: null,
      },
      items: [
        {
          quantity: {
            raw: '2',
            normalized: 2,
            range: [0, 1],
          },
          unit: {
            raw: null,
            normalized: null,
            range: [],
          },
          food: {
            raw: 'eggs',
            normalized: 'egg',
            range: [2, 6],
          },
          comments: [],
          preparations: [],
          original: '2 eggs',
          sanitized: '2 eggs',
        },
        {
          quantity: {
            raw: '1',
            normalized: 1,
            range: [0, 1],
          },
          unit: {
            raw: null,
            normalized: null,
            range: [],
          },
          food: {
            raw: 'egg',
            normalized: 'egg',
            range: [2, 5],
          },
          comments: [],
          preparations: [],
          original: '1 egg',
          sanitized: '1 egg',
        }
      ],
    },
  ]
 */
```

## Notes about the output

As you can probably tell, the output contains a lot of in-depth information about the individual ingredients. If you're using this library in a context where a user might need to trust the final result - for instance, if you're consolidating a shopping list - it's recommended you surface the original ingredient items in a readable format to the user so they know what went into each grouped quantity. This library isn't perfect - surfacing the data the quantities are derived from helps the user detect mistakes.

If you just want to show the final computed values, though, you can reference the `quantity.value`, `quantity.unit`, and `food` items on each item in the returned list.

Finally, you'll notice this library attempts to be very fault-tolerant. Almost any value in the returned output could be `null`, meaning that it can't find a suitable value for that field. That probably means the parsing of the ingredient itself was not very successful. I'm using heuristics for sanitization before relying on the `ingredients-parser` npm module to identify food, quantity, and unit - then passing the quantity to a Microsoft-made number recognizer. Hopefully the code is fairly simple to read. If you notice that a well-formed ingredient is not parsing correctly, I encourage you to issue a PR with a proposed improvement to the parsing logic!

In the meantime, if you notice key values are `null`, you should be prepared to fall back to showing the original ingredient. It's better to at least show the user what they entered without merging than it is to lose the item entirely or spit out `null`!
