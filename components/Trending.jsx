import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useState } from "react";
import { Video, ResizeMode } from "expo-av";
import { icons } from "../constants";

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1,
  },
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

const TrendingCard = ({ activeItem, post }) => {
  post.video = "https://www.w3schools.com/html/mov_bbb.mp4";

  const [isPlaying, setIsPlaying] = useState(false);
  // console.log(post.video);
  return (
    <Animatable.View
      className="mr-5"
      duration={500}
      animation={activeItem === post.$id ? zoomIn : zoomOut}
    >
      {isPlaying ? (
        // 测试视频 https://www.w3schools.com/html/mov_bbb.mp4
        <Video
          className="w-52 h-72 rounded-[33px] mt-3 bg-white/10"
          source={{ uri: post.video }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          usePoster
          posterSource={{ uri: post.thumbnail }}
          onPlaybackStatusUpdate={(status) => {
            // 监测到视频播放完毕
            if (status.didJustFinish) {
              setIsPlaying(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className="justify-center items-center relative"
          activeOpacity={0.7}
          onPress={() => setIsPlaying(true)}
        >
          <ImageBackground
            source={{ uri: post.thumbnail }}
            className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
          />
          <Image source={icons.play} className="w-12 h-12 absolute" />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[0]?.$id);
  const viewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      // console.log(viewableItems[0]["item"]);
      // 此处的 key 也就是 post 中的 $id
      setActiveItem(viewableItems[0].key);
    }
  };
  return (
    <FlatList
      data={posts ?? []}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingCard activeItem={activeItem} post={item} />
      )}
      horizontal
      showsHorizontalScrollIndicator={true}
      onViewableItemsChanged={viewableItemsChanged}
      // itemVisiblePercentThreshold 默认值是 50 用于判断元素是否可见 设置为 70 就表示当 元素的 70% 可见时才会触发可视状态
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      // 启示可见位置偏移 三个元素 x 方向偏移 可以让初始可见元素为中间那个
      contentOffset={{ x: 155 }}
    />
  );
};

export default Trending;
