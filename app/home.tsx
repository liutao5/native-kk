import { Link, useFocusEffect } from "@react-navigation/native";
import { Center, VStack, View } from "native-base";
import { useState } from "react";
import { StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";

async function getToken() {
  return await SecureStore.getItemAsync("token");
}

export default function HomeScreen({ navigation }: any) {
  const [loaded, setLoaded] = useState(false);

  useFocusEffect(() => {
    getToken().then((token) => {
      console.log(token);
      if (!token) {
        navigation.navigate("login");
      } else {
        setLoaded(true);
      }
    });
  });

  if (loaded) {
    return <Home />;
  }

  return null;
}

function Home() {
  return (
    <View style={styles.container}>
      <VStack w="90%" h="container" space={12}>
        <Link to={{ screen: "check" }}>
          <Center
            size={24}
            w="100%"
            bg="primary.500"
            rounded="sm"
            _text={{
              color: "white",
              fontWeight: "bold",
              fontSize: "3xl",
            }}
          >
            投料验收
          </Center>
        </Link>
        <Link to={{ screen: "inStock" }}>
          <Center
            size={24}
            w="100%"
            bg="secondary.500"
            rounded="sm"
            _text={{
              color: "white",
              fontWeight: "bold",
              fontSize: "3xl",
            }}
          >
            上架入库
          </Center>
        </Link>
        <Link to={{ screen: "outStock" }}>
          <Center
            size={24}
            w="100%"
            bg="primary.500"
            rounded="sm"
            _text={{
              color: "white",
              fontWeight: "bold",
              fontSize: "3xl",
            }}
          >
            下架出库
          </Center>
        </Link>
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
