/**
 * Sanitiza un valor de texto eliminando etiquetas HTML.
 * @param {*} value - Valor a sanitizar
 * @returns {string} Texto limpio sin etiquetas HTML
 */
export function sanitizeText(value) {
  return String(value)
    .replace(/<[^>]*>/g, "")
    .trim();
}
