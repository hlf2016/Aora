import { View, Text, ScrollView, Image, Alert } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";

import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";

import { signIn, getCurrentUser } from "../../lib/appwrite";
import { useGlobalContext } from "../../contexts/GloabalProvider";

const SignIn = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // 控制表单按钮的提交状态
  const [isLoading, setIsLoading] = useState(false);

  const submit = async () => {
    const { email, password } = form;
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setIsLoading(true);
    try {
      await signIn(email, password);
      // 全局登录状态更新
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsLoggedIn(true);

      Alert.alert("Success", "Sign in successfully");
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="h-full bg-primary">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full min-h-[82vh] justify-center px-4 my-6">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />
          <Text className="text-2xl text-white text-semibold font-psemibold mt-10">
            Sign in
          </Text>
          <FormField
            title="Email"
            otherStyles="mt-7"
            keyboardType="email-address"
            value={form.email}
            handleChange={(email) => setForm({ ...form, email: email })}
          />
          <FormField
            title="Password"
            otherStyles="mt-7"
            isPassword={true}
            value={form.password}
            handleChange={(password) =>
              setForm({ ...form, password: password })
            }
          />
          <CustomButton
            title="Sign in"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isLoading}
          />
          <View className="flex-row justify-center gap-2 mt-5">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg text-secondary font-psemibold"
            >
              Sign up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
