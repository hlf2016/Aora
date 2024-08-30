import { View, Text, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useState } from "react";

import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";
import { getCollectVideos } from "../../lib/appwrite";
import useAppwrite from "../../hooks/useAppwrite";

const Bookmark = () => {
  const { data: posts, refetchData } = useAppwrite(getCollectVideos);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => {
          // console.log(item);
          return <VideoCard post={item} isCollected={true} />;
        }}
        ListHeaderComponent={() => (
          // space-y-6 是控制View 中子元素的间距 my-6 是控制View 的外边距
          <View className="my-6 px-4">
            <Text className="text-2xl text-white font-psemibold">
              Saved Videos
            </Text>
            <View className="mt-6 mb-8">
              <SearchInput placeholder="Search your saved videos" />
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

export default Bookmark;
