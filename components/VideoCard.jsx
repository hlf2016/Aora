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

import { collectVideo } from "../lib/appwrite";

const VideoCard = ({ post, isCollected = false }) => {
  let { video, thumbnail, title, creator } = post;
  // console.log("creator", creator);
  console.log("post", post.users);
  video = "https://www.w3schools.com/html/mov_bbb.mp4";
  const [isPlaying, setIsPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({});
  const menuRef = useRef(null);

  const showActions = () => {
    if (!visible) {
      // console.log(menuRef.current);
      // fx 和 fy: 组件相对于父元素的左上角位置。
      // width 和 height: 组件的宽度和高度。
      // px 和 py: 组件相对于整个屏幕的左上角位置（绝对位置）。
      menuRef.current.measure((fx, fy, width, height, px, py) => {
        setPosition({ right: 15, top: py + height + 10 });
      });
      setVisible(true);
    }
  };

  const collect = async () => {
    // 这里要先隐藏 api 请求比较慢会造成延迟
    setVisible(false);
    await collectVideo(post);
  };

  const delPost = (id) => {
    console.log(id);
    setVisible(false);
  };
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
        <TouchableOpacity className="pt-2" onPress={() => showActions()}>
          <Image
            ref={menuRef}
            source={icons.menu}
            className="w-5 h-5"
            resizeMode="contain"
          />
        </TouchableOpacity>
        {visible && (
          <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            // 适用于 安卓 返回按键 ios 不适用
            onRequestClose={() => setVisible(false)}
          >
            <TouchableOpacity
              onPressOut={() => setVisible(false)}
              activeOpacity={1}
              className="flex-1"
            >
              <View
                className={`bg-primary py-3 px-6 rounded-md space-y-3 justify-center items-center absolute border-black-100 border-2`}
                style={position}
              >
                <TouchableOpacity
                  onPress={isCollected ? () => {} : collect}
                  className="flex-row gap-1 w-[80px] justify-start items-center"
                >
                  <Image
                    source={icons.bookmark}
                    className="w-3 h-3"
                    resizeMode="contain"
                  />
                  <Text className="text-gray-100 font-pmedium">
                    {isCollected ? "Saved" : "Save"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={delPost}
                  className="flex-row gap-1 w-[80px] justify-start items-center"
                >
                  <Image
                    source={icons.bookmark}
                    className="w-3 h-3"
                    resizeMode="contain"
                  />
                  <Text className="text-gray-100 font-pmedium">Delete</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        )}
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
