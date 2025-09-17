import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DesignSystem } from '../../constants/designSystem';
import { GlobalStyles } from '../../styles/globalStyles';
import { AppIcon } from '../ui';

export interface Review {
  id: string | number;
  reviewerName: string;
  rating: number;
  comment: string;
  date?: string;
  order?: string;
  location?: string;
  bgColor?: string;
}

interface ReviewsProps {
  reviews: Review[];
  title?: string;
  showCount?: boolean;
  maxReviews?: number;
  variant?: 'card' | 'list';
  showOrderInfo?: boolean;
  showLocation?: boolean;
  horizontal?: boolean;
}

export default function Reviews({
  reviews,
  title = "Customer Reviews",
  showCount = true,
  maxReviews,
  variant = 'list',
  showOrderInfo = false,
  showLocation = false,
  horizontal = false
}: ReviewsProps) {
  const displayReviews = maxReviews ? reviews.slice(0, maxReviews) : reviews;

  const renderStars = (rating: number) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <AppIcon.Star
        key={star}
        size={12}
        color={star <= rating ? DesignSystem.colors.warning : DesignSystem.colors.neutral[300]}
      />
    ));
  };

  const renderReviewCard = (review: Review, index: number) => {
    if (variant === 'card') {
      return (
        <View key={review.id} style={[styles.testimonialCard, { marginLeft: index === 0 ? 16 : 8, marginRight: 8 }]}>
          <View style={styles.quoteIcon}>
            <MaterialCommunityIcons 
              name="format-quote-open" 
              size={20} 
              color={review.bgColor || DesignSystem.colors.primary[500]} 
            />
          </View>
          
          <Text style={styles.testimonialText}>"{review.comment}"</Text>
          
          <View style={styles.testimonialFooter}>
            <View style={[styles.userAvatar, { backgroundColor: review.bgColor || DesignSystem.colors.primary[500] }]}>
              <Text style={styles.userInitial}>{review.reviewerName.charAt(0)}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{review.reviewerName}</Text>
              <View style={styles.ratingContainer}>
                {renderStars(review.rating)}
              </View>
              {(showOrderInfo && review.order) && (
                <Text style={styles.orderInfo}>
                  Ordered {review.order}
                  {showLocation && review.location && ` • ${review.location}`}
                </Text>
              )}
            </View>
          </View>
        </View>
      );
    }

    return (
      <View key={review.id} style={styles.reviewItem}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewerName}>{review.reviewerName}</Text>
          <View style={styles.reviewRating}>
            {renderStars(review.rating)}
          </View>
        </View>
        <Text style={styles.reviewComment}>{review.comment}</Text>
        {review.date && <Text style={styles.reviewDate}>{review.date}</Text>}
      </View>
    );
  };

  const renderReviewItem = (review: Review) => {
    return (
      <View key={review.id} style={styles.reviewItem}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewerName}>{review.reviewerName}</Text>
          <View style={styles.reviewRating}>
            {renderStars(review.rating)}
          </View>
        </View>
        <Text style={styles.reviewComment}>{review.comment}</Text>
        {review.date && <Text style={styles.reviewDate}>{review.date}</Text>}
      </View>
    );
  };

  const renderReviews = () => {
    if (horizontal) {
      return (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalContainer}
        >
          {displayReviews.map((review, index) => renderReviewCard(review, index))}
          <View style={{ width: 16 }} />
        </ScrollView>
      );
    }

    return (
      <View style={styles.verticalContainer}>
        {displayReviews.map((review, index) => 
          variant === 'card' 
            ? renderReviewCard(review, index)
            : renderReviewItem(review)
        )}
      </View>
    );
  };

  return (
    <Surface style={styles.reviewsSection} elevation={1}>
      <View style={styles.reviewsHeader}>
        <Text style={styles.reviewsTitle}>{title}</Text>
        {showCount && (
          <Text style={styles.reviewsCount}>({reviews.length})</Text>
        )}
      </View>
      
      {renderReviews()}
    </Surface>
  );
}

const styles = StyleSheet.create({
  reviewsSection: {
    backgroundColor: DesignSystem.colors.background.primary,
    marginHorizontal: DesignSystem.spacing.md,
    marginBottom: DesignSystem.spacing.md,
    borderRadius: DesignSystem.borderRadius.lg,
    padding: DesignSystem.spacing.lg,
  },
  reviewsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.md,
  },
  reviewsTitle: {
    ...GlobalStyles.typography.h4,
    color: DesignSystem.colors.text.primary,
  },
  reviewsCount: {
    ...GlobalStyles.typography.body2,
    color: DesignSystem.colors.text.secondary,
    marginLeft: DesignSystem.spacing.xs,
  },
  
  // Vertical List Styles
  verticalContainer: {
    gap: DesignSystem.spacing.md,
  },
  reviewItem: {
    marginBottom: DesignSystem.spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.xs,
  },
  reviewerName: {
    ...GlobalStyles.typography.body1,
    color: DesignSystem.colors.text.primary,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
    flex: 1,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: DesignSystem.spacing.sm,
  },
  reviewComment: {
    ...GlobalStyles.typography.body2,
    color: DesignSystem.colors.text.secondary,
    marginBottom: DesignSystem.spacing.xs,
  },
  reviewDate: {
    ...GlobalStyles.typography.caption,
    color: DesignSystem.colors.text.disabled,
  },

  // Horizontal Card Styles
  horizontalContainer: {
    paddingRight: DesignSystem.spacing.md,
  },
  testimonialCard: {
    backgroundColor: DesignSystem.colors.background.secondary,
    borderRadius: DesignSystem.borderRadius.lg,
    padding: DesignSystem.spacing.lg,
    width: 280,
    borderWidth: 1,
    borderColor: DesignSystem.colors.border.light,
  },
  quoteIcon: {
    alignSelf: 'flex-start',
    marginBottom: DesignSystem.spacing.sm,
  },
  testimonialText: {
    ...GlobalStyles.typography.body2,
    color: DesignSystem.colors.text.primary,
    lineHeight: 22,
    fontStyle: 'italic',
    fontWeight: DesignSystem.typography.fontWeight.medium,
    marginBottom: DesignSystem.spacing.lg,
  },
  testimonialFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: DesignSystem.spacing.sm,
  },
  userInitial: {
    ...GlobalStyles.typography.h5,
    color: DesignSystem.colors.text.inverse,
    fontWeight: DesignSystem.typography.fontWeight.bold,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...GlobalStyles.typography.body1,
    color: DesignSystem.colors.text.primary,
    fontWeight: DesignSystem.typography.fontWeight.bold,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 4,
  },
  orderInfo: {
    ...GlobalStyles.typography.caption,
    color: DesignSystem.colors.text.secondary,
    fontWeight: DesignSystem.typography.fontWeight.medium,
  },
});
