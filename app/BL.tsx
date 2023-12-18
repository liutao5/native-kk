import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import {
  Box,
  Button,
  Checkbox,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  Pressable,
  ScrollView,
  Text,
  VStack,
  useToast,
} from "native-base";
import { useState } from "react";
import { checkBl } from "../utils/request";

export interface MX {
  id: number;
  mxCode: string;
  hasChecked: boolean;
}

export default function BL({ navigation, route }: any) {
  const [dataList, setDataList] = useState<MX[]>(
    route.params.BL.items.filter((item: MX) => !item.hasChecked)
  );
  const [checkList, setCheckList] = useState<number[]>([]);

  const toast = useToast();

  const handleChange = (text: string) => {
    const findItem = dataList.find((data) => data.mxCode === text);
    if (findItem && !checkList.includes(findItem.id)) {
      setCheckList([...checkList, findItem.id]);
    }
  };

  const handlePress = (id: number) => {
    if (checkList.includes(id)) {
      setCheckList(checkList.filter((c) => c !== id));
    } else {
      setCheckList([...checkList, id]);
    }
  };

  const handleCheck = () => {
    checkBl(checkList).then((res) => {
      if (res.code === 200) {
        toast.show({
          placement: "top",
          duration: 2000,
          render: () => {
            return (
              <Box bg="success.400" px="2" py="1" rounded="sm" mb={5}>
                <Text color="white">投料成功</Text>
              </Box>
            );
          },
        });
        navigation.navigate("check");
      } else {
        toast.show({
          placement: "top",
          duration: 2000,
          render: () => {
            return (
              <Box bg="error.500" px="2" py="1" rounded="sm" mb={5}>
                <Text color="white">{res.msg}</Text>
              </Box>
            );
          },
        });
      }
    });
  };

  return (
    <Box style={styles.container} bgColor="info.700">
      <ScrollView>
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
          {dataList.map((data: MX) => (
            <Box w="99%" key={data.id}>
              <Pressable
                onPress={() => handlePress(data.id)}
                rounded="8"
                overflow="hidden"
                borderWidth="1"
                borderColor="coolGray.300"
                shadow="3"
                bg="white"
                p="3"
              >
                <HStack alignItems="center" space={1}>
                  <Checkbox
                    value="test"
                    isChecked={checkList.includes(data.id)}
                  />
                  <Heading size="md">{data.mxCode}</Heading>
                </HStack>
              </Pressable>
            </Box>
          ))}
        </VStack>
      </ScrollView>
      <Button style={styles.bottom} onPress={handleCheck} bgColor="#4aa9ff">
        投料
      </Button>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    display: "flex",
    backgroundColor: "info.700",
  },
  box: {
    backgroundColor: "#ffffff",
  },
  input: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "100%",
  },
  bottom: {
    position: "fixed",
    bottom: 0,
    top: "auto",
    width: "100%",
  },
});
