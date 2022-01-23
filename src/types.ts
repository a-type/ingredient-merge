/**
 * A pairing of unit and value.
 */
export type Quantity = {
  value: number;
  unit: string | null;
};

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
