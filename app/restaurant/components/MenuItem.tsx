import React from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { DesignSystem } from '../../../constants/designSystem';
import { GlobalStyles } from '../../../styles/globalStyles';
import { AppIcon } from '../../../components/ui';
import { FoodItem } from '../restaurantData';

interface MenuItemProps {
  item: FoodItem;
  quantity: number;
  onAddToCart: (item: FoodItem) => void;
  onRemoveFromCart: (item: FoodItem) => void;
}

export default function MenuItem({ 
  item, 
  quantity, 
  onAddToCart, 
  onRemoveFromCart 
}: MenuItemProps) {
  return (
    <Surface style={styles.menuItemCard} elevation={1}>
      <View style={styles.menuItemContent}>
        <View style={styles.menuItemHeader}>
          <View style={styles.menuItemInfo}>
            <View style={styles.menuItemTitleRow}>
              <Text style={styles.menuItemName}>{item.name}</Text>
              {item.isPopular && (
                <View style={styles.popularBadge}>
                  <AppIcon.Popular size={12} color={DesignSystem.colors.text.inverse} />
                  <Text style={styles.popularBadgeText}>Popular</Text>
                </View>
              )}
            </View>
            
            <Text style={styles.menuItemDescription} numberOfLines={2}>
              {item.description}
            </Text>
            
            <View style={styles.menuItemMeta}>
              <View style={styles.priceContainer}>
                <Text style={styles.menuItemPrice}>₹{item.price}</Text>
                {item.originalPrice && item.originalPrice > item.price && (
                  <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
                )}
              </View>
              
              <View style={styles.prepTimeContainer}>
                <AppIcon.Time size={12} color={DesignSystem.colors.text.secondary} />
                <Text style={styles.prepTimeText}>{item.preparationTime}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.menuItemImageContainer}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            {!item.isAvailable && (
              <View style={styles.unavailableOverlay}>
                <Text style={styles.unavailableText}>Unavailable</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.menuItemFooter}>
          <View style={styles.menuItemTags}>
            <View style={[
              styles.vegIndicator, 
              { backgroundColor: item.isVeg ? DesignSystem.colors.success : DesignSystem.colors.error }
            ]}>
              <AppIcon.Veg size={8} color={DesignSystem.colors.text.inverse} />
            </View>
            {item.allergens && item.allergens.length > 0 && (
              <Text style={styles.allergenText}>
                Contains: {item.allergens.join(', ')}
              </Text>
            )}
          </View>
          
          <View style={styles.quantityContainer}>
            {quantity > 0 ? (
              <View style={styles.quantitySelector}>
                <Pressable 
                  style={styles.quantityButton}
                  onPress={() => onRemoveFromCart(item)}
                >
                  <AppIcon.Remove size={16} color={DesignSystem.colors.primary[500]} />
                </Pressable>
                
                <Text style={styles.quantityText}>{quantity}</Text>
                
                <Pressable 
                  style={styles.quantityButton}
                  onPress={() => onAddToCart(item)}
                >
                  <AppIcon.Add size={16} color={DesignSystem.colors.primary[500]} />
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={styles.addButton}
                onPress={() => onAddToCart(item)}
                disabled={!item.isAvailable}
              >
                <Surface style={[
                  styles.addButtonSurface,
                  !item.isAvailable && styles.addButtonDisabled
                ]} elevation={2}>
                  <Text style={[
                    styles.addButtonText,
                    !item.isAvailable && styles.addButtonTextDisabled
                  ]}>
                    {item.isAvailable ? 'Add' : 'Unavailable'}
                  </Text>
                </Surface>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  menuItemCard: {
    backgroundColor: DesignSystem.colors.background.primary,
    borderRadius: DesignSystem.borderRadius.lg,
    marginBottom: DesignSystem.spacing.md,
    borderWidth: 1,
    borderColor: DesignSystem.colors.border.light,
  },
  menuItemContent: {
    padding: DesignSystem.spacing.md,
  },
  menuItemHeader: {
    flexDirection: 'row',
    marginBottom: DesignSystem.spacing.md,
  },
  menuItemInfo: {
    flex: 1,
    marginRight: DesignSystem.spacing.md,
  },
  menuItemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.xs,
  },
  menuItemName: {
    ...GlobalStyles.typography.h5,
    color: DesignSystem.colors.text.primary,
    flex: 1,
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DesignSystem.colors.warning,
    paddingHorizontal: DesignSystem.spacing.xs,
    paddingVertical: 2,
    borderRadius: DesignSystem.borderRadius.sm,
    marginLeft: DesignSystem.spacing.sm,
  },
  popularBadgeText: {
    ...GlobalStyles.typography.caption,
    color: DesignSystem.colors.text.inverse,
    marginLeft: 2,
    fontWeight: DesignSystem.typography.fontWeight.bold,
  },
  menuItemDescription: {
    ...GlobalStyles.typography.body2,
    color: DesignSystem.colors.text.secondary,
    marginBottom: DesignSystem.spacing.sm,
  },
  menuItemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemPrice: {
    ...GlobalStyles.typography.h5,
    color: DesignSystem.colors.primary[500],
    fontWeight: DesignSystem.typography.fontWeight.bold,
  },
  originalPrice: {
    ...GlobalStyles.typography.body2,
    color: DesignSystem.colors.text.disabled,
    textDecorationLine: 'line-through',
    marginLeft: DesignSystem.spacing.xs,
  },
  prepTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prepTimeText: {
    ...GlobalStyles.typography.caption,
    color: DesignSystem.colors.text.secondary,
    marginLeft: DesignSystem.spacing.xs,
  },
  menuItemImageContainer: {
    width: 80,
    height: 80,
    borderRadius: DesignSystem.borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  unavailableOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unavailableText: {
    ...GlobalStyles.typography.caption,
    color: DesignSystem.colors.text.inverse,
    fontWeight: DesignSystem.typography.fontWeight.bold,
  },
  menuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemTags: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  vegIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: DesignSystem.spacing.sm,
  },
  allergenText: {
    ...GlobalStyles.typography.caption,
    color: DesignSystem.colors.text.secondary,
    flex: 1,
  },
  quantityContainer: {
    alignItems: 'flex-end',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DesignSystem.colors.primary[50],
    borderRadius: DesignSystem.borderRadius.lg,
    paddingHorizontal: DesignSystem.spacing.xs,
    borderWidth: 1,
    borderColor: DesignSystem.colors.primary[200],
  },
  quantityButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    ...GlobalStyles.typography.body1,
    color: DesignSystem.colors.primary[500],
    fontWeight: DesignSystem.typography.fontWeight.bold,
    marginHorizontal: DesignSystem.spacing.sm,
    minWidth: 20,
    textAlign: 'center',
  },
  addButton: {
    borderRadius: DesignSystem.borderRadius.md,
  },
  addButtonSurface: {
    backgroundColor: DesignSystem.colors.primary[500],
    paddingHorizontal: DesignSystem.spacing.md,
    paddingVertical: DesignSystem.spacing.sm,
    borderRadius: DesignSystem.borderRadius.md,
  },
  addButtonDisabled: {
    backgroundColor: DesignSystem.colors.neutral[300],
  },
  addButtonText: {
    ...GlobalStyles.typography.button,
    color: DesignSystem.colors.text.inverse,
  },
  addButtonTextDisabled: {
    color: DesignSystem.colors.text.disabled,
  },
});
