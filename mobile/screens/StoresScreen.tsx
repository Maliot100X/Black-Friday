import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Store, MapPin, Phone } from 'lucide-react-native';

interface StoreData {
  id: number;
  name: string;
  category: string;
  address: string;
  phone: string;
  dealCount: number;
}

const stores: StoreData[] = [
  { id: 1, name: "TechnoMarket Skopje", category: "Electronics", address: "Boulevard Partizanski Odredi 20", phone: "+389 2 123 4567", dealCount: 12 },
  { id: 2, name: "Anhoch Skopje", category: "Electronics", address: "Boulevard Ilinden 100", phone: "+389 2 765 4321", dealCount: 8 },
  { id: 3, name: "Neptun Skopje City Mall", category: "Electronics", address: "Boulevard Partizanski Odredi 14", phone: "+389 2 987 6543", dealCount: 15 },
  { id: 4, name: "Super Vero Skopje", category: "Supermarket", address: "Boulevard Goce Delcev 40", phone: "+389 2 345 6789", dealCount: 5 },
  { id: 5, name: "Ramstore Mall", category: "Mall", address: "Boulevard Aleksandar Makedonski 10", phone: "+389 2 567 8901", dealCount: 25 },
];

export default function StoresScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStore = ({ item }: { item: StoreData }) => (
    <TouchableOpacity style={styles.storeCard}>
      <View style={styles.storeHeader}>
        <View style={styles.storeIcon}>
          <Store color="#DC2626" size={24} />
        </View>
        <View style={styles.storeInfo}>
          <Text style={styles.storeName}>{item.name}</Text>
          <Text style={styles.storeCategory}>{item.category}</Text>
        </View>
      </View>

      <View style={styles.storeDetails}>
        <View style={styles.detailRow}>
          <MapPin color="#6B7280" size={16} />
          <Text style={styles.detailText}>{item.address}</Text>
        </View>
        <View style={styles.detailRow}>
          <Phone color="#6B7280" size={16} />
          <Text style={styles.detailText}>{item.phone}</Text>
        </View>
      </View>

      <View style={styles.storeFooter}>
        <Text style={styles.dealCount}>{item.dealCount} active deals</Text>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View Deals</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Partner Stores</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search color="#9CA3AF" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search stores..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Stores List */}
      <FlatList
        data={filteredStores}
        renderItem={renderStore}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.storesList}
        showsVerticalScrollIndicator={false}
      />
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
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
  storesList: {
    padding: 16,
  },
  storeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  storeIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeInfo: {
    marginLeft: 12,
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  storeCategory: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  storeDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  storeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  dealCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  viewButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
