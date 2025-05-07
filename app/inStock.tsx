import {
  Box,
  Button,
  FormControl,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  Radio,
  ScrollView,
  Spacer,
  Switch,
  Text,
  VStack,
  View,
  WarningIcon,
  useToast,
} from "native-base";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { cancelBl, getInStock, shelve } from "../utils/request";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface InStock {
  id: number;
  code: string;
  recommendBinCode: string;
}

export default function InStockScreen() {
  const [dataList, setDataList] = useState<InStock[]>([]);
  const [filter, setFilter] = useState("");
  const [stockCode, setStockCode] = useState("");
  const [binCode, setBinCode] = useState("");
  const [backStock, setBackStock] = useState(false);
  const [blId, setBlId] = useState<number>();
  const [open, setOpen] = useState(false);

  const toast = useToast();

  useEffect(() => {
    getInStock().then((res) => {
      if (res.code === 200) {
        setDataList(res.data);
      }
    });
  }, []);

  const handleClose = () => {
    setOpen(false);
    setBinCode("");
  };

  const handleChange = (text: string) => {
    setFilter(text);
  };

  const handlePress = (data: InStock) => {
    setStockCode(data.code);
    setBinCode(data.recommendBinCode);
    setBlId(data.id);
    setOpen(true);
  };

  const handleChangeBinCode = (text: string) => {
    setBinCode(text);
  };

  const handleSubmit = () => {
    shelve({ binCode, stockCode, backStock }).then((res) => {
      if (res.code === 200) {
        handleClose();
        toast.show({
          placement: "top",
          duration: 2000,
          render: () => {
            return (
              <Box bg="success.400" px="2" py="1" rounded="sm" mb={5}>
                <Text color="white">{res.msg}</Text>
              </Box>
            );
          },
        });
        getInStock().then((res) => {
          if (res.code === 200) {
            setDataList(res.data);
          }
        });
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

  const handleCancel = () => {
    if (blId) {
      cancelBl(blId).then((res) => {
        if (res.code === 200) {
          handleClose();
          toast.show({
            placement: "top",
            duration: 2000,
            render: () => {
              return (
                <Box bg="success.400" px="2" py="1" rounded="sm" mb={5}>
                  <Text color="white">{res.msg}</Text>
                </Box>
              );
            },
          });
          getInStock().then((res) => {
            if (res.code === 200) {
              setDataList(res.data);
            }
          });
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
    }
  };

  return (
    <ScrollView>
      <KeyboardAvoidingView behavior="height">
        <Box style={styles.container} bgColor="info.700">
          <VStack space={4} alignItems="center">
            <InputGroup w="99%" bg="white">
              <Input
                // autoFocus
                w="90%"
                placeholder="BL吨包号"
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
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="flex-start"
              alignItems="center"
              w="95%"
            >
              <WarningIcon />
              <Text color="#999999" py={0}>
                无推荐仓位时！请关注，仓库物资积压过多，无仓位!
              </Text>
            </Box>
            {dataList
              .filter((data) => data.code.includes(filter))
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
                    p="5"
                  >
                    <HStack alignItems="center">
                      <Heading size="sm">{data.code}</Heading>
                      <Spacer />
                      <Text color="gray.400">
                        推荐仓位：
                        <Text color="amber.500">
                          {data.recommendBinCode || "无"}
                        </Text>
                      </Text>
                    </HStack>
                  </Pressable>
                </Box>
              ))}
          </VStack>
        </Box>
        {open && (
          <Modal
            isOpen={open}
            onClose={handleClose}
            _overlay={{
              useRNModal: false,
              useRNModalOnAndroid: false,
            }}
          >
            <Modal.Content
              maxW="100%"
              w="100%"
              style={{ marginBottom: 0, marginTop: "auto" }}
            >
              <Modal.CloseButton />
              <Modal.Header>{stockCode}</Modal.Header>
              <Modal.Body>
                <HStack space={2}>
                  <Text w="10%">库位码</Text>
                  <InputGroup w="90%" bg="white">
                    <Input
                      w="90%"
                      placeholder=""
                      // autoFocus
                      value={binCode}
                      onChangeText={handleChangeBinCode}
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
                </HStack>
                <HStack space={2} style={{ paddingTop: 20 }}>
                  <Text w="10%">是否入库</Text>
                  <Switch
                    value={backStock}
                    onToggle={(value) => setBackStock(value)}
                  />
                </HStack>
              </Modal.Body>
              <Modal.Footer>
                <Button.Group space={2}>
                  <Button
                    onPress={handleCancel}
                    variant="ghost"
                    colorScheme="blueGray"
                    w="50%"
                  >
                    报废
                  </Button>
                  <Button onPress={handleSubmit} w="50%" bgColor="#4aa9ff">
                    上架
                  </Button>
                </Button.Group>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        )}
      </KeyboardAvoidingView>
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
