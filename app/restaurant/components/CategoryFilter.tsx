import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { DesignSystem } from '../../../constants/designSystem';
import { GlobalStyles } from '../../../styles/globalStyles';
import { AppIcon } from '../../../components/ui';
import { MenuCategory } from '../restaurantData';

interface CategoryFilterProps {
  categories: MenuCategory[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  onScrollToCategory: (categoryId: string) => void;
}

export default function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategorySelect, 
  onScrollToCategory 
}: CategoryFilterProps) {
  const handleCategoryPress = (categoryId: string) => {
    onCategorySelect(categoryId);
    onScrollToCategory(categoryId);
  };

  return (
    <View style={styles.categoryFilter}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryFilterContent}
      >
        {categories.map((category) => (
          <Pressable
            key={category.id}
            onPress={() => handleCategoryPress(category.id)}
            style={[
              styles.categoryItem,
              selectedCategory === category.id && styles.activeCategoryItem
            ]}
          >
            <View style={styles.categoryContent}>
              <AppIcon.Restaurant 
                size={18} 
                color={selectedCategory === category.id 
                  ? DesignSystem.colors.text.inverse 
                  : DesignSystem.colors.text.secondary
                } 
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.activeCategoryText
              ]}>
                {category.name}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
