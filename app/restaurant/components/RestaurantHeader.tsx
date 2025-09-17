import React from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import { Text, Surface, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { DesignSystem } from '../../../constants/designSystem';
import { GlobalStyles } from '../../../styles/globalStyles';
import { AppIcon } from '../../../components/ui';
import { RestaurantData } from '../restaurantData';

interface RestaurantHeaderProps {
  restaurant: RestaurantData;
}

export default function RestaurantHeader({ restaurant }: RestaurantHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.restaurantHeader}>
      {/* Hero Image with Gradient Overlay */}
      <View style={styles.heroImageContainer}>
        <Image 
          source={{ uri: restaurant.bannerImage }} 
          style={styles.heroImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
          style={styles.heroGradient}
        />
        
        {/* Back Button */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Surface style={styles.backButtonSurface}>
            <AppIcon.ArrowLeft size={20} color={DesignSystem.colors.text.primary} />
          </Surface>
        </Pressable>

        {/* Favorite Button */}
        <Pressable style={styles.favoriteButton}>
          <Surface style={styles.favoriteButtonSurface}>
            <AppIcon.FavoriteOutline size={20} color={DesignSystem.colors.text.primary} />
          </Surface>
        </Pressable>
      </View>

      {/* Restaurant Info Card */}
      <Surface style={styles.restaurantInfoCard} elevation={4}>
        <View style={styles.restaurantInfo}>
          <View style={styles.restaurantTitleRow}>
            <View style={styles.restaurantTitleContainer}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <View style={styles.cuisineContainer}>
                {restaurant.cuisine.map((cuisine) => (
                  <Text key={cuisine} style={styles.cuisineText}>
                    {cuisine} • 
                  </Text>
                ))}
              </View>
            </View>
            <View style={styles.ratingContainer}>
              <View style={styles.ratingBadge}>
                <AppIcon.Star size={16} color={DesignSystem.colors.text.inverse} />
                <Text style={styles.ratingText}>{restaurant.rating}</Text>
              </View>
              <Text style={styles.ratingCount}>({restaurant.totalRatings})</Text>
            </View>
          </View>

          {/* Key Stats */}
          <View style={styles.keyStats}>
            <View style={styles.statItem}>
              <AppIcon.Time size={16} color={DesignSystem.colors.text.secondary} />
              <Text style={styles.statText}>{restaurant.deliveryTime}</Text>
            </View>
            
            <View style={styles.statItem}>
              <AppIcon.Delivery size={16} color={DesignSystem.colors.text.secondary} />
              <Text style={styles.statText}>₹{restaurant.deliveryFee} delivery</Text>
            </View>
            
            <View style={styles.statItem}>
              <AppIcon.Location size={16} color={DesignSystem.colors.text.secondary} />
              <Text style={styles.statText}>{restaurant.distance}</Text>
            </View>
          </View>

          {/* Restaurant Tags */}
          <View style={styles.restaurantTags}>
            <Chip 
              mode="flat" 
              textStyle={styles.chipText} 
              style={styles.openChip}
              icon="check-circle"
            >
              Open Now
            </Chip>
            <Chip 
              mode="outlined" 
              textStyle={styles.chipTextOutlined} 
              style={styles.costChip}
            >
              ₹{restaurant.costForTwo} for two
            </Chip>
          </View>

          {/* Address */}
          <View style={styles.addressContainer}>
            <AppIcon.Location size={16} color={DesignSystem.colors.text.secondary} />
            <Text style={styles.addressText}>{restaurant.address}</Text>
          </View>
        </View>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  restaurantHeader: {
    marginBottom: DesignSystem.spacing.sm,
  },
  heroImageContainer: {
    position: 'relative',
    height: 280,
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
});
