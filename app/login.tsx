import { Box, Button, FormControl, Input, Text, VStack } from "native-base";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { login } from "../utils/request";
import * as SecureStore from "expo-secure-store";

export default function LoginScreen({ navigation }: any) {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleAccount = (value: string) => {
    setMsg("");
    setAccount(value);
  };

  const handlePassword = (value: string) => {
    setMsg("");
    setPassword(value);
  };

  const handleLogin = () => {
    login(account, password).then((res) => {
      if (res.code === 200) {
        SecureStore.setItemAsync("token", res.token).then(() => {
          navigation.navigate("home");
        });
      } else {
        setMsg(res.msg);
      }
    });
  };
  return (
    <Box style={styles.container} safeAreaTop={8}>
      <Box style={styles.title}>
        <Text color="white" fontSize="4xl">
          欢迎来到
        </Text>
        <Text color="white" fontSize="2xl">
          仓库管理手持系统
        </Text>
      </Box>
      <Box style={styles.login}>
        <VStack w="90%" space={6}>
          {msg && <Text color="error.500">{msg}</Text>}
          <FormControl>
            <FormControl.Label>用户名</FormControl.Label>
            <Input bgColor="white" onChangeText={handleAccount} />
          </FormControl>
          <FormControl>
            <FormControl.Label>密码</FormControl.Label>
            <Input bgColor="white" onChangeText={handlePassword} />
          </FormControl>
          <Button w="100%" onPress={handleLogin} bgColor="#4aa9ff">
            登录
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    display: "flex",
    backgroundColor: "#4aa9ff",
  },
  title: {
    flex: 3,
    width: "100%",
    color: "#ffffff",
    padding: 24,
  },
  login: {
    display: "flex",
    alignItems: "center",
    flex: 7,
    width: "100%",
    backgroundColor: "#ecfeff",
    paddingTop: 36,
  },
});
