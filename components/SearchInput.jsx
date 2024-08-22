import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import { useState } from "react";
import { usePathname, router } from "expo-router";

import { icons } from "../constants";

const SearchInput = ({ value, otherStyles, placeholder }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(value || "");
  return (
    <View
      className={`w-full border-2 px-4 h-16 rounded-2xl border-black-200 bg-black-100 items-center focus:border-secondary flex-row space-x-4 ${otherStyles}`}
    >
      <TextInput
        className="flex-1 text-base w-full text-white font-pregular"
        value={query}
        placeholder={placeholder}
        placeholderTextColor="#CDCDE0"
        onChangeText={(query) => setQuery(query)}
      />
      <TouchableOpacity
        onPress={() => {
          if (!query) {
            Alert.alert("Missing query", "Please enter a search query");
            return;
          }
          if (pathname === "/search") {
            router.setParams({ query });
          } else {
            router.push(`/search/${query}`);
          }
        }}
      >
        <Image
          source={icons.search}
          className="w-5 h-full"
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
