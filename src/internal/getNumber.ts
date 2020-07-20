import Recognizer from '@microsoft/recognizers-text-number';

export function getNumber(numberText: string): number | null {
  const recognized = Recognizer.recognizeNumber(
    numberText,
    Recognizer.Culture.English
  );

  if (!recognized.length) {
    return null;
  }

  return parseFloat(recognized[0].resolution.value);
}
