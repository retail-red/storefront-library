// eslint-disable-next-line import/prefer-default-export
export function formatCurrency(locale, currencyCode, value) {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode }).format(value);
  } catch (_) {
    return `${value.toFixed(2)} ${currencyCode.toUpperCase()}`;
  }
}
