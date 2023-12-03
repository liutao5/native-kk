import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Box,
  ChevronRightIcon,
  Divider,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  Pressable,
  ScrollView,
  Spacer,
  Text,
  VStack,
  View,
} from "native-base";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { getOutStock } from "../utils/request";

interface Recipe {
  totalNumber: number;
  doneNumber: number;
  recipeName: string;
}

interface OutStock {
  id: number;
  orderCode: string;
  items: Recipe[];
}

export default function OutStockScreen({ navigation }: any) {
  const [dataList, setDataList] = useState<OutStock[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    getOutStock().then((res) => {
      if (res.code === 200) {
        setDataList(res.data);
      }
    });
  }, []);

  const handleChange = (text: string) => {
    setFilter(text);
  };

  const handlePress = (data: OutStock) => {
    console.log(data);
    navigation.navigate("order", {
      mxs: JSON.stringify(data.items),
      outOrderId: data.id,
    });
  };

  return (
    <ScrollView>
      <Box style={styles.container} bgColor="info.700">
        <VStack space={4} alignItems="center">
          <InputGroup w="99%" bg="white">
            <Input
              w="90%"
              placeholder="任务号、配方名"
              onChangeText={handleChange}
            />
            <InputRightAddon
              children={
                <MaterialCommunityIcons
                  name="line-scan"
                  size={24}
                  color="black"
                />
              }
            />
          </InputGroup>
          {dataList
            .filter(
              (data) =>
                data.orderCode.includes(filter) ||
                data.items.some((d) => d.recipeName.includes(filter))
            )
            .map((data) => (
              <Box w="99%" key={data.id}>
                <Pressable
                  onPress={() => handlePress(data)}
                  rounded="8"
                  overflow="hidden"
                  borderWidth="1"
                  borderColor="coolGray.300"
                  shadow="3"
                  bg="white"
                  p="3"
                >
                  <VStack>
                    <HStack>
                      <Heading size="sm">{data.orderCode}</Heading>
                      <Spacer />
                      <ChevronRightIcon />
                    </HStack>
                    <Divider />
                    <HStack justifyContent="space-between">
                      <Text color="gray.400">
                        申请量：
                        <Text color="amber.500">
                          {data.items
                            .map((item) => item.totalNumber)
                            .reduce((pre, current) => pre + current)}
                          吨包
                        </Text>
                      </Text>

                      <Text color="gray.400">
                        待下架：
                        <Text color="amber.500">
                          {data.items
                            .map((item) => item.totalNumber - item.doneNumber)
                            .reduce((pre, current) => pre + current)}
                          吨包
                        </Text>
                      </Text>
                      <Text color="green.500">标准出库</Text>
                    </HStack>
                  </VStack>
                </Pressable>
              </Box>
            ))}
        </VStack>
      </Box>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    display: "flex",
    backgroundColor: "info.700",
  },
});
