import { Link } from "@react-navigation/native";
import { Center, Flex, Text, View } from "native-base";
import { StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Flex direction="row" justifyContent="space-around" w="90%">
        <Link to={{ screen: "check" }}>
          <Center
            size={16}
            bg="primary.500"
            rounded="sm"
            _text={{
              color: "white",
              fontWeight: "medium",
            }}
          >
            投料验收
          </Center>
        </Link>
        <Link to={{ screen: "inStock" }}>
          <Center
            size={16}
            bg="secondary.500"
            rounded="sm"
            _text={{
              color: "white",
              fontWeight: "medium",
            }}
          >
            上架入库
          </Center>
        </Link>
        <Link to={{ screen: "outStock" }}>
          <Center
            size={16}
            bg="primary.500"
            rounded="sm"
            _text={{
              color: "white",
              fontWeight: "medium",
            }}
          >
            下架出库
          </Center>
        </Link>
      </Flex>
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
