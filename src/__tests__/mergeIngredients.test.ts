import { ParseResult } from '..';
import { mergeIngredients } from '../mergeIngredients';

const parsedResults: Record<string, ParseResult> = {
  '1 cup of oats': {
    original: '1 cup of oats',
    sanitized: '1 cup of oats',
    food: {
      raw: 'oats',
      normalized: 'oat',
      range: [9, 13] as [number, number],
    },
    unit: {
      raw: 'cup',
      normalized: 'cup',
      range: [2, 5] as [number, number],
    },
    quantity: {
      raw: '1',
      normalized: 1,
      range: [0, 1] as [number, number],
    },
    comments: [],
    preparations: [],
  },
  '1/3 tablespoon chopped onion': {
    food: {
      raw: 'onion',
      normalized: 'onion',
      range: [23, 28] as [number, number],
    },
    unit: {
      raw: 'tablespoon',
      normalized: 'tablespoon',
      range: [4, 14] as [number, number],
    },
    quantity: {
      raw: '1/3',
      normalized: 1 / 3.0,
      range: [0, 3] as [number, number],
    },
    comments: [],
    preparations: ['chopped'],
    original: '1/3 tablespoon chopped onion',
    sanitized: '1/3 tablespoon chopped onion',
  },
  '1 egg': {
    quantity: {
      raw: '1',
      normalized: 1,
      range: [0, 1] as [number, number],
    },
    unit: {
      raw: null,
      normalized: null,
      range: [],
    },
    food: {
      raw: 'egg',
      normalized: 'egg',
      range: [2, 5] as [number, number],
    },
    comments: [],
    preparations: [],
    original: '1 egg',
    sanitized: '1 egg',
  },
  '2 eggs': {
    quantity: {
      raw: '2',
      normalized: 2,
      range: [0, 1] as [number, number],
    },
    unit: {
      raw: null,
      normalized: null,
      range: [],
    },
    food: {
      raw: 'eggs',
      normalized: 'egg',
      range: [2, 6] as [number, number],
    },
    comments: [],
    preparations: [],
    original: '2 eggs',
    sanitized: '2 eggs',
  },
  '3 onions': {
    food: {
      raw: 'onions',
      normalized: 'onion',
      range: [2, 8] as [number, number],
    },
    unit: {
      raw: null,
      normalized: null,
      range: [],
    },
    quantity: {
      raw: '3',
      normalized: 3,
      range: [0, 1] as [number, number],
    },
    comments: [],
    preparations: [],
    original: '3 onions',
    sanitized: '3 onions',
  },
  '2c chopped onions': {
    food: {
      raw: 'onions',
      normalized: 'onion',
      range: [11, 17] as [number, number],
    },
    unit: {
      raw: 'c',
      normalized: 'cup',
      range: [1, 2] as [number, number],
    },
    quantity: {
      raw: '2',
      normalized: 2,
      range: [0, 1] as [number, number],
    },
    comments: [],
    preparations: ['chopped'],
    original: '2c chopped onions',
    sanitized: '2c chopped onions',
  },
  '1 can of oats': {
    original: '1 can of oats',
    sanitized: '1 can of oats',
    food: {
      raw: 'oats',
      normalized: 'oat',
      range: [9, 13] as [number, number],
    },
    unit: {
      raw: 'can',
      normalized: 'can',
      range: [2, 5] as [number, number],
    },
    quantity: {
      raw: '1',
      normalized: 1,
      range: [0, 1] as [number, number],
    },
    comments: [],
    preparations: [],
  },
};

describe('mergeIngredients', () => {
  test('passed no common foods returns the parsed list', () => {
    expect(
      mergeIngredients([
        '1 cup of oats',
        '1/3 tablespoon chopped onion',
        '1 egg',
      ])
    ).toEqual([
      {
        id: expect.any(String),
        quantity: {
          value: 1,
          unit: 'cup',
        },
        food: 'oat',
        items: [parsedResults['1 cup of oats']],
      },
      {
        id: expect.any(String),
        quantity: {
          value: 1 / 3.0,
          unit: 'tablespoon',
        },
        food: 'onion',
        items: [parsedResults['1/3 tablespoon chopped onion']],
      },
      {
        id: expect.any(String),
        quantity: {
          value: 1,
          unit: null,
        },
        food: 'egg',
        items: [parsedResults['1 egg']],
      },
    ]);
  });

  test('passed a few common foods with compatible units merges the foods', () => {
    expect(
      mergeIngredients([
        '1 cup of oats',
        '1/3 tablespoon chopped onion',
        '2c chopped onions',
        '2 eggs',
        '1 egg',
      ])
    ).toEqual([
      {
        id: expect.any(String),
        quantity: {
          value: 1,
          unit: 'cup',
        },
        food: 'oat',
        items: [parsedResults['1 cup of oats']],
      },
      {
        id: expect.any(String),
        quantity: {
          value: 1 / 3.0 / 16.0 + 2,
          unit: 'cup',
        },
        food: 'onion',
        items: [
          parsedResults['1/3 tablespoon chopped onion'],
          parsedResults['2c chopped onions'],
        ],
      },
      {
        id: expect.any(String),
        quantity: {
          value: 3,
          unit: null,
        },
        food: 'egg',
        items: [parsedResults['2 eggs'], parsedResults['1 egg']],
      },
    ]);
  });

  test('passed a few common foods without compatible units leaves the foods separate', () => {
    expect(
      mergeIngredients([
        '1 cup of oats',
        '1 can of oats',
        '1/3 tablespoon chopped onion',
        '3 onions',
      ])
    ).toEqual([
      {
        id: expect.any(String),
        quantity: {
          value: 1,
          unit: 'cup',
        },
        food: 'oat',
        items: [parsedResults['1 cup of oats']],
      },
      {
        id: expect.any(String),
        quantity: {
          value: 1,
          unit: 'can',
        },
        food: 'oat',
        items: [parsedResults['1 can of oats']],
      },
      {
        id: expect.any(String),
        quantity: {
          value: 1 / 3.0,
          unit: 'tablespoon',
        },
        food: 'onion',
        items: [parsedResults['1/3 tablespoon chopped onion']],
      },
      {
        id: expect.any(String),
        quantity: {
          value: 3,
          unit: null,
        },
        food: 'onion',
        items: [parsedResults['3 onions']],
      },
    ]);
  });

  test("doesn't merge null foods", () => {
    expect(mergeIngredients(['2', '8', '4'])).toEqual([
      {
        id: expect.any(String),
        quantity: {
          value: 2,
          unit: null,
        },
        food: null,
        items: [
          {
            original: '2',
            sanitized: '2',
            comments: [],
            preparations: [],
            food: {
              raw: null,
              normalized: null,
              range: [],
            },
            unit: {
              raw: null,
              normalized: null,
              range: [],
            },
            quantity: {
              raw: '2',
              normalized: 2,
              range: [0, 1],
            },
          },
        ],
      },
      {
        id: expect.any(String),
        quantity: {
          value: 8,
          unit: null,
        },
        food: null,
        items: [
          {
            original: '8',
            sanitized: '8',
            comments: [],
            preparations: [],
            food: {
              raw: null,
              normalized: null,
              range: [],
            },
            unit: {
              raw: null,
              normalized: null,
              range: [],
            },
            quantity: {
              raw: '8',
              normalized: 8,
              range: [0, 1],
            },
          },
        ],
      },
      {
        id: expect.any(String),
        quantity: {
          value: 4,
          unit: null,
        },
        food: null,
        items: [
          {
            original: '4',
            sanitized: '4',
            comments: [],
            preparations: [],
            food: {
              raw: null,
              normalized: null,
              range: [],
            },
            unit: {
              raw: null,
              normalized: null,
              range: [],
            },
            quantity: {
              raw: '4',
              normalized: 4,
              range: [0, 1],
            },
          },
        ],
      },
    ]);
  });

  test('merges an existing list with new foods - simple', () => {
    expect(
      mergeIngredients(
        ['1 cup of beans'],
        [
          {
            id: 'anything',
            quantity: {
              value: 2,
              unit: 'cup',
            },
            food: 'bean',
            items: [
              {
                original: '2 cups of beans',
                sanitized: '2 cups of beans',
                comments: [],
                preparations: [],
                food: {
                  raw: 'beans',
                  normalized: 'bean',
                  range: [10, 15],
                },
                unit: {
                  raw: 'cups',
                  normalized: 'cup',
                  range: [2, 5],
                },
                quantity: {
                  raw: '2',
                  normalized: 2,
                  range: [0, 1],
                },
              },
            ],
          },
        ]
      )
    ).toEqual([
      {
        id: expect.any(String),
        quantity: {
          value: 3,
          unit: 'cup',
        },
        food: 'bean',
        items: [
          {
            original: '2 cups of beans',
            sanitized: '2 cups of beans',
            comments: [],
            preparations: [],
            food: {
              raw: 'beans',
              normalized: 'bean',
              range: [10, 15],
            },
            unit: {
              raw: 'cups',
              normalized: 'cup',
              range: [2, 5],
            },
            quantity: {
              raw: '2',
              normalized: 2,
              range: [0, 1],
            },
          },
          {
            original: '1 cup of beans',
            sanitized: '1 cup of beans',
            comments: [],
            preparations: [],
            food: {
              raw: 'beans',
              normalized: 'bean',
              range: [9, 14],
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
          },
        ],
      },
    ]);
  });

  test('merges an existing list with new foods - complex', () => {
    expect(
      mergeIngredients(
        ['1 cup of oats', '1/3 tablespoon chopped onion', '2 eggs', '1 egg'],
        [
          {
            id: 'anything',
            quantity: {
              value: 2,
              unit: 'cup',
            },
            food: 'onion',
            items: [parsedResults['2c chopped onions']],
          },
        ]
      )
    ).toEqual([
      {
        id: expect.any(String),
        quantity: {
          value: 1 / 3.0 / 16.0 + 2,
          unit: 'cup',
        },
        food: 'onion',
        items: [
          parsedResults['2c chopped onions'],
          parsedResults['1/3 tablespoon chopped onion'],
        ],
      },
      {
        id: expect.any(String),
        quantity: {
          value: 1,
          unit: 'cup',
        },
        food: 'oat',
        items: [parsedResults['1 cup of oats']],
      },
      {
        id: expect.any(String),
        quantity: {
          value: 3,
          unit: null,
        },
        food: 'egg',
        items: [parsedResults['2 eggs'], parsedResults['1 egg']],
      },
    ]);
  });

  test('merges parsed ingredients into an existing list', () => {
    expect(
      mergeIngredients(
        [
          parsedResults['1 cup of oats'],
          parsedResults['1 egg'],
          parsedResults['1 can of oats'],
        ],
        [
          {
            id: 'one',
            quantity: {
              value: 1 / 3.0 / 16.0 + 2,
              unit: 'cup',
            },
            food: 'onion',
            items: [
              parsedResults['2c chopped onions'],
              parsedResults['1/3 tablespoon chopped onion'],
            ],
          },
          {
            id: 'two',
            quantity: {
              value: 1,
              unit: 'cup',
            },
            food: 'oat',
            items: [parsedResults['1 cup of oats']],
          },
          {
            id: 'three',
            quantity: {
              value: 3,
              unit: null,
            },
            food: 'egg',
            items: [parsedResults['2 eggs'], parsedResults['1 egg']],
          },
        ]
      )
    ).toEqual([
      {
        id: expect.any(String),
        quantity: {
          value: 1 / 3.0 / 16.0 + 2,
          unit: 'cup',
        },
        food: 'onion',
        items: [
          parsedResults['2c chopped onions'],
          parsedResults['1/3 tablespoon chopped onion'],
        ],
      },
      {
        id: expect.any(String),
        quantity: {
          value: 2,
          unit: 'cup',
        },
        food: 'oat',
        items: [parsedResults['1 cup of oats'], parsedResults['1 cup of oats']],
      },
      {
        id: expect.any(String),
        quantity: {
          value: 4,
          unit: null,
        },
        food: 'egg',
        items: [
          parsedResults['2 eggs'],
          parsedResults['1 egg'],
          parsedResults['1 egg'],
        ],
      },
      {
        id: expect.any(String),
        quantity: {
          value: 1,
          unit: 'can',
        },
        food: 'oat',
        items: [parsedResults['1 can of oats']],
      },
    ]);
  });
});
