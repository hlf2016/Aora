import { View, Text, FlatList, RefreshControl } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

import { searchPosts } from "../../lib/appwrite";
import useAppwrite from "../../hooks/useAppwrite";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetchData: refetchPosts } = useAppwrite(() =>
    searchPosts(query)
  );

  // 下拉刷新
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // 重新获取数据
    await refetchPosts();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => {
          // console.log(item);
          return <VideoCard post={item} />;
        }}
        ListHeaderComponent={() => (
          // space-y-6 是控制View 中子元素的间距 my-6 是控制View 的外边距
          <View className="my-6 px-4">
            <Text className="text-gray-100 font-pmedium text-sm">
              Search results
            </Text>
            <Text className="text-2xl font-psemibold text-white">{query}</Text>
            <View className="mt-6 mb-8">
              <SearchInput
                value={query}
                placeholder="Search for a video topic"
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found"
            subTitle="No results found for your search"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Search;
