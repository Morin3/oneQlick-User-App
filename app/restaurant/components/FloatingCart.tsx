import React from 'react';
import { View, StyleSheet, Pressable, Animated } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { DesignSystem } from '../../../constants/designSystem';
import { GlobalStyles } from '../../../styles/globalStyles';
import { AppIcon } from '../../../components/ui';

interface FloatingCartProps {
  itemCount: number;
  total: number;
}

export default function FloatingCart({ itemCount, total }: FloatingCartProps) {
  const router = useRouter();

  if (itemCount === 0) return null;

  return (
    <Animated.View style={styles.floatingCart}>
      <Pressable 
        style={styles.cartButton}
        onPress={() => router.push('/(tabs)/cart')}
      >
        <Surface style={styles.cartButtonSurface} elevation={4}>
          <View style={styles.cartContent}>
            <View style={styles.cartInfo}>
              <Text style={styles.cartItemCount}>{itemCount} items</Text>
              <Text style={styles.cartTotal}>₹{total}</Text>
            </View>
            <View style={styles.cartAction}>
              <Text style={styles.cartActionText}>View Cart</Text>
              <AppIcon.ArrowRight size={16} color={DesignSystem.colors.text.inverse} />
            </View>
          </View>
        </Surface>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  floatingCart: {
    position: 'absolute',
    bottom: DesignSystem.spacing.lg,
    left: DesignSystem.spacing.md,
    right: DesignSystem.spacing.md,
    zIndex: 1000,
  },
  cartButton: {
    borderRadius: DesignSystem.borderRadius.lg,
  },
  cartButtonSurface: {
    backgroundColor: DesignSystem.colors.primary[500],
    borderRadius: DesignSystem.borderRadius.lg,
    padding: DesignSystem.spacing.md,
  },
  cartContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartInfo: {
    flex: 1,
  },
  cartItemCount: {
    ...GlobalStyles.typography.caption,
    color: DesignSystem.colors.text.inverse,
    marginBottom: 2,
  },
  cartTotal: {
    ...GlobalStyles.typography.h5,
    color: DesignSystem.colors.text.inverse,
    fontWeight: DesignSystem.typography.fontWeight.bold,
  },
  cartAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartActionText: {
    ...GlobalStyles.typography.button,
    color: DesignSystem.colors.text.inverse,
    marginRight: DesignSystem.spacing.xs,
  },
});
