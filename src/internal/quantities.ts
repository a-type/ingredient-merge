import configureMeasurements, { length, mass, pieces, volume } from 'convert-units';

const convert = configureMeasurements({ volume, mass, pieces, length } as any);

type Unit = Parameters<ReturnType<typeof convert>['from']>[0];

export type Quantity = {
  value: number;
  unit: string | null;
};

export function lookupUnit(unitName: string | null): Unit | null {
  if (!unitName) return null;
  const units = convert().list();
  const match = units.find(function ({ abbr, singular }) {
    return (
      unitName.toLowerCase() === abbr ||
      unitName.toLowerCase() === singular.toLowerCase()
    );
  });
  return (match && match.abbr) || null;
}

export function convertQuantity(qty: Quantity, toUnit: string | null) {
  if (qty.value === 0 || qty.unit === toUnit) {
    return {
      value: qty.value,
      unit: toUnit || qty.unit,
    };
  }

  const baseUnit = lookupUnit(qty.unit);
  const convertUnit = lookupUnit(toUnit);

  if (!baseUnit && !convertUnit) {
    return qty;
  }

  if (!baseUnit || !convertUnit) {
    throw new Error(
      `Quantity is not convertible from ${qty.unit} to ${toUnit}`
    );
  }

  if (
    !convert().from(baseUnit).possibilities().includes(convertUnit) ||
    !convert().from(convertUnit).possibilities().includes(baseUnit)
  ) {
    throw new Error(
      `Quantity is not convertible from ${qty.unit} to ${toUnit}`
    );
  }

  const convertedValue = convert(qty.value).from(baseUnit).to(convertUnit);
  return {
    value: convertedValue,
    unit: convertUnit,
  };
}

export function addQuantities(qty1: Quantity, qty2: Quantity): Quantity {
  if (qty2.value === 0) return qty1;
  if (qty1.value === 0) return qty2;

  const convertedQuantity = convertQuantity(qty1, qty2.unit);
  const reversedConvertedQuantity = convertQuantity(qty2, qty1.unit);

  if (convertedQuantity.value < reversedConvertedQuantity.value) {
    return {
      value: convertedQuantity.value + qty2.value,
      unit: convertedQuantity.unit,
    };
  } else {
    return {
      value: reversedConvertedQuantity.value + qty1.value,
      unit: reversedConvertedQuantity.unit,
    };
  }
}

export function subtractQuantities(qty1: Quantity, qty2: Quantity) {
  return addQuantities(qty1, {
    value: -(qty2.value || 0),
    unit: qty2.unit,
  });
}
