function stringToSoftColor(string: string): string {
  let hash = 0;
  let i;

  // Generación del hash (similar al original)
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  // --- CONTROL DE LUMINOSIDAD Y SATURACIÓN ---
  
  // 1. Calcular el Tono (Hue)
  // El tono (H) debe ser un valor entre 0 y 360, obtenido del hash.
  const hue = hash % 360; 

  // 2. Establecer Saturación (S) y Luminosidad (L) para colores suaves
  // S: 50% - 70% (Buena saturación pero no excesiva)
  const saturation = 65; 
  // L: 40% - 60% (Brillo moderado, evitando colores muy claros o muy oscuros)
  const lightness = 55;

  // 3. Convertir HSL a HEX
  // Esta función auxiliar se usa para la conversión.
  const hslToHex = (h: number, s: number, l: number): string => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };
  
  // Devuelve el color HEX resultante.
  return hslToHex(hue, saturation, lightness);
}

export function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToSoftColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}