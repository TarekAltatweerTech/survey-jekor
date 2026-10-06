const DIGITS = {
  '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
  '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4', '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
};

const arabicNumber = new Intl.NumberFormat('ar-IQ');

/**
 * Arabic-Indic digits typed in the phone field are turned into Latin ones on the
 * fly: inside an LTR field, "٠٧٧٠ ١٢٣ ٤٥٦٧" would show its groups in reverse order.
 */
export const toLatinDigits = (value) => String(value ?? '').replace(/[٠-٩۰-۹]/g, (d) => DIGITS[d]);

/** 3 -> "٣" */
export const num = (value) => arabicNumber.format(value);

/**
 * Same rules as SurveyService::normalizePhone(): Arabic digits, spaces and
 * +964 / 00964 / 964 prefixes are accepted, the result is 07XXXXXXXXX.
 */
export function normalizePhone(value) {
  let digits = toLatinDigits(value).replace(/\D+/g, '');

  if (digits.startsWith('00964')) digits = digits.slice(5);
  else if (digits.startsWith('964')) digits = digits.slice(3);

  if (digits.length === 10 && digits[0] === '7') digits = `0${digits}`;

  return digits;
}

export const isValidPhone = (value) => /^07\d{9}$/.test(normalizePhone(value));

export const RATING_LABELS = ['', 'سيئ', 'مقبول', 'جيد', 'جيد جداً', 'ممتاز'];
