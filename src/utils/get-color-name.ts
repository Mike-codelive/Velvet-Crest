export function getColorName(hex: string): string {
  if (!hex) return 'Unknown';

  const normalizedHex = hex.startsWith('#')
    ? hex.toUpperCase()
    : `#${hex.toUpperCase()}`;

  const hexToNameMap: Record<string, string> = {
    '#000': 'Black',
    '#000000': 'Black',
    '#FFFFFF': 'White',
    '#FF0000': 'Red',
    '#00FF00': 'Lime',
    '#0000FF': 'Blue',
    '#FFB900': 'Yellow',
    '#FFA500': 'Orange',
    '#800080': 'Purple',
    '#808080': 'Gray',
    '#A52A2A': 'Brown',
    '#FFC0CB': 'Pink',
    '#00FFFF': 'Cyan',
    '#008000': 'Green',
    '#FFD700': 'Gold',
    '#F5F5DC': 'Beige',
  };

  return hexToNameMap[normalizedHex] || 'Custom Color';
}
