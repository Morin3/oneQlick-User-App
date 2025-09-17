import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../../hooks/useCartZustand';
import { DesignSystem } from '../../constants/designSystem';
import {
  FoodImage,
  BasicInfo,
  SizeSelection,
  Toppings,
  Beverages,
  QuantitySelector,
  AddToCartBar,
} from '../../components/food-item';

const { width, height } = Dimensions.get('window');

// Sample data
const foodItemData = {
  id: 'chicken-biryani',
  name: 'Chicken Biryani',
  description: 'Aromatic basmati rice with tender chicken pieces, cooked with traditional spices and herbs. Served with raita and pickle.',
  price: 180,
  originalPrice: 220,
  image: 'https://images.unsplash.com/photo-1563379091339-03246963d8a9?w=400&h=300&fit=crop&crop=center',
  rating: 4.5,
  reviewCount: 120,
  isVeg: false,
  isPopular: true,
  prepTime: '20-25 minutes',
  calories: 450,
  cuisine: 'Hyderabadi',
};

const sizeOptions = [
  { id: 'regular', name: 'Regular', price: 0 },
  { id: 'large', name: 'Large', price: 50 },
];

const toppingOptions = [
  { id: 'extra-cheese', name: 'Extra Cheese', price: 25 },
  { id: 'extra-raita', name: 'Extra Raita', price: 20 },
  { id: 'boiled-egg', name: 'Boiled Egg', price: 15 },
  { id: 'extra-pickle', name: 'Extra Pickle', price: 10 },
  { id: 'extra-onions', name: 'Extra Onions', price: 8 },
  { id: 'spicy-sauce', name: 'Spicy Sauce', price: 12 },
];

const beverageOptions = [
  { id: 'coke', name: 'Coca Cola (250ml)', price: 30 },
  { id: 'pepsi', name: 'Pepsi (250ml)', price: 30 },
  { id: 'water', name: 'Mineral Water (500ml)', price: 20 },
  { id: 'lassi', name: 'Sweet Lassi', price: 40 },
  { id: 'juice', name: 'Fresh Orange Juice', price: 50 },
];

export default function FoodItemScreen() {
  const router = useRouter();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('regular');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [selectedBeverages, setSelectedBeverages] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const calculateTotalPrice = () => {
    const basePrice = foodItemData.price;
    const sizePrice = sizeOptions.find(s => s.id === selectedSize)?.price || 0;
    const toppingPrice = selectedToppings.reduce((total, id) => {
      const topping = toppingOptions.find(t => t.id === id);
      return total + (topping?.price || 0);
    }, 0);
    const beveragePrice = selectedBeverages.reduce((total, id) => {
      const beverage = beverageOptions.find(b => b.id === id);
      return total + (beverage?.price || 0);
    }, 0);
    
    return (basePrice + sizePrice + toppingPrice + beveragePrice) * quantity;
  };

  const getSelectedToppingsData = () => {
    return selectedToppings.map(id => toppingOptions.find(t => t.id === id)).filter(Boolean);
  };

  const getSelectedBeveragesData = () => {
    return selectedBeverages.map(id => beverageOptions.find(b => b.id === id)).filter(Boolean);
  };

  const createCartItem = () => {
    const selectedToppingsData = getSelectedToppingsData();
    const selectedBeveragesData = getSelectedBeveragesData();
    
    return {
      id: `${foodItemData.id}-${Date.now()}`,
      name: foodItemData.name,
      description: foodItemData.description,
      price: foodItemData.price,
      image: foodItemData.image,
      category: 'Customized',
      isVeg: foodItemData.isVeg,
      isAvailable: true,
      isPopular: foodItemData.isPopular,
      isRecommended: false,
      addOns: [...selectedToppingsData, ...selectedBeveragesData].map(item => ({
        id: item!.id,
        name: item!.name,
        price: item!.price,
        isAvailable: true,
      })),
    };
  };

  const handleToppingToggle = (toppingId: string) => {
    setSelectedToppings(prev => 
      prev.includes(toppingId) 
        ? prev.filter(id => id !== toppingId)
        : [...prev, toppingId]
    );
  };

  const handleBeverageToggle = (beverageId: string) => {
    setSelectedBeverages(prev => 
      prev.includes(beverageId) 
        ? prev.filter(id => id !== beverageId)
        : [...prev, beverageId]
    );
  };

  const handleAddToCart = () => {
    const cartItem = createCartItem();
    addToCart(cartItem, quantity);
    
    Alert.alert(
      'Added to Cart!',
      `${quantity}x ${foodItemData.name} has been added to your cart.`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => router.push('/(modals)/cart') }
      ]
    );
  };

  const getSizePrice = () => {
    return sizeOptions.find(s => s.id === selectedSize)?.price || 0;
  };

  const getToppingPrice = () => {
    return selectedToppings.reduce((total, id) => {
      const topping = toppingOptions.find(t => t.id === id);
      return total + (topping?.price || 0);
    }, 0);
  };

  const getBeveragePrice = () => {
    return selectedBeverages.reduce((total, id) => {
      const beverage = beverageOptions.find(b => b.id === id);
      return total + (beverage?.price || 0);
    }, 0);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <FoodImage
            image={foodItemData.image}
            isVeg={foodItemData.isVeg}
            isPopular={foodItemData.isPopular}
            isFavorite={isFavorite}
            onFavoriteToggle={() => setIsFavorite(!isFavorite)}
          />
          
          <BasicInfo
            name={foodItemData.name}
            description={foodItemData.description}
            rating={foodItemData.rating}
            reviewCount={foodItemData.reviewCount}
            price={foodItemData.price}
            originalPrice={foodItemData.originalPrice}
            prepTime={foodItemData.prepTime}
            calories={foodItemData.calories}
            cuisine={foodItemData.cuisine}
          />
          
          <SizeSelection
            sizeOptions={sizeOptions}
            selectedSize={selectedSize}
            basePrice={foodItemData.price}
            onSizeSelect={setSelectedSize}
          />
          
          <Toppings
            toppingOptions={toppingOptions}
            selectedToppings={selectedToppings}
            onToppingToggle={handleToppingToggle}
          />
          
          <Beverages
            beverageOptions={beverageOptions}
            selectedBeverages={selectedBeverages}
            onBeverageToggle={handleBeverageToggle}
          />
          
          <QuantitySelector
            quantity={quantity}
            onQuantityChange={setQuantity}
            basePrice={foodItemData.price}
            sizePrice={getSizePrice()}
            toppingPrice={getToppingPrice()}
            beveragePrice={getBeveragePrice()}
          />
          
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </Animated.View>
      
      <AddToCartBar
        totalPrice={calculateTotalPrice()}
        onAddToCart={handleAddToCart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignSystem.colors.background.secondary,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  bottomSpacing: {
    height: 100,
  },
});
