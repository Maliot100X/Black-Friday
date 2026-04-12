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
import { Search, Filter, Tag, TrendingDown, Store, Heart } from 'lucide-react-native';

interface Deal {
  id: number;
  title: string;
  description: string;
  original_price: number;
  discount_price: number;
  discount_percentage: number;
  category: string;
  store_name: string;
}

const allDeals: Deal[] = [
  { id: 1, title: "50% Off Laptops", description: "Get 50% off all laptop models", original_price: 899.99, discount_price: 449.99, discount_percentage: 50, category: "Electronics", store_name: "Anhoch" },
  { id: 2, title: "30% Off Smartphones", description: "All smartphones discounted", original_price: 699.99, discount_price: 489.99, discount_percentage: 30, category: "Electronics", store_name: "TechnoMarket" },
  { id: 3, title: "40% Off TVs", description: "4K Smart TVs on sale", original_price: 1200.00, discount_price: 720.00, discount_percentage: 40, category: "Electronics", store_name: "Neptun" },
  { id: 4, title: "Gaming Laptop Special", description: "High-performance gaming laptops", original_price: 1999.99, discount_price: 1299.99, discount_percentage: 35, category: "Gaming", store_name: "Anhoch" },
  { id: 5, title: "Budget Tablet Deals", description: "Tablets under $300", original_price: 449.99, discount_price: 249.99, discount_percentage: 45, category: "Electronics", store_name: "TechnoMarket" },
  { id: 6, title: "Kitchen Appliances", description: "Blenders and mixers on sale", original_price: 199.99, discount_price: 99.99, discount_percentage: 50, category: "Home", store_name: "Neptun" },
];

const categories = ['All', 'Electronics', 'Gaming', 'Home'];

export default function DealsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [savedDeals, setSavedDeals] = useState<number[]>([]);

  const filteredDeals = allDeals.filter((deal) => {
    const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || deal.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleSaveDeal = (dealId: number) => {
    setSavedDeals((prev) =>
      prev.includes(dealId) ? prev.filter((id) => id !== dealId) : [...prev, dealId]
    );
  };

  const renderDeal = ({ item }: { item: Deal }) => (
    <TouchableOpacity style={styles.dealCard}>
      {/* Image Placeholder */}
      <View style={styles.dealImage}>
        <Tag color="#9CA3AF" size={40} />
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => toggleSaveDeal(item.id)}
        >
          <Heart
            color={savedDeals.includes(item.id) ? '#DC2626' : '#9CA3AF'}
            fill={savedDeals.includes(item.id) ? '#DC2626' : 'none'}
            size={24}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.dealContent}>
        <View style={styles.dealHeader}>
          <Text style={styles.storeName}>{item.store_name}</Text>
          <Text style={styles.category}>{item.category}</Text>
        </View>

        <Text style={styles.dealTitle}>{item.title}</Text>
        <Text style={styles.dealDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.discountPrice}>${item.discount_price.toFixed(2)}</Text>
          <Text style={styles.originalPrice}>${item.original_price.toFixed(2)}</Text>
        </View>

        <View style={styles.dealFooter}>
          <View style={styles.discountBadge}>
            <TrendingDown color="#fff" size={14} />
            <Text style={styles.discountText}>{item.discount_percentage}% OFF</Text>
          </View>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Deals</Text>
      </View>

      {/* Search */}
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

      {/* Categories */}
      <View style={styles.categoriesContainer}>
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
      </View>

      {/* Results Count */}
      <Text style={styles.resultsText}>
        Showing {filteredDeals.length} of {allDeals.length} deals
      </Text>

      {/* Deals List */}
      <FlatList
        data={filteredDeals}
        renderItem={renderDeal}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.dealsList}
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
  categoriesContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#DC2626',
  },
  categoryText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#fff',
  },
  resultsText: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: '#6B7280',
    fontSize: 14,
  },
  dealsList: {
    padding: 16,
  },
  dealCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
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
    position: 'relative',
  },
  heartButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 2,
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
    marginBottom: 4,
  },
  dealDescription: {
    fontSize: 14,
    color: '#6B7280',
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
