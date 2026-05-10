export const COLORS = {
  // Fondos
  background: '#EEF3FA',   // Cloudy sky – el "aire" de la app
  surface: '#FFFFFF',      // Tarjetas blancas flotantes
  surfaceElevated: '#F7FAFF', // Elementos encima de las tarjetas

  // Marca
  primary: '#3B82F6',      // Blue 500 – acción principal, running
  primaryLight: '#EFF6FF', // Tint del primary para fondos de iconos
  primaryDark: '#1D4ED8',  // Blue 700 – gradiente

  // Acciones de estado
  accent: '#06B6D4',       // Cyan 500 – estado "paused"
  danger: '#D946EF',       // Magenta – STOP / destructivo (tu toque personal)
  dangerLight: '#FDF4FF',  // Tint del danger

  success: '#10B981',      // Emerald – guardado con éxito

  // Texto
  text: '#0F172A',         // Slate 900 – texto principal
  textSecondary: '#64748B',// Slate 500 – texto secundario
  textTertiary: '#94A3B8', // Slate 400 – placeholders, hints

  // Bordes y divisores
  border: '#E2E8F0',       // Slate 200
  borderSubtle: '#F1F5F9', // Slate 100
};

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 36,
  xxl: 48,
};

export const RADIUS = {
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  full: 9999,
};

export const SHADOWS = {
  // Sombra "flotante" – para tarjetas principales
  card: {
    shadowColor: '#94A3B8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
  },
  // Sombra "botón" – para CTAs
  button: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,
  },
  // Sombra del botón de Danger (Magenta)
  buttonDanger: {
    shadowColor: '#D946EF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,
  },
  // Sombra sutil para elementos secundarios
  soft: {
    shadowColor: '#94A3B8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
};