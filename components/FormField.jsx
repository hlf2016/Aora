import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import { useState } from "react";

import { icons } from "../constants";

const FormField = ({
  title,
  value,
  handleChange,
  otherStyles,
  placeholder,
  isPassword = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View className="w-full border-2 px-4 h-16 rounded-2xl border-black-200 bg-black-100 items-center focus:border-secondary flex-row">
        <TextInput
          className="flex-1 text-base font-psemibold w-full text-white"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChange}
          secureTextEntry={isPassword && !showPassword}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="h-full justify-center items-center"
          >
            <Image
              source={showPassword ? icons.eyeHide : icons.eye}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
