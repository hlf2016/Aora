import { useEffect, useState } from "react";
import { Alert } from "react-native";

const useAppwrite = (fn, deps = []) => {
  // console.log("deps", deps);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await fn();
      setData(data);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [...deps]);

  const refetchData = () => fetchData();

  return { data, isLoading, refetchData };
};

export default useAppwrite;
