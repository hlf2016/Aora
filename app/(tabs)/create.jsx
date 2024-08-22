import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import { useState } from "react";
import { icons } from "../../constants";
import { Video, ResizeMode } from "expo-av";
import CustomButton from "../../components/CustomButton";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useGlobalContext } from "../../contexts/GloabalProvider";
import { createVideoPost } from "../../lib/appwrite";
import { router } from "expo-router";

const Create = () => {
  const { user } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  const openPicker = async (selectType) => {
    const isImage = selectType === "image";
    const isVideo = selectType === "video";

    console.log(status);
    if (!status.granted) {
      const permissionResponse = await requestPermission();
      if (!permissionResponse.granted) {
        Alert.alert(
          "Permission Denied",
          "You need to grant permission to access the media library."
        );
        return;
      }
    }
    // const result = await DocumentPicker.getDocumentAsync({
    //   type: isImage ? ["image/png", "image/jpg"] : ["video/mp4", "video/gif"],
    // });

    // 使用 expo-image-picker 替换 DocumentPicker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: isImage
        ? ImagePicker.MediaTypeOptions.Images
        : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      if (isImage) {
        setForm({ ...form, thumbnail: result["assets"][0] });
      }

      if (isVideo) {
        setForm({ ...form, video: result["assets"][0] });
      }
    } else {
      // setTimeout(() => {
      //   Alert.alert("Document picked", JSON.stringify(result, null, 2));
      // }, 100);
      console.log("没选择文件");
    }
  };

  const submit = async () => {
    if (
      (form.prompt === "") |
      (form.title === "") |
      !form.thumbnail |
      !form.video
    ) {
      return Alert.alert("Please provide all fields");
    }
    setIsLoading(true);
    try {
      await createVideoPost({
        ...form,
        userId: user.$id,
      });
      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Upload Video</Text>
        <FormField
          title="Video Title"
          value={form.title}
          placeholder="Give your video a catchy title..."
          handleChange={(title) => setForm({ ...form, title })}
          otherStyles="mt-10"
        />
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>
          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                className="w-full h-64 rounded-2xl"
                useNativeControls
                resizeMode={ResizeMode.COVER}
                isLooping
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl border border-black-200 justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="cover"
                    alt="upload"
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>
          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full px-4 h-16 bg-black-100 rounded-2xl border-2 border-black-200 justify-center items-center flex-row space-x-2">
                <Image
                  source={icons.upload}
                  className="w-5 h-5"
                  alt="upload"
                  resizeMode="contain"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <FormField
          title="AI Prompt"
          value={form.prompt}
          otherStyles="mt-7"
          placeholder="The AI prompt of your video...."
          handleChange={(prompt) => setForm({ ...form, prompt })}
        />
        <CustomButton
          containerStyles="mt-7"
          title="Submit & Publish"
          handlePress={submit}
          isLoading={isLoading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
