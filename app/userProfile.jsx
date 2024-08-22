import { View, FlatList, RefreshControl, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";

import { getUserPosts } from "../lib/appwrite";
import useAppwrite from "../hooks/useAppwrite";
import EmptyState from "../components/EmptyState";
import VideoCard from "../components/VideoCard";
import InfoBox from "../components/InfoBox";

const UserProfile = () => {
  const { userId, avatar, username } = useLocalSearchParams();
  console.log("params", userId, 1);
  const { data: posts, refetchData: refetchPosts } = useAppwrite(
    () => getUserPosts(userId),
    [userId]
  );

  //   console.log("user", user)

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
          <View className="w-full justify-center items-center mt-6 mb-12 px-4">
            <View className="w-16 h-16 border border-secondary rounded-lg overflow-hidden justify-center items-center">
              <Image
                source={{ uri: avatar }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <InfoBox
              title={username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />
            <View className="flex-row mt-5">
              <InfoBox
                title={posts.length || 0}
                subtitle={"Posts"}
                titleStyles="text-xl"
                containerStyles={"mr-10"}
              />
              <InfoBox
                title={"1.2k"}
                subtitle={"Followers"}
                titleStyles="text-xl"
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

export default UserProfile;
