import { nanoid } from 'nanoid';

/**
 * Genera un código único para un nodo de cableado estructurado
 * Formato: NODO-SITIO-YYYYMMDDHHMMSS-RANDOM
 */
export function generateNodoCode(sitio: string): string {
  const timestamp = new Date().toISOString().replace(/[:-]/g, '').slice(0, 15);
  const random = nanoid(6).toUpperCase();
  return `NODO-${sitio}-${timestamp}-${random}`;
}

/**
 * Genera un código EPC (Electronic Product Code) para etiquetas RFID
 * El EPC es el estándar para identificadores RFID
 */
export function generateEPC(nodoCode: string): string {
  // Convierte el código a hexadecimal para almacenamiento en RFID
  const hex = Buffer.from(nodoCode).toString('hex');
  // Limita a 96 bits (24 caracteres hex) que es el máximo estándar para EPC
  return hex.slice(0, 24).padEnd(24, '0');
}

/**
 * Valida si un código RFID es válido
 */
export function validateRfidCode(code: string): boolean {
  // Validar que sea hexadecimal y tenga longitud correcta
  return /^[0-9A-Fa-f]{24}$/.test(code);
}

/**
 * Decodifica un código EPC de vuelta al código del nodo
 */
export function decodeEPC(epc: string): string {
  try {
    return Buffer.from(epc, 'hex').toString('utf-8');
  } catch (error) {
    return '';
  }
}
