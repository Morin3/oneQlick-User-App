import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Alert,
  Share,
  Modal,
} from 'react-native';
import {
  Text,
  Surface,
  Button,
  IconButton,
  Switch,
  Menu,
  Chip,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import {
  userProfile,
  profileSections,
} from './profileData';

export default function ProfileScreen() {
  const router = useRouter();
  
  // State management
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [locationServices, setLocationServices] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [offersPromotions, setOffersPromotions] = useState(true);
  const [appNotifications, setAppNotifications] = useState(false);

  // Why Choose Section
  const [showWhyChoose, setShowWhyChoose] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (showWhyChoose) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showWhyChoose]);

  // Animation values
  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startAnimations();
  }, []);

  const startAnimations = () => {
    Animated.timing(headerAnim, { 
      toValue: 1, 
      duration: 800, 
      useNativeDriver: true 
    }).start();
    
    Animated.timing(contentAnim, { 
      toValue: 1, 
      duration: 1000, 
      useNativeDriver: true 
    }).start();
  };

  const handleSectionPress = (section: any) => {
    switch (section.type) {
      case 'navigation':
        if (section.route) {
          if (section.route === '/profile/addresses') {
            router.push('/profile/addresses');
          } else if (section.route === '/profile/favorites') {
            router.push('/(tabs)/home');
          } else {
            router.push(section.route);
          }
        }
        break;
      
      case 'action':
        if (section.id === 'rate-app') {
          handleRateApp();
        } else if (section.id === 'share-app') {
          handleShareApp();
        }
        break;
      
      case 'select':
        if (section.id === 'language') {
          setShowLanguageMenu(true);
        }
        break;
    }
  };

  const handleRateApp = () => {
    Alert.alert(
      'Rate App',
      'Would you like to rate oneQlick on the app store?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Rate Now', 
          onPress: () => {
            Alert.alert('Thank You!', 'Rating feature coming soon!');
          }
        },
      ]
    );
  };

  const handleShareApp = () => {
    Share.share({
      message: 'Check out oneQlick - the best food delivery app! Download now.',
      title: 'oneQlick Food Delivery',
    });
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Logged Out', 'You have been successfully logged out.');
          }
        },
      ]
    );
  };

  const renderProfileHeader = () => (
    <Animated.View 
      style={[
        styles.profileHeader,
        {
          transform: [{
            translateY: headerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-100, 0],
            }),
          }],
        },
      ]}
    >
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{userProfile.name}</Text>
        <Text style={styles.userEmail}>{userProfile.email}</Text>
        <Text style={styles.userPhone}>{userProfile.phone}</Text>
      </View>
    </Animated.View>
  );

  const renderProfileSection = (section: any) => (
    <Pressable
      key={section.id}
      style={styles.sectionItem}
      onPress={() => handleSectionPress(section)}
    >
      <Surface style={styles.sectionSurface}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <MaterialIcons name={section.icon} size={24} color="#666" />
          </View>
          
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.subtitle && (
              <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
            )}
            {section.description && (
              <Text style={styles.sectionDescription}>{section.description}</Text>
            )}
          </View>
          
          <View style={styles.sectionActions}>
            {section.badge && (
              <Chip mode="flat" textStyle={{ color: 'white' }} style={styles.badgeChip} compact>
                {section.badge}
              </Chip>
            )}
            
            {section.type === 'toggle' && (
              <Switch
                value={section.value as boolean}
                onValueChange={(value) => {
                  switch (section.id) {
                    case 'order-updates':
                      setOrderUpdates(value);
                      break;
                    case 'offers-promotions':
                      setOffersPromotions(value);
                      break;
                    case 'app-notifications':
                      setAppNotifications(value);
                      break;
                    case 'location-services':
                      setLocationServices(value);
                      break;
                  }
                }}
                color="#FF6B35"
              />
            )}
            
            {section.type === 'select' && (
              <Text style={styles.selectValue}>{section.value}</Text>
            )}
            
            {(section.type === 'navigation' || section.type === 'action') && (
              <MaterialIcons name="chevron-right" size={24} color="#ccc" />
            )}
          </View>
        </View>
      </Surface>
    </Pressable>
  );

  const renderAppInfo = () => (
    <View style={styles.appInfo}>
      <Text style={styles.appInfoText}>App Version 1.0.0</Text>
      <Text style={styles.appInfoText}>© 2024 oneQlick. All rights reserved.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderProfileHeader()}
        
        <Animated.View style={[styles.content,{ opacity: contentAnim }]}>
          <View style={styles.sectionGroup}>
            <Text style={styles.sectionGroupTitle}>Personal Information</Text>
            {profileSections
              .filter(section => ['personal-info', 'change-password'].includes(section.id))
              .map(renderProfileSection)}
          </View>
          
          <View style={styles.sectionGroup}>
            <Text style={styles.sectionGroupTitle}>My Account</Text>
            {profileSections
              .filter(section => ['saved-addresses', 'payment-methods', 'favorite-restaurants'].includes(section.id))
              .map(renderProfileSection)}
          </View>
          
          <View style={styles.sectionGroup}>
            <Text style={styles.sectionGroupTitle}>Orders & History</Text>
            {profileSections
              .filter(section => ['order-history', 'track-orders'].includes(section.id))
              .map(renderProfileSection)}
          </View>
          
          <View style={styles.sectionGroup}>
            <Text style={styles.sectionGroupTitle}>Notifications</Text>
            {profileSections
              .filter(section => ['order-updates', 'offers-promotions', 'app-notifications'].includes(section.id))
              .map(renderProfileSection)}
          </View>
          
          <View style={styles.sectionGroup}>
            <Text style={styles.sectionGroupTitle}>Support</Text>
            {profileSections
              .filter(section => ['contact-us', 'rate-app'].includes(section.id))
              .map(renderProfileSection)}
          </View>
          
          <View style={styles.sectionGroup}>
            <Text style={styles.sectionGroupTitle}>Settings</Text>
            {profileSections
              .filter(section => ['language', 'location-services', 'data-usage'].includes(section.id))
              .map(renderProfileSection)}
          </View>
          
          {/* Why Choose Section */}
          <View style={styles.sectionGroup}>
            <Text style={styles.sectionGroupTitle}>About</Text>
            <Pressable
              style={styles.sectionItem}
              onPress={() => setShowWhyChoose(true)}
            >
              <Surface style={styles.sectionSurface}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionIcon}>
                    <MaterialIcons name="star" size={24} color="#666" />
                  </View>
                  <View style={styles.sectionContent}>
                    <Text style={styles.sectionTitle}>Why Choose OneClick?</Text>
                    <Text style={styles.sectionSubtitle}>See the best features</Text>
                  </View>
                  <View style={styles.sectionActions}>
                    <MaterialIcons name="chevron-right" size={24} color="#ccc" />
                  </View>
                </View>
              </Surface>
            </Pressable>
          </View>
          
          <View style={styles.sectionGroup}>
            <Text style={styles.sectionGroupTitle}>App</Text>
            <Pressable style={styles.sectionItem} onPress={handleShareApp}>
              <Surface style={styles.sectionSurface}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionIcon}>
                    <MaterialIcons name="share" size={24} color="#666" />
                  </View>
                  <View style={styles.sectionContent}>
                    <Text style={styles.sectionTitle}>Share App</Text>
                    <Text style={styles.sectionSubtitle}>Share oneQlick with friends & family</Text>
                  </View>
                  <View style={styles.sectionActions}>
                    <MaterialIcons name="chevron-right" size={24} color="#ccc" />
                  </View>
                </View>
              </Surface>
            </Pressable>
          </View>
          
          {renderAppInfo()}
          
          <Button
            mode="outlined"
            onPress={handleLogout}
            icon="logout"
            style={styles.logoutButton}
            textColor="#F44336"
            buttonColor="transparent"
          >
            Logout
          </Button>
          <View style={{ height: 40 }} />
        </Animated.View>
      </ScrollView>
      
      {/* Why Choose Modal */}
      <Modal
        transparent={true}
        visible={showWhyChoose}
        animationType="fade"
        onRequestClose={() => setShowWhyChoose(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}
          >
            <Text style={styles.modalTitle}>Why Choose OneClick?</Text>
            <View style={styles.featureBox}>
              <Ionicons name="fast-food-outline" size={28} color="#ff6600" />
              <Text style={styles.featureText}>Delicious food from top restaurants</Text>
            </View>
            <View style={styles.featureBox}>
              <Ionicons name="timer-outline" size={28} color="#ff6600" />
              <Text style={styles.featureText}>Super-fast delivery at your doorstep</Text>
            </View>
            <View style={styles.featureBox}>
              <Ionicons name="card-outline" size={28} color="#ff6600" />
              <Text style={styles.featureText}>Secure and easy payments</Text>
            </View>
            <Pressable onPress={() => setShowWhyChoose(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Modal>

      {/* Language Menu */}
      <Menu
        visible={showLanguageMenu}
        onDismiss={() => setShowLanguageMenu(false)}
        anchor={<View />}
      >
        <Menu.Item
          onPress={() => { setSelectedLanguage('English'); setShowLanguageMenu(false); }}
          title="English"
          leadingIcon="language"
        />
        <Menu.Item
          onPress={() => { setSelectedLanguage('Hindi'); setShowLanguageMenu(false); }}
          title="Hindi"
          leadingIcon="language"
        />
        <Menu.Item
          onPress={() => { setSelectedLanguage('Gujarati'); setShowLanguageMenu(false); }}
          title="Gujarati"
          leadingIcon="language"
        />
        <Menu.Item
          onPress={() => { setSelectedLanguage('Marathi'); setShowLanguageMenu(false); }}
          title="Marathi"
          leadingIcon="language"
        />
      </Menu>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollView: { flex: 1 },
  profileHeader: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    marginBottom: 20,
    elevation: 1,
  },
  userInfo: { alignItems: 'center' },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 8, textAlign: 'center' },
  userEmail: { fontSize: 16, color: '#666', marginBottom: 4, textAlign: 'center' },
  userPhone: { fontSize: 16, color: '#666', marginBottom: 16, textAlign: 'center' },
  content: { padding: 20, paddingTop: 0 },
  sectionGroup: { marginBottom: 20 },
  sectionGroupTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  sectionItem: { marginBottom: 10 },
  sectionSurface: { borderRadius: 10, elevation: 2, backgroundColor: '#fff' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, paddingBottom: 10 },
  sectionIcon: { width: 40, alignItems: 'center' },
  sectionContent: { flex: 1, marginLeft: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 2 },
  sectionSubtitle: { fontSize: 13, color: '#666', marginBottom: 2 },
  sectionDescription: { fontSize: 12, color: '#666', marginTop: 2 },
  sectionActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
  badgeChip: { backgroundColor: '#FF6B35' },
  selectValue: { fontSize: 14, color: '#666' },
  appInfo: { alignItems: 'center', paddingVertical: 20 },
  appInfoText: { fontSize: 12, color: '#999' },
  logoutButton: { borderColor: '#F44336' },

  // Modal Styles
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  featureBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  featureText: { marginLeft: 10, fontSize: 16 },
  closeButton: { marginTop: 15, textAlign: 'center', color: '#ff6600', fontWeight: 'bold' },
});
