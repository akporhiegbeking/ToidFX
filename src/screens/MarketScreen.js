import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  SafeAreaView,
  TextInput,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState, useCallback, useMemo, useRef, Suspense } from "react";
import { responsiveScreenWidth } from "react-native-responsive-dimensions";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { currencyConverterStyles } from "../styles/CurrencyConverterStyle";
import { marketStyles } from "../styles/MarketStyles";
import ColorTheme from "../config/ColorTheme";
import ListItem from "../components/ListItem"; // Memoized component
const ChartComponent = React.lazy(() => import("../components/ChartComponent"));

// --------------------------------------------------------------------
// SAMPLE DATA
// --------------------------------------------------------------------
import { getMarketData } from "../api/CryptoService";

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const MarketScreen = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCoinData, setSelectedCoinData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ["45%"], []);

  // Fetch Market Data
  const fetchMarketData = async () => {
    setIsLoading(true);
    const marketData = await getMarketData();
    setData(marketData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMarketData();
  }, []);


  // Handle Search Query
  const handleSearchQueryChange = useCallback(
    debounce((query) => {
      setSearchQuery(query);
      if (query.trim() !== "") {
        const results = data.filter((coin) =>
          coin.name.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }, 300),
    [data]
  );

  const openModal = useCallback((item) => {
    setSelectedCoinData(item);
    bottomSheetModalRef.current?.present();
    setTimeout(() => {
      setIsOpen(true);
    }, 5);
  }, []);

  const MemoizedListItem = React.memo(ListItem); // Memoize ListItem component

  // Refresh function
  const onRefresh = async () => {
    setIsRefreshing(true);  // Set refreshing state to true
    await fetchMarketData(); // Re-fetch data
    setIsRefreshing(false); // Set refreshing state to false after data is fetched
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={ColorTheme.primary} />
      </SafeAreaView>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: isOpen ? "grey" : "white" }}
      >
        {/* Title */}
        <View style={[marketStyles.flexStart, { padding: 20 }]}>
          <Text style={marketStyles.largeTitle}>Market</Text>
        </View>

        {/* Search Input */}
        <View style={[marketStyles.flexCenter, { paddingHorizontal: 10 }]}>
          <TextInput
            style={currencyConverterStyles.input}
            placeholder="Search coin"
            placeholderTextColor={ColorTheme.grey}
            value={searchQuery}
            onChangeText={handleSearchQueryChange}
          />
        </View>

        {/* Coin List */}
        <View style={{ flex: 1 }}>
          <FlatList
            keyExtractor={(item) => item.id}
            data={searchQuery !== "" ? searchResults : data}
            renderItem={({ item }) => (
              <MemoizedListItem
                name={item.name}
                symbol={item.symbol}
                currentPrice={item.current_price}
                logoUrl={item.image}
                priceChangePercentage7d={item.price_change_percentage_7d_in_currency}
                onPress={() => openModal(item)}
              />
            )}
            initialNumToRender={10} // Limit initial items to improve performance
            windowSize={5} // Render fewer items offscreen
            removeClippedSubviews={true} // Unmount items outside the viewport
            getItemLayout={(data, index) => ({
              length: 100, // Fixed item height
              offset: 100 * index, // Distance from top
              index,
            })}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}  // Bind refreshing state
                onRefresh={onRefresh}  // Call onRefresh function when user swipes
                colors={[ColorTheme.primary]}  // Set the refresh control color
              />
            }
          />
        </View>

        {/* Bottom Modal */}
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          backgroundStyle={{ borderRadius: responsiveScreenWidth(5) }}
          onDismiss={() => setIsOpen(false)}
        >
          <Suspense fallback={<ActivityIndicator size="large" color={ColorTheme.primary} />}>
            {selectedCoinData && (
              <ChartComponent
                currentPrice={selectedCoinData.current_price}
                logoUrl={selectedCoinData.image}
                name={selectedCoinData.name}
                symbol={selectedCoinData.symbol}
                high_24h={selectedCoinData.high_24h}
                low_24h={selectedCoinData.low_24h}
                price_change_24h={selectedCoinData.price_change_24h}
                price_change_percentage_24h={selectedCoinData.price_change_percentage_24h}
                priceChangePercentage7d={
                  selectedCoinData.price_change_percentage_7d_in_currency
                }
                sparkLine={selectedCoinData.sparkline_in_7d.price}
              />
            )}
          </Suspense>
        </BottomSheetModal>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default MarketScreen;
