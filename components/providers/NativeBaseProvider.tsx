// NativeBase Provider for oneQlick User App
// Enhanced UI components with NativeBase

import React from 'react';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { DesignSystem } from '../../constants/designSystem';

// Custom theme based on our design system
const theme = extendTheme({
  colors: {
    primary: {
      50: DesignSystem.colors.primary[50],
      100: DesignSystem.colors.primary[100],
      200: DesignSystem.colors.primary[200],
      300: DesignSystem.colors.primary[300],
      400: DesignSystem.colors.primary[400],
      500: DesignSystem.colors.primary[500],
      600: DesignSystem.colors.primary[600],
      700: DesignSystem.colors.primary[700],
      800: DesignSystem.colors.primary[800],
      900: DesignSystem.colors.primary[900],
    },
    secondary: {
      50: DesignSystem.colors.secondary[50],
      100: DesignSystem.colors.secondary[100],
      200: DesignSystem.colors.secondary[200],
      300: DesignSystem.colors.secondary[300],
      400: DesignSystem.colors.secondary[400],
      500: DesignSystem.colors.secondary[500],
      600: DesignSystem.colors.secondary[600],
      700: DesignSystem.colors.secondary[700],
      800: DesignSystem.colors.secondary[800],
      900: DesignSystem.colors.secondary[900],
    },
    success: DesignSystem.colors.success,
    warning: DesignSystem.colors.warning,
    error: DesignSystem.colors.error,
    info: DesignSystem.colors.info,
  },
  fontSizes: {
    xs: DesignSystem.typography.fontSize.xs,
    sm: DesignSystem.typography.fontSize.sm,
    md: DesignSystem.typography.fontSize.base,
    lg: DesignSystem.typography.fontSize.lg,
    xl: DesignSystem.typography.fontSize.xl,
    '2xl': DesignSystem.typography.fontSize['2xl'],
    '3xl': DesignSystem.typography.fontSize['3xl'],
    '4xl': DesignSystem.typography.fontSize['4xl'],
    '5xl': DesignSystem.typography.fontSize['5xl'],
  },
  space: {
    xs: DesignSystem.spacing.xs,
    sm: DesignSystem.spacing.sm,
    md: DesignSystem.spacing.md,
    lg: DesignSystem.spacing.lg,
    xl: DesignSystem.spacing.xl,
    '2xl': DesignSystem.spacing['2xl'],
    '3xl': DesignSystem.spacing['3xl'],
    '4xl': DesignSystem.spacing['4xl'],
  },
  radii: {
    none: DesignSystem.borderRadius.none,
    sm: DesignSystem.borderRadius.sm,
    md: DesignSystem.borderRadius.md,
    lg: DesignSystem.borderRadius.lg,
    xl: DesignSystem.borderRadius.xl,
    '2xl': DesignSystem.borderRadius['2xl'],
    '3xl': DesignSystem.borderRadius['3xl'],
    full: DesignSystem.borderRadius.full,
  },
  shadows: {
    sm: DesignSystem.shadows.sm,
    md: DesignSystem.shadows.md,
    lg: DesignSystem.shadows.lg,
    xl: DesignSystem.shadows.xl,
  },
});

interface NativeBaseProviderWrapperProps {
  children: React.ReactNode;
}

export default function NativeBaseProviderWrapper({ children }: NativeBaseProviderWrapperProps) {
  return (
    <NativeBaseProvider theme={theme}>
      {children}
    </NativeBaseProvider>
  );
}

