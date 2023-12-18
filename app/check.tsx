import { StyleSheet } from "react-native";
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
  useToast,
} from "native-base";
import { useCallback, useState } from "react";
import { getBl } from "../utils/request";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { MX } from "./BL";

export interface Check {
  id: number;
  batchCode: string;
  items: MX[];
  mxNumber: number;
}

export default function CheckScreen({ navigation }: any) {
  const [dataList, setDataList] = useState<Check[]>([]);
  const [filter, setFilter] = useState("");
  const toast = useToast();

  const handleChange = (text: string) => {
    setFilter(text);
  };

  const handlePress = (data: Check) => {
    navigation.navigate("BL", { BL: data });
  };

  useFocusEffect(
    useCallback(() => {
      getBl({ status: 0 }).then((res) => {
        if (res.code === 200) {
          setDataList(res.data);
        } else {
          toast.show({
            title: "查询失败",
            placement: "top",
          });
        }
      });
    }, [])
  );
  return (
    <ScrollView>
      <Box style={styles.container} bgColor="info.700">
        <VStack space={4} alignItems="center">
          <InputGroup w="99%" bg="white">
            <Input
              w="90%"
              placeholder="BL批次,MX批次"
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
                data.batchCode.includes(filter) ||
                data.items.some((mx) => mx.mxCode.includes(filter))
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
                  <Box>
                    <HStack alignItems="center">
                      <Heading size="md">{data.batchCode}</Heading>
                      <Spacer />
                      <ChevronRightIcon />
                    </HStack>
                    <Divider />
                    <HStack justifyContent="space-between">
                      <Text color="gray.400">
                        申请量：
                        <Text color="amber.500">{data.mxNumber}吨包</Text>
                      </Text>

                      <Text color="gray.400">
                        待验收：
                        <Text color="amber.500">
                          {
                            data.items.filter((item: any) => !item.hasChecked)
                              .length
                          }
                          吨包
                        </Text>
                      </Text>
                      <Text color="green.500">{data.mxNumber}吨搅拌机验收</Text>
                    </HStack>
                  </Box>
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
