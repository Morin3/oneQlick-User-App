import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Direct to login screen immediately
    router.replace('/(auth)/login');
  }, [router]);

  return null;
} 