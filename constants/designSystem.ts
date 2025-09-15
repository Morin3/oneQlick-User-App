// Design System for oneQlick User App
// Centralized design tokens for consistent UI across the application

export const DesignSystem = {
  // Color Palette
  colors: {
    // Primary Colors
    primary: {
      50: '#ffffff',
      100: '#FFE0B2',
      200: '#FFCC80',
      300: '#FFB74D',
      400: '#FFA726',
      500: '#FF6B35', // Main primary
      600: '#FB8C00',
      700: '#F57C00',
      800: '#EF6C00',
      900: '#E65100',
    },
    
    // Secondary Colors
    secondary: {
      50: '#FFFDE7',
      100: '#FFF9C4',
      200: '#FFF59D',
      300: '#FFF176',
      400: '#FFEE58',
      500: '#FFD93D', // Main secondary
      600: '#FDD835',
      700: '#FBC02D',
      800: '#F9A825',
      900: '#F57F17',
    },
    
    // Accent Colors
    accent: {
      50: '#E8F5E8',
      100: '#C8E6C9',
      200: '#A5D6A7',
      300: '#81C784',
      400: '#66BB6A',
      500: '#6BCF7F', // Main accent
      600: '#4CAF50',
      700: '#388E3C',
      800: '#2E7D32',
      900: '#1B5E20',
    },
    
    // Status Colors
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    
    // Neutral Colors
    neutral: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    
    // Text Colors
    text: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#BDBDBD',
      inverse: '#FFFFFF',
    },
    
    // Background Colors
    background: {
      primary: '#FFFFFF',
      secondary: '#F5F5F5',
      tertiary: '#FAFAFA',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    
    // Border Colors
    border: {
      light: '#E0E0E0',
      medium: '#BDBDBD',
      dark: '#757575',
    },
  },
  
  // Spacing System (8px base unit)
  spacing: {
    xs: 4,    // 0.25rem
    sm: 8,    // 0.5rem
    md: 16,   // 1rem
    lg: 24,   // 1.5rem
    xl: 32,   // 2rem
    '2xl': 40, // 2.5rem
    '3xl': 48, // 3rem
    '4xl': 64, // 4rem
  },
  
  // Typography Scale
  typography: {
    // Font Sizes
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
    },
    
    // Font Weights
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    
    // Line Heights
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  // Border Radius
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    full: 9999,
  },
  
  // Shadows/Elevation
  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  
  // Component Sizes
  sizes: {
    // Button Heights
    button: {
      sm: 32,
      md: 44,
      lg: 52,
    },
    
    // Input Heights
    input: {
      sm: 36,
      md: 44,
      lg: 52,
    },
    
    // Icon Sizes
    icon: {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 32,
      xl: 40,
    },
    
    // Avatar Sizes
    avatar: {
      sm: 32,
      md: 40,
      lg: 56,
      xl: 80,
    },
  },
  
  // Animation Durations
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  
  // Z-Index Scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
} as const;

// Type definitions for better TypeScript support
export type ColorKey = keyof typeof DesignSystem.colors;
export type SpacingKey = keyof typeof DesignSystem.spacing;
export type TypographyKey = keyof typeof DesignSystem.typography;
export type BorderRadiusKey = keyof typeof DesignSystem.borderRadius;
export type ShadowKey = keyof typeof DesignSystem.shadows;
