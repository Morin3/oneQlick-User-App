import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  StatusBar,
  Alert,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Surface,
  ActivityIndicator,
} from 'react-native-paper';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../../hooks/useCartZustand';
import { DesignSystem } from '../../constants/designSystem';
import { GlobalStyles } from '../../styles/globalStyles';
import { AppIcon } from '../../components/ui';
import { Reviews } from '../../components/common';
import { RestaurantHeader, CategoryFilter, MenuItem, FloatingCart } from './components';
import { restaurantData, menuCategories, foodItems, FoodItem } from './restaurantData';

const { width, height } = Dimensions.get('window');

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addToCart, removeFromCart, updateQuantity, cart, getCartItemCount } = useCart();
  
  const [restaurant, setRestaurant] = useState(restaurantData);
  const [menuItems, setMenuItems] = useState<FoodItem[]>(foodItems);
  const [selectedCategory, setSelectedCategory] = useState<string>('starters');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const categoryRefs = useRef<Record<string, View | null>>({});

  // Calculate cart totals from Zustand store
  const cartTotal = cart.total;
  const cartItemCount = getCartItemCount();

  useEffect(() => {
    loadRestaurantData();
  }, [id]);

  const loadRestaurantData = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRestaurant(restaurantData);
      setMenuItems(foodItems);
    } catch (error) {
      console.error('Error loading restaurant:', error);
      Alert.alert('Error', 'Failed to load restaurant data');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadRestaurantData();
    setRefreshing(false);
  }, []);

  const convertToGlobalFoodItem = (item: FoodItem) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    image: item.image,
    category: item.categoryId,
    isVeg: item.isVeg,
    isPopular: item.isPopular,
    isAvailable: item.isAvailable,
    isRecommended: false,
    addOns: [],
  });

  const handleAddToCart = (item: FoodItem) => {
    try {
      addToCart(convertToGlobalFoodItem(item), 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart');
    }
  };

  const handleRemoveFromCart = (item: FoodItem) => {
    try {
      // Find the cart item by food item ID
      const cartItem = cart.items.find(cartItem => cartItem.foodItem.id === item.id);
      if (cartItem) {
        if (cartItem.quantity > 1) {
          updateQuantity(cartItem.id, cartItem.quantity - 1);
        } else {
          removeFromCart(cartItem.id);
        }
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const getItemQuantity = (itemId: string) => {
    const cartItem = cart.items.find(cartItem => cartItem.foodItem.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };


  const scrollToCategory = (categoryId: string) => {
    const categoryRef = categoryRefs.current[categoryId];
    if (categoryRef && scrollViewRef.current) {
      categoryRef.measureLayout(
        scrollViewRef.current as any,
        (x, y) => {
          scrollViewRef.current?.scrollTo({ y: y - 100, animated: true });
        },
        () => {}
      );
    }
  };





  const renderMenuSection = () => (
    <View style={styles.menuSection}>
      {menuCategories.map((category) => {
        const categoryItems = menuItems.filter(item => item.categoryId === category.id);
        if (categoryItems.length === 0) return null;

        return (
          <View 
            key={category.id} 
            ref={(ref) => { categoryRefs.current[category.id] = ref; }}
            style={styles.categorySection}
          >
            <Text style={styles.categoryTitle}>{category.name}</Text>
            <Text style={styles.categoryDescription}>{category.description}</Text>
            
            {categoryItems.map((item) => (
              <View key={item.id}>
                <MenuItem
                  item={item}
                  quantity={getItemQuantity(item.id)}
                  onAddToCart={handleAddToCart}
                  onRemoveFromCart={handleRemoveFromCart}
                />
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[GlobalStyles.layout.container]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={DesignSystem.colors.primary[500]} />
          <Text style={styles.loadingText}>Loading restaurant...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: false,
          title: restaurant.name 
        }} 
      />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <Animated.ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[DesignSystem.colors.primary[500]]}
            tintColor={DesignSystem.colors.primary[500]}
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <RestaurantHeader restaurant={restaurant} />
        <CategoryFilter 
          categories={menuCategories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          onScrollToCategory={scrollToCategory}
        />
        {renderMenuSection()}
        
        {/* Restaurant Details Section */}
        <Surface style={styles.detailsSection} elevation={1}>
          <Text style={styles.detailsTitle}>Restaurant Details</Text>
          
          <View style={styles.detailItem}>
            <AppIcon.Time size={20} color={DesignSystem.colors.text.secondary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Opening Hours</Text>
              <Text style={styles.detailValue}>{restaurant.openingHours}</Text>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <AppIcon.Phone size={20} color={DesignSystem.colors.text.secondary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{restaurant.phone}</Text>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <AppIcon.Location size={20} color={DesignSystem.colors.text.secondary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Address</Text>
              <Text style={styles.detailValue}>{restaurant.address}</Text>
            </View>
          </View>
        </Surface>

        {/* Reviews Section */}
        <Reviews 
          reviews={restaurant.reviews}
          title="Customer Reviews"
          showCount={true}
          maxReviews={3}
          variant="list"
        />
        
        {/* Bottom Spacing for Floating Cart */}
        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>

      <FloatingCart itemCount={cartItemCount} total={cartTotal} />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: DesignSystem.colors.background.secondary,
  },

  // Loading States
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: DesignSystem.spacing.md,
    backgroundColor: DesignSystem.colors.background.secondary,
  },
  loadingText: {
    ...GlobalStyles.typography.body1,
    color: DesignSystem.colors.text.secondary,
  },

  // Scroll View
  scrollView: {
    flex: 1,
    backgroundColor: DesignSystem.colors.background.secondary,
  },

  // Restaurant Header
  restaurantHeader: {
    marginBottom: DesignSystem.spacing.sm,
  },
  heroImageContainer: {
    position: 'relative',
    height: height * 0.35,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backButton: {
    position: 'absolute',
    top: DesignSystem.spacing.lg,
    left: DesignSystem.spacing.md,
    zIndex: 10,
  },
  backButtonSurface: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: DesignSystem.spacing.lg,
    right: DesignSystem.spacing.md,
    zIndex: 10,
  },
  favoriteButtonSurface: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Restaurant Info Card
  restaurantInfoCard: {
    marginTop: -DesignSystem.spacing.xl,
    marginHorizontal: DesignSystem.spacing.md,
    borderRadius: DesignSystem.borderRadius.xl,
    backgroundColor: DesignSystem.colors.background.primary,
    zIndex: 5,
  },
  restaurantInfo: {
    padding: DesignSystem.spacing.lg,
  },
  restaurantTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: DesignSystem.spacing.md,
  },
  restaurantTitleContainer: {
    flex: 1,
    marginRight: DesignSystem.spacing.md,
  },
  restaurantName: {
    ...GlobalStyles.typography.h2,
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.xs,
  },
  cuisineContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cuisineText: {
    ...GlobalStyles.typography.body2,
    color: DesignSystem.colors.text.secondary,
  },
  ratingContainer: {
    alignItems: 'center',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DesignSystem.colors.primary[500],
    paddingHorizontal: DesignSystem.spacing.sm,
    paddingVertical: DesignSystem.spacing.xs,
    borderRadius: DesignSystem.borderRadius.md,
    marginBottom: DesignSystem.spacing.xs,
  },
  ratingText: {
    ...GlobalStyles.typography.button,
    color: DesignSystem.colors.text.inverse,
    marginLeft: DesignSystem.spacing.xs,
  },
  ratingCount: {
    ...GlobalStyles.typography.caption,
    color: DesignSystem.colors.text.secondary,
  },

  // Key Stats
  keyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: DesignSystem.spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statText: {
    ...GlobalStyles.typography.caption,
    color: DesignSystem.colors.text.secondary,
    marginLeft: DesignSystem.spacing.xs,
  },

  // Restaurant Tags
  restaurantTags: {
    flexDirection: 'row',
    gap: DesignSystem.spacing.sm,
    marginBottom: DesignSystem.spacing.md,
  },
  chipText: {
    ...GlobalStyles.typography.caption,
    color: DesignSystem.colors.text.inverse,
    fontWeight: DesignSystem.typography.fontWeight.bold,
  },
  chipTextOutlined: {
    ...GlobalStyles.typography.caption,
    color: DesignSystem.colors.text.primary,
    fontWeight: DesignSystem.typography.fontWeight.medium,
  },
  openChip: {
    backgroundColor: DesignSystem.colors.success,
  },
  costChip: {
    borderColor: DesignSystem.colors.border.medium,
  },

  // Address
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressText: {
    ...GlobalStyles.typography.body2,
    color: DesignSystem.colors.text.secondary,
    marginLeft: DesignSystem.spacing.xs,
    flex: 1,
  },

  // Category Filter
  categoryFilter: {
    backgroundColor: DesignSystem.colors.background.primary,
    marginBottom: DesignSystem.spacing.sm,
    paddingVertical: DesignSystem.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: DesignSystem.colors.border.light,
  },
  categoryFilterContent: {
    paddingHorizontal: DesignSystem.spacing.md,
  },
  categoryItem: {
    marginRight: DesignSystem.spacing.sm,
    paddingHorizontal: DesignSystem.spacing.lg,
    paddingVertical: DesignSystem.spacing.sm,
    borderRadius: DesignSystem.borderRadius.xl,
    backgroundColor: DesignSystem.colors.background.secondary,
    borderWidth: 1,
    borderColor: DesignSystem.colors.border.light,
    minWidth: 100,
    alignItems: 'center',
  },
  activeCategoryItem: {
    backgroundColor: DesignSystem.colors.primary[500],
    borderColor: DesignSystem.colors.primary[500],
    ...DesignSystem.shadows.sm,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    ...GlobalStyles.typography.caption,
    color: DesignSystem.colors.text.secondary,
    marginLeft: DesignSystem.spacing.xs,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
    fontSize: DesignSystem.typography.fontSize.sm,
  },
  activeCategoryText: {
    color: DesignSystem.colors.text.inverse,
    fontWeight: DesignSystem.typography.fontWeight.bold,
  },

  // Menu Section
  menuSection: {
    backgroundColor: DesignSystem.colors.background.secondary,
    paddingHorizontal: DesignSystem.spacing.md,
  },
  categorySection: {
    marginBottom: DesignSystem.spacing.xl,
  },
  categoryTitle: {
    ...GlobalStyles.typography.h3,
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.xs,
  },
  categoryDescription: {
    ...GlobalStyles.typography.body2,
    color: DesignSystem.colors.text.secondary,
    marginBottom: DesignSystem.spacing.md,
  },

  // Menu Items
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

  // Menu Item Footer
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

  // Restaurant Details
  detailsSection: {
    backgroundColor: DesignSystem.colors.background.primary,
    marginHorizontal: DesignSystem.spacing.md,
    marginBottom: DesignSystem.spacing.sm,
    borderRadius: DesignSystem.borderRadius.lg,
    padding: DesignSystem.spacing.lg,
  },
  detailsTitle: {
    ...GlobalStyles.typography.h4,
    color: DesignSystem.colors.text.primary,
    marginBottom: DesignSystem.spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: DesignSystem.spacing.md,
  },
  detailContent: {
    flex: 1,
    marginLeft: DesignSystem.spacing.md,
  },
  detailLabel: {
    ...GlobalStyles.typography.body2,
    color: DesignSystem.colors.text.secondary,
    marginBottom: DesignSystem.spacing.xs,
  },
  detailValue: {
    ...GlobalStyles.typography.body1,
    color: DesignSystem.colors.text.primary,
  },


  // Floating Cart
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

  // Bottom Spacing
  bottomSpacing: {
    height: 100,
  },
});