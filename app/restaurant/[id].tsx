import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Surface,
  Chip,
  Divider,
  IconButton,
} from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useCart } from '../../hooks/useCart';
import { Restaurant, FoodItem } from '../../types';

const { width } = Dimensions.get('window');

export default function RestaurantScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addToCart } = useCart();
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRestaurantData();
  }, [id]);

  const loadRestaurantData = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const mockRestaurant: Restaurant = {
        id: id || '1',
        name: 'Spice Garden',
        cuisine: 'Indian',
        rating: 4.5,
        totalRatings: 120,
        deliveryTime: '25-35 min',
        minOrder: 200,
        deliveryFee: 40,
        image: 'https://via.placeholder.com/400x200',
        isOpen: true,
        isVeg: false,
        isPureVeg: false,
        address: '123 Main Street, Mumbai',
        coordinates: { latitude: 19.0760, longitude: 72.8777 },
        categories: ['Main Course', 'Appetizers', 'Desserts'],
        offers: [],
        featured: true,
      };

      const mockMenuItems: FoodItem[] = [
        {
          id: '1',
          name: 'Butter Chicken',
          description: 'Tender chicken in rich tomato and cream sauce',
          price: 299,
          image: 'https://via.placeholder.com/100x100',
          category: 'Main Course',
          isVeg: false,
          isAvailable: true,
          isPopular: true,
          isRecommended: true,
        },
        {
          id: '2',
          name: 'Dal Makhani',
          description: 'Creamy black lentils slow-cooked to perfection',
          price: 199,
          image: 'https://via.placeholder.com/100x100',
          category: 'Main Course',
          isVeg: true,
          isAvailable: true,
          isPopular: false,
          isRecommended: true,
        },
        {
          id: '3',
          name: 'Naan Bread',
          description: 'Freshly baked soft bread',
          price: 49,
          image: 'https://via.placeholder.com/100x100',
          category: 'Bread',
          isVeg: true,
          isAvailable: true,
          isPopular: false,
          isRecommended: false,
        },
      ];

      setRestaurant(mockRestaurant);
      setMenuItems(mockMenuItems);
    } catch (error) {
      console.error('Error loading restaurant:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (item: FoodItem) => {
    try {
      await addToCart(item, 1);
      // TODO: Show success feedback
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const filteredMenuItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const renderRestaurantHeader = () => (
    <View style={styles.restaurantHeader}>
      <Image source={{ uri: restaurant?.image }} style={styles.restaurantImage} />
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{restaurant?.name}</Text>
        <Text style={styles.restaurantCuisine}>{restaurant?.cuisine}</Text>
        
        <View style={styles.restaurantStats}>
          <View style={styles.statItem}>
            <MaterialIcons name="star" size={16} color="#FFD700" />
            <Text style={styles.statText}>{restaurant?.rating}</Text>
            <Text style={styles.statSubtext}>({restaurant?.totalRatings})</Text>
          </View>
          
          <View style={styles.statItem}>
            <MaterialIcons name="schedule" size={16} color="#666" />
            <Text style={styles.statText}>{restaurant?.deliveryTime}</Text>
          </View>
          
          <View style={styles.statItem}>
            <MaterialIcons name="delivery-dining" size={16} color="#666" />
            <Text style={styles.statText}>₹{restaurant?.deliveryFee}</Text>
          </View>
        </View>

        <View style={styles.restaurantTags}>
          {restaurant?.isVeg && (
            <Chip mode="flat" textStyle={{ color: 'white' }} style={styles.vegChip}>
              VEG
            </Chip>
          )}
          {restaurant?.isOpen && (
            <Chip mode="flat" textStyle={{ color: 'white' }} style={styles.openChip}>
              OPEN
            </Chip>
          )}
        </View>
      </View>
    </View>
  );

  const renderCategoryFilter = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.categoryFilter}
      contentContainerStyle={styles.categoryFilterContent}
    >
      <Chip
        mode={selectedCategory === 'all' ? 'flat' : 'outlined'}
        onPress={() => setSelectedCategory('all')}
        style={selectedCategory === 'all' ? styles.activeCategoryChip : styles.categoryChip}
        textStyle={selectedCategory === 'all' ? { color: 'white' } : {}}
      >
        All
      </Chip>
      {restaurant?.categories.map((category) => (
        <Chip
          key={category}
          mode={selectedCategory === category ? 'flat' : 'outlined'}
          onPress={() => setSelectedCategory(category)}
          style={selectedCategory === category ? styles.activeCategoryChip : styles.categoryChip}
          textStyle={selectedCategory === category ? { color: 'white' } : {}}
        >
          {category}
        </Chip>
      ))}
    </ScrollView>
  );

  const renderMenuItem = ({ item }: { item: FoodItem }) => (
    <Card style={styles.menuItemCard} mode="outlined">
      <Card.Content>
        <View style={styles.menuItemHeader}>
          <View style={styles.menuItemInfo}>
            <Text style={styles.menuItemName}>{item.name}</Text>
            <Text style={styles.menuItemDescription} numberOfLines={2}>
              {item.description}
            </Text>
            <Text style={styles.menuItemPrice}>₹{item.price}</Text>
          </View>
          
          <View style={styles.menuItemImage}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
          </View>
        </View>

        <View style={styles.menuItemFooter}>
          <View style={styles.menuItemTags}>
            {item.isVeg && (
              <Chip mode="flat" textStyle={{ color: 'white', fontSize: 10 }} style={styles.vegTag} compact>
                VEG
              </Chip>
            )}
            {item.isPopular && (
              <Chip mode="flat" textStyle={{ color: 'white', fontSize: 10 }} style={styles.popularTag} compact>
                POPULAR
              </Chip>
            )}
          </View>
          
          <Button
            mode="contained"
            onPress={() => handleAddToCart(item)}
            style={styles.addButton}
            compact
          >
            Add
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading restaurant...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!restaurant) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text>Restaurant not found</Text>
          <Button onPress={() => router.back()}>Go Back</Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-back"
          onPress={() => router.back()}
          iconColor="#333"
        />
        <Text style={styles.headerTitle}>Restaurant</Text>
        <IconButton
          icon="favorite-border"
          onPress={() => {}}
          iconColor="#333"
        />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderRestaurantHeader()}
        {renderCategoryFilter()}
        
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Menu</Text>
          <FlatList
            data={filteredMenuItems}
            renderItem={renderMenuItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    backgroundColor: 'white',
    elevation: 2,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  restaurantHeader: {
    backgroundColor: 'white',
    marginBottom: 8,
  },
  restaurantImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  restaurantInfo: {
    padding: 16,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  restaurantCuisine: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  restaurantStats: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  statSubtext: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  restaurantTags: {
    flexDirection: 'row',
    gap: 8,
  },
  vegChip: {
    backgroundColor: '#4CAF50',
  },
  openChip: {
    backgroundColor: '#4CAF50',
  },
  categoryFilter: {
    backgroundColor: 'white',
    marginBottom: 8,
  },
  categoryFilterContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryChip: {
    marginRight: 8,
  },
  activeCategoryChip: {
    backgroundColor: '#FF6B35',
  },
  menuSection: {
    backgroundColor: 'white',
    padding: 16,
  },
  menuSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  menuItemCard: {
    marginBottom: 12,
  },
  menuItemHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  menuItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  menuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemTags: {
    flexDirection: 'row',
    gap: 8,
  },
  vegTag: {
    backgroundColor: '#4CAF50',
  },
  popularTag: {
    backgroundColor: '#FF9800',
  },
  addButton: {
    backgroundColor: '#FF6B35',
  },
});