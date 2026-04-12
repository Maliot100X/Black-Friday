import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Tag, Bell, ShoppingBag, TrendingDown } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface Deal {
  id: number;
  title: string;
  store_name: string;
  original_price: number;
  discount_price: number;
  discount_percentage: number;
  category: string;
}

const featuredDeals: Deal[] = [
  {
    id: 1,
    title: "50% Off Laptops",
    store_name: "Anhoch Skopje",
    original_price: 899.99,
    discount_price: 449.99,
    discount_percentage: 50,
    category: "Electronics",
  },
  {
    id: 2,
    title: "30% Off Smartphones",
    store_name: "TechnoMarket",
    original_price: 699.99,
    discount_price: 489.99,
    discount_percentage: 30,
    category: "Electronics",
  },
  {
    id: 3,
    title: "40% Off TVs",
    store_name: "Neptun",
    original_price: 1200.00,
    discount_price: 720.00,
    discount_percentage: 40,
    category: "Electronics",
  },
];

const categories = [
  { name: 'Electronics', icon: '📱' },
  { name: 'Gaming', icon: '🎮' },
  { name: 'Home', icon: '🏠' },
  { name: 'Fashion', icon: '👕' },
  { name: 'Food', icon: '🍔' },
  { name: 'All', icon: '✨' },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState<string>('Skopje');

  const onRefresh = () => {
    setRefreshing(true);
    // Fetch fresh deals
    setTimeout(() => setRefreshing(false), 1500);
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <ShoppingBag color="#DC2626" size={28} />
          <Text style={styles.logoText}>MK Black Friday</Text>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notifications' as never)}
        >
          <Bell color="#374151" size={24} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search color="#9CA3AF" size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search deals..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Location Banner */}
        <View style={styles.locationBanner}>
          <MapPin color="#DC2626" size={18} />
          <Text style={styles.locationText}>{userLocation}</Text>
          <TouchableOpacity style={styles.changeLocationButton}>
            <Text style={styles.changeLocationText}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>500+</Text>
            <Text style={styles.statLabel}>Deals</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>50+</Text>
            <Text style={styles.statLabel}>Stores</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>70%</Text>
            <Text style={styles.statLabel}>Max Off</Text>
          </View>
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((cat, index) => (
            <TouchableOpacity key={index} style={styles.categoryCard}>
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text style={styles.categoryName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Deals */}
        <View style={styles.dealsHeader}>
          <Text style={styles.sectionTitle}>Featured Deals</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Deals' as never)}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {featuredDeals.map((deal) => (
          <TouchableOpacity key={deal.id} style={styles.dealCard}>
            {/* Deal Image Placeholder */}
            <View style={styles.dealImage}>
              <Tag color="#9CA3AF" size={40} />
            </View>

            <View style={styles.dealContent}>
              <View style={styles.dealHeader}>
                <Text style={styles.storeName}>{deal.store_name}</Text>
                <Text style={styles.category}>{deal.category}</Text>
              </View>

              <Text style={styles.dealTitle}>{deal.title}</Text>

              <View style={styles.priceContainer}>
                <Text style={styles.discountPrice}>{formatPrice(deal.discount_price)}</Text>
                <Text style={styles.originalPrice}>{formatPrice(deal.original_price)}</Text>
              </View>

              <View style={styles.dealFooter}>
                <View style={styles.discountBadge}>
                  <TrendingDown color="#fff" size={14} />
                  <Text style={styles.discountText}>{deal.discount_percentage}% OFF</Text>
                </View>
                <TouchableOpacity style={styles.viewButton}>
                  <Text style={styles.viewButtonText}>View</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Bottom Padding */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 8,
  },
  notificationButton: {
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#DC2626',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#374151',
  },
  locationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#FEF2F2',
  },
  locationText: {
    marginLeft: 6,
    color: '#374151',
    fontWeight: '500',
  },
  changeLocationButton: {
    marginLeft: 12,
  },
  changeLocationText: {
    color: '#DC2626',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  dealsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  seeAllText: {
    color: '#DC2626',
    fontWeight: '500',
  },
  dealCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  dealImage: {
    height: 140,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dealContent: {
    padding: 16,
  },
  dealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  storeName: {
    fontSize: 12,
    color: '#6B7280',
  },
  category: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  discountPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  originalPrice: {
    fontSize: 14,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  dealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  viewButton: {
    backgroundColor: '#111827',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
