export const lightTheme = {
  colorScheme: 'light',
  bgBase: '#FFFDFE',
  bgCard: '#FFFFFF',
  bgModal: '#FFFFFF',
  bgOverlay: 'rgba(255, 255, 255, 0.75)',
  bgInput: '#FFFFFF',
  textPrimary: '#2B2230',
  textSecondary: '#8A7684',
  textMuted: '#BFAFB9',
  borderLight: '#EBDDE5',
  borderActive: 'rgba(201, 79, 135, 0.14)',
  brandMain: '#D9538F',
  brandSecondary: '#A83A6E',
  brandTertiary: '#1E8A7D',
  shadowMain: 'rgba(201, 79, 135, 0.6)',
  gradientPrimary: 'linear-gradient(135deg, #D9538F, #A83A6E)',
  gradientSecondary: 'linear-gradient(120deg, #D9538F 0%, #A83A6E 45%, #1E8A7D 100%)',
  bgPattern: `
    radial-gradient(1100px 550px at 85% -10%, rgba(217, 83, 143, 0.1), transparent 60%),
    radial-gradient(900px 500px at 0% 110%, rgba(30, 138, 125, 0.09), transparent 60%),
    linear-gradient(155deg, #FFF3F9 0%, #FDF6FA 50%, #EDF7F4 100%)
  `,

  // Semantic status colors
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',

  // Tinted status surfaces (chips, banners, list highlights)
  successBg: '#EAF7F4',
  successBorder: '#BEE6DB',
  successText: '#0F6B5C',
  warningBg: '#FFFBEB',
  warningBorder: '#FEF3C7',
  warningText: '#B45309',
  errorBg: '#FDF0F4',
  errorBorder: '#F3C9DA',

  // Structural surfaces
  bgSubtle: '#F6EFF3',
  bgSubtleHover: '#EEDFE7',
  chartGrid: 'rgba(0, 0, 0, 0.06)',
  chartTrack: 'rgba(0, 0, 0, 0.06)',
  scrollbarThumb: '#CBD5E1',
  scrollbarThumbHover: '#94A3B8',
  tooltipBg: 'rgba(255, 255, 255, 0.95)',
};

export const darkTheme = {
  colorScheme: 'dark',
  bgBase: '#120E15',
  bgCard: '#1E1924',
  bgModal: '#1E1924',
  bgOverlay: 'rgba(30, 25, 36, 0.85)',
  bgInput: '#26202E',
  textPrimary: '#FDF6FA',
  textSecondary: '#C1B4BD',
  textMuted: '#8A7684',
  borderLight: '#3D3346',
  borderActive: 'rgba(217, 83, 143, 0.3)',
  brandMain: '#E87DAA',
  brandSecondary: '#C94F87',
  brandTertiary: '#2BB3A3',
  shadowMain: 'rgba(0, 0, 0, 0.4)',
  gradientPrimary: 'linear-gradient(135deg, #D9538F, #A83A6E)',
  gradientSecondary: 'linear-gradient(120deg, #E87DAA 0%, #C94F87 45%, #2BB3A3 100%)',
  bgPattern: `
    radial-gradient(1100px 550px at 85% -10%, rgba(217, 83, 143, 0.15), transparent 60%),
    radial-gradient(900px 500px at 0% 110%, rgba(43, 179, 163, 0.1), transparent 60%),
    linear-gradient(155deg, #1A1625 0%, #120E15 50%, #171A21 100%)
  `,

  // Semantic status colors
  success: '#34D399',
  warning: '#FBBF24',
  danger: '#F87171',
  info: '#60A5FA',

  // Tinted status surfaces (chips, banners, list highlights)
  successBg: 'rgba(52, 211, 153, 0.12)',
  successBorder: 'rgba(52, 211, 153, 0.3)',
  successText: '#6EE7B7',
  warningBg: 'rgba(251, 191, 36, 0.12)',
  warningBorder: 'rgba(251, 191, 36, 0.3)',
  warningText: '#FCD34D',
  errorBg: 'rgba(232, 125, 170, 0.12)',
  errorBorder: 'rgba(232, 125, 170, 0.3)',

  // Structural surfaces
  bgSubtle: '#26202E',
  bgSubtleHover: '#302938',
  chartGrid: 'rgba(255, 255, 255, 0.08)',
  chartTrack: 'rgba(255, 255, 255, 0.08)',
  scrollbarThumb: '#3D3346',
  scrollbarThumbHover: '#4A4052',
  tooltipBg: 'rgba(38, 32, 46, 0.95)',
};
