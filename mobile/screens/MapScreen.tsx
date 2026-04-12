import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Slider,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Circle } from 'react-native-maps';
import { Search, Filter, Store, MapPin, ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const SKOPJE_REGION = {
  latitude: 41.9981,
  longitude: 21.4254,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const dealLocations = [
  { id: 1, title: "50% Off Laptops", store: "Anhoch", lat: 41.9949, lng: 21.4310, discount: 50 },
  { id: 2, title: "30% Off Smartphones", store: "TechnoMarket", lat: 41.9981, lng: 21.4254, discount: 30 },
  { id: 3, title: "40% Off TVs", store: "Neptun", lat: 41.9865, lng: 21.4380, discount: 40 },
  { id: 4, title: "Grocery Special", store: "Super Vero", lat: 42.0005, lng: 21.4130, discount: 33 },
  { id: 5, title: "Mall Sale", store: "Ramstore", lat: 41.9910, lng: 21.4450, discount: 70 },
];

export default function MapScreen() {
  const navigation = useNavigation();
  const [radius, setRadius] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDeal, setSelectedDeal] = useState<number | null>(null);

  const categories = ['all', 'Electronics', 'Groceries', 'Mall'];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Map Radar</Text>
      </View>

      <View style={styles.content}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>Find Deals Near You</Text>

          {/* Search */}
          <View style={styles.searchBar}>
            <Search color="#9CA3AF" size={20} />
            <Text style={styles.searchText}>Search location...</Text>
          </View>

          {/* Radius */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Radius: {radius} km</Text>
            {/* Note: Slider would need @react-native-community/slider package */}
            <View style={styles.radiusButtons}>
              {[5, 10, 20, 50].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.radiusButton, radius === r && styles.radiusButtonActive]}
                  onPress={() => setRadius(r)}
                >
                  <Text style={[styles.radiusText, radius === r && styles.radiusTextActive]}>
                    {r}km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Categories */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryButton, selectedCategory === cat && styles.categoryButtonActive]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Deals List */}
          <Text style={styles.dealsListTitle}>{dealLocations.length} Deals Found</Text>
          <ScrollView style={styles.dealsList}>
            {dealLocations.map((deal) => (
              <TouchableOpacity
                key={deal.id}
                style={[styles.dealItem, selectedDeal === deal.id && styles.dealItemSelected]}
                onPress={() => setSelectedDeal(deal.id)}
              >
                <View style={styles.dealItemHeader}>
                  <Text style={styles.dealItemTitle}>{deal.title}</Text>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountBadgeText}>{deal.discount}%</Text>
                  </View>
                </View>
                <Text style={styles.dealItemStore}>
                  <Store size={12} color="#6B7280" /> {deal.store}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Map */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={SKOPJE_REGION}
          >
            {/* User Location Marker */}
            <Marker
              coordinate={{ latitude: SKOPJE_REGION.latitude, longitude: SKOPJE_REGION.longitude }}
              pinColor="#3B82F6"
            >
              <View style={styles.userMarker}>
                <MapPin color="#3B82F6" size={24} />
              </View>
            </Marker>

            {/* Radius Circle */}
            <Circle
              center={{ latitude: SKOPJE_REGION.latitude, longitude: SKOPJE_REGION.longitude }}
              radius={radius * 1000}
              fillColor="rgba(220, 38, 38, 0.1)"
              strokeColor="rgba(220, 38, 38, 0.3)"
              strokeWidth={2}
            />

            {/* Deal Markers */}
            {dealLocations.map((deal) => (
              <Marker
                key={deal.id}
                coordinate={{ latitude: deal.lat, longitude: deal.lng }}
                onPress={() => setSelectedDeal(deal.id)}
              >
                <View style={[
                  styles.dealMarker,
                  selectedDeal === deal.id && styles.dealMarkerSelected
                ]}>
                  <Text style={styles.dealMarkerText}>{deal.discount}%</Text>
                </View>
              </Marker>
            ))}
          </MapView>

          {/* Map Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#DC2626' }]} />
              <Text style={styles.legendText}>Deal</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
              <Text style={styles.legendText}>You</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 320,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    padding: 16,
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  searchText: {
    marginLeft: 8,
    color: '#9CA3AF',
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  radiusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  radiusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  radiusButtonActive: {
    backgroundColor: '#DC2626',
  },
  radiusText: {
    fontSize: 12,
    color: '#374151',
  },
  radiusTextActive: {
    color: '#fff',
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#DC2626',
  },
  categoryText: {
    fontSize: 12,
    color: '#374151',
  },
  categoryTextActive: {
    color: '#fff',
  },
  dealsListTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  dealsList: {
    flex: 1,
  },
  dealItem: {
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dealItemSelected: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  dealItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dealItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
  },
  discountBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  dealItemStore: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  userMarker: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 3,
  },
  dealMarker: {
    backgroundColor: '#DC2626',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  dealMarkerSelected: {
    backgroundColor: '#111827',
    transform: [{ scale: 1.2 }],
  },
  dealMarkerText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  legend: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#374151',
  },
});
