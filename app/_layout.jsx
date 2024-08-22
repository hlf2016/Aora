import { StyleSheet, Text, View } from "react-native";
import { Slot, SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import GlobalProvider from "../contexts/GloabalProvider";

// 防止在静态资源加载前 隐藏闪屏 直到 hideAsync 被主动调用
SplashScreen.preventAutoHideAsync();

// 所有页面共享的布局
// 使用插槽<Slot />是其中一种方式 https://docs.expo.dev/router/layouts/
// 还有一种方式试试用 <Stack /> https://docs.expo.dev/router/advanced/stack/
const RootLayout = () => {
  // 加载字体 https://docs.expo.dev/develop/user-interface/fonts/#with-usefonts-hook
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    // console.log(fontsLoaded, error)
    if (fontsLoaded || error) {
      // expo-splash-screen 库提供了 SplashScreen 组件，您可以使用它来阻止应用程序的渲染，直到字体加载并准备就绪。
      // 字体加载完毕 或者 出错的情况下 关闭 SplashScreen
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <>
      {/* <Text>Header</Text>
        <Slot />
        <Text>Footer</Text> */}
      <GlobalProvider>
        <Stack>
          {/* headerShown 默认为 true 控制是否显示 页面 头部 头部主要内容为 组件名称   */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="search/[query]"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="userProfile" options={{ headerShown: false }} />
        </Stack>
      </GlobalProvider>
    </>
  );
};

export default RootLayout;
