import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Box,
  Button,
  ChevronRightIcon,
  Divider,
  FormControl,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  Modal,
  Pressable,
  ScrollView,
  Spacer,
  Text,
  VStack,
  View,
  useToast,
} from "native-base";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { getOutList, getOutStock, outOrder } from "../utils/request";
import { useFocusEffect } from "@react-navigation/native";

// interface Recipe {
//   totalNumber: number;
//   doneNumber: number;
//   recipeName: string;
//   recipeId: string;
// }

interface codeProp {
  code: string; // 吨包号
  binCode: string; // 库位码
}

interface Recipe {
  id: number;
  orderId: number;
  recipeId: number;
  recipeName: string;
  doneNumber: number;
  totalNumber: number;
  codes: codeProp[];
  orderCode: string;
}

interface OutStock {
  id: number;
  orderCode: string;
  items: Recipe[];
}

export default function OutStockScreen({ navigation }: any) {
  const [orderList, setOrderList] = useState<OutStock[]>([]);
  // const [filter, setFilter] = useState("");
  const [mxs, setMxs] = useState();

  useFocusEffect(
    useCallback(() => {
      getOutStock().then((res) => {
        if (res.code === 200) {
          setOrderList(res.data);
        }
      });
    }, [])
  );

  // const handleChange = (text: string) => {
  //   setFilter(text);
  // };

  // const handlePress = (data: OutStock) => {
  //   navigation.navigate("order", {
  //     mxs: data.items,
  //     outOrderId: data.id,
  //   });
  // };

  // const { mxs, outOrderId } = route.params as {
  //   mxs: Recipe[];
  //   outOrderId: string;
  // };
  const [open, setOpen] = useState(false);
  const [binCode, setBinCode] = useState("");
  const [stockCode, setStockCode] = useState("");
  const [outOrderId, setOutCodeId] = useState<number>();
  const [dataList, setDataList] = useState<Recipe[]>([]);
  const [filter, setFilter] = useState("");

  const toast = useToast();

  const handleClose = () => {
    setOpen(false);
    setBinCode("");
    setStockCode("");
    setOutCodeId(undefined);
  };

  useEffect(() => {
    if (orderList) {
      console.log("orderList", orderList);
      let orderIdList: number[] = [];
      let orderCodeList: string[] = [];
      orderList.forEach((order) => {
        order.items.forEach((item) => {
          orderCodeList.push(order.orderCode);
          orderIdList.push(order.id);
        });
      });
      Promise.all(
        orderList
          .map((order) => order.items)
          .flat()
          .map((mx: Recipe) => getOutList({ recipeId: mx.recipeId }))
      ).then((res) => {
        if (res.every((r) => r.code === 200)) {
          setDataList(
            orderList
              .map((order) => order.items)
              .flat()
              .map((mx, index) => ({
                ...mx,
                orderId: orderIdList[index],
                orderCode: orderCodeList[index],
                codes: res[index].data.map((s: codeProp) => ({
                  code: s.code,
                  binCode: s.binCode,
                })),
              }))
          );
        }
      });
    }
  }, [orderList]);

  const handleChange = (text: string) => {
    setFilter(text);
  };

  const handleSubmit = () => {
    outOrder({ outOrderId, binCode, stockCode }).then((res) => {
      if (res.code === 200) {
        toast.show({
          placement: "top",
          duration: 2000,
          render: () => {
            return (
              <Box bg="success.400" px="2" py="1" rounded="sm" mb={5}>
                <Text color="white">下架成功</Text>
              </Box>
            );
          },
        });
        handleClose();
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
    <ScrollView>
      <Box style={styles.container} bgColor="info.700">
        <VStack space={4} alignItems="center">
          <InputGroup w="99%" bg="white">
            <Input
              w="90%"
              placeholder="配方名、吨包号、库位码"
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
                data.recipeName.includes(filter) ||
                data.codes.some(
                  (code) =>
                    code.binCode.includes(filter) || code.code.includes(filter)
                )
            )
            .map((mx) => (
              <Box w="99%" key={mx.id}>
                <Box overflow="hidden" shadow="3" p="2" bg="white">
                  <VStack>
                    <HStack>
                      <Heading size="sm">{mx.recipeName}</Heading>
                      <Spacer />
                      <Text color="amber.500">
                        {mx.totalNumber}/{mx.doneNumber}吨包
                      </Text>
                    </HStack>
                    <Text>{mx.orderCode}</Text>
                    <VStack>
                      {mx.codes.map((code) => (
                        <Pressable
                          key={code.code}
                          onPress={() => {
                            setOutCodeId(mx.orderId);
                            setBinCode(code.binCode);
                            setStockCode(code.code);
                            setOpen(true);
                          }}
                          borderWidth="1"
                          rounded="8"
                          borderColor="coolGray.300"
                          shadow="3"
                          bg="white"
                          p="3"
                          m="1"
                        >
                          <HStack>
                            <Text>
                              {code.binCode}-{code.code}
                            </Text>
                          </HStack>
                        </Pressable>
                      ))}
                    </VStack>
                  </VStack>
                </Box>
              </Box>
            ))}
        </VStack>
      </Box>
      <Modal isOpen={open} onClose={handleClose}>
        <Modal.Content maxW="100%" w="100%" marginBottom={0} marginTop={"auto"}>
          <Modal.CloseButton />
          <Modal.Header>下架拣选</Modal.Header>
          <Modal.Body>
            <FormControl.Label>库位码</FormControl.Label>
            <InputGroup w="99%" bg="white">
              <Input
                w="90%"
                placeholder=""
                value={binCode}
                onChangeText={(text) => setBinCode(text)}
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
            <FormControl.Label>吨包号</FormControl.Label>
            <InputGroup w="99%" bg="white">
              <Input
                w="90%"
                placeholder=""
                value={stockCode}
                onChangeText={(text) => setStockCode(text)}
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
          </Modal.Body>
          <Modal.Footer>
            <Button w="100%" onPress={handleSubmit} bgColor="#4aa9ff">
              下架
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
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
