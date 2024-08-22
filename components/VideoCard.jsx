import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Button,
  StyleSheet,
} from "react-native";
import { icons } from "../constants";
import { useState, useRef } from "react";
import { Video, ResizeMode } from "expo-av";
import { router } from "expo-router";

const VideoCard = ({ post: { video, thumbnail, title, creator } }) => {
  // console.log("creator", creator);
  video = "https://www.w3schools.com/html/mov_bbb.mp4";
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const menuRef = useRef(null);

  console.log("isDropDownVisible", isDropdownVisible);
  // console.log(menuRef.current);
  return (
    <View className="items-center px-4 mb-14">
      <View className="flex-row items-start gap-3">
        <View className="flex-row justify-center items-center flex-1">
          <TouchableOpacity
            className="w-[46px] h-[46px] rounded-lg border overflow-hidden border-secondary justify-center items-center"
            onPress={() =>
              router.push({
                pathname: "userProfile",
                params: {
                  userId: creator.$id,
                  avatar: creator.avatar,
                  username: creator.username,
                },
              })
            }
          >
            <Image
              source={{ uri: creator.avatar }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </TouchableOpacity>
          <View className="ml-3 justify-center flex-1 gap-y-1">
            {/* 最多显示1行 */}
            <Text
              numberOfLines={1}
              className="text-white font-semibold text-sm"
            >
              {title}
            </Text>
            <Text
              numberOfLines={1}
              className="text-xs text-gray-100 font-pregular"
            >
              {creator.username}
            </Text>
          </View>
        </View>
        <TouchableOpacity className="pt-2">
          <Image
            ref={menuRef}
            source={icons.menu}
            className="w-5 h-5"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      {isPlaying ? (
        <Video
          className="w-full h-60 rounded-xl mt-3"
          source={{ uri: video }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          usePoster
          posterSource={{ uri: thumbnail }}
          onPlaybackStatusUpdate={(status) => {
            // 监测到视频播放完毕
            if (status.didJustFinish) {
              setIsPlaying(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setIsPlaying(true)}
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            resizeMode="cover"
            className="w-full h-full rounded-xl mt-3"
          />
          <Image
            source={icons.play}
            className="absolute w-12 h-12"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
