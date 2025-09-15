import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuthZustand';
import { useAppStore } from '../store/appStore';
import { Text } from 'react-native-paper';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { isOnboardingComplete, isFirstLaunch } = useAppStore();

  useEffect(() => {
    if (!isLoading) {
      if (isFirstLaunch || !isOnboardingComplete) {
        // First time user - show onboarding
        router.replace('/onboarding');
      } else if (isAuthenticated) {
        // User is logged in - go to main app
        router.replace('/(tabs)/home');
      } else {
        // User has seen onboarding but not logged in - go to auth
        router.replace('/(auth)/login');
      }
    }
  }, [isOnboardingComplete, isFirstLaunch, isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF6B35' }}>
        <ActivityIndicator size="large" color="white" />
        <Text style={{ marginTop: 16, color: 'white', fontSize: 18, fontWeight: '600' }}>
          Loading oneQlick...
        </Text>
      </View>
    );
  }

  return null;
} 