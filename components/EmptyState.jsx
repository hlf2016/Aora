import { View, Text, Image } from "react-native";
import { images } from "../constants";
import CustomButton from "./CustomButton";
import { router } from "expo-router";

const EmptyState = ({ title, subTitle }) => {
  return (
    <View className="justify-center items-center px-4">
      <Image
        source={images.empty}
        className="w-[270px] h-[216px]"
        resizeMode="contain"
      />

      <Text className="text-xl font-psemibold text-white text-center mt-2">
        {title}
      </Text>
      <Text className="text-gray-100 font-pmedium text-sm">{subTitle}</Text>
      <CustomButton
        title="Create video"
        containerStyles="w-full my-5"
        handlePress={() => router.push("/create")}
      />
    </View>
  );
};

export default EmptyState;
