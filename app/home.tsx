import { Link, useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { Center, HStack, Image, View } from "native-base";
import { useState } from "react";
import { StyleSheet } from "react-native";

async function getToken() {
  return await SecureStore.getItemAsync("token");
}

export default function HomeScreen({ navigation }: any) {
  const [loaded, setLoaded] = useState(false);

  useFocusEffect(() => {
    getToken().then((token) => {
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
      <HStack w="90%" flexWrap="wrap">
        <Link to={{ screen: "check" }}>
          <Center padding={6}>
            <Image source={require('../assets/images/menu1.png')} />
            投料验收
          </Center>
        </Link>
        <Link to={{ screen: "inStock" }}>
          <Center padding={6}>
            <Image source={require('../assets/images/menu3.png')} />
            上架入库
          </Center>
        </Link>
        <Link to={{ screen: "outStock" }}>
          <Center padding={6}>
            <Image source={require('../assets/images/menu2.png')} />
            下架出库
          </Center>
        </Link>
        <Link to={{ screen: "quickReturn" }}>
          <Center padding={6}>
            <Image source={require('../assets/images/menu4.png')} />
            快速返库
          </Center>
        </Link>
      </HStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
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
