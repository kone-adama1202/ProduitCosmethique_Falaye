export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  // eslint-disable-next-line no-irregular-whitespace
  }).format(price) + ' FCFA';
}
