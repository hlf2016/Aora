import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, View, Image } from "react-native";
import { Link, router, Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import CustomButton from "../components/CustomButton";
import { useGlobalContext } from "../contexts/GloabalProvider";

export default App = () => {
  const { isLoading, isLoggedIn } = useGlobalContext();
  //   区别总结
  // 方式：<Redirect /> 是声明式的，而router.push 是程序式的。
  // 触发时机：<Redirect /> 在组件渲染时触发，router.push 在函数调用时触发。
  // 使用场景：<Redirect /> 更适合在JSX中基于条件的重定向，而router.push 更适合在事件处理或其他逻辑中进行导航。
  if (!isLoading && isLoggedIn) {
    return <Redirect href="/home" />;
  }
  return (
    // 保障 各种 型号的手机 有刘海或者虚拟按键的 都可以看到完整内容
    <SafeAreaView className="h-full bg-primary">
      {/* 适配小屏幕手机 产生滚动条 看到完整内容 */}
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full min-h-[85vh] items-center justify-center px-4">
          <Image
            source={images.logo}
            className="w-[130px] h-[84px]"
            alt="logo"
            resizeMode="contain"
          />

          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[300px]"
            alt="cards"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Discover Endless Possibilities with
              <Text className="text-secondary-200"> Aora</Text>
            </Text>
            <Image
              source={images.path}
              resizeMode="contain"
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
            />
          </View>
          <Text className="text-sm text-gray-100 text-center mt-7 font-pregular">
            Where creativity meets innovation: embark on a journey of limitless
            exploration with Aora
          </Text>
          <CustomButton
            title="Continue with Email"
            containerStyles="w-full mt-7"
            handlePress={() => router.push("/sign-in")}
          />
        </View>
      </ScrollView>
      {/* 自定义状态栏样式 当背景是深色时 设置样式 为 light 首页设置一次 跳到其他页面也是好使的*/}
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};
