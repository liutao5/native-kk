import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Box,
  Button,
  Center,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  ScrollView,
  Switch,
  Text,
  VStack,
  useToast
} from "native-base";
import { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { returnBl } from "../utils/request";
  
  interface QuickReturn {
    id: number;
    code: string;
    recommendBinCode: string;
  }
  
  export default function QuickReturnScreen() {
    const [stockCode, setStockCode] = useState("");
    const [binCode, setBinCode] = useState("");
    const [backStock, setBackStock] = useState(true);
  
    const toast = useToast();
  
    const handleSubmit = () => {
      returnBl({ binCode, stockCode, backStock }).then((res) => {
        if (res.code === 200) {
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
      <SafeAreaView style={{flex:1}}>
      <ScrollView flex={1}>
          <Box style={styles.container} bgColor="info.700">
            <VStack space={4} alignItems="center" h="100%">
            <HStack w="99%" space={2} alignItems="center">
              <Text w="20%">BL吨包号</Text>
              <InputGroup w="80%" bg="white">
                <Input
                  w="88%"
                  placeholder="BL吨包号"
                  onChangeText={value => setStockCode(value)}
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
              <HStack w="99%" space={2} alignItems="center">
                <Text w="20%">目标仓位</Text>
                <InputGroup w="80%" bg="white">
                  <Input
                    w="88%"
                    placeholder="目标仓位"
                    onChangeText={value => setBinCode(value)}
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
              <HStack w="99%" space={2} style={{ paddingTop: 20 }}>
                  <Text w="20%">余料返库</Text>
                  <Switch
                    size="lg"
                    value={backStock}
                    onToggle={(value) => setBackStock(value)}
                  />
                </HStack>
            </VStack>
          </Box>
          </ScrollView>
            <Center>
              <Button onPress={handleSubmit} w="70%" bgColor="#4aa9ff">
                上架
              </Button>
            </Center>
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      width: "100%",
      height: "100%",
      display: "flex",
      backgroundColor: "info.700",
    },
  });
  