import FontAwesome from "@expo/vector-icons/FontAwesome";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { IconButton, NativeBaseProvider } from "native-base";
import { useEffect } from "react";
import BL from "./BL";
import CheckScreen from "./check";
import HomeScreen from "./home";
import InStockScreen from "./inStock";
import LoginScreen from "./login";
import ModalScreen from "./modal";
import OrderScreen from "./order";
import OutStockScreen from "./outStock";

import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import QuickReturnScreen from "./quickReturn";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { navigate } = useNavigation();

  const handleLogout = () => {
    SecureStore.deleteItemAsync("token").then(() => navigate("login" as never));
  };

  return (
    <NativeBaseProvider>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: "#ffffff",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#2878ff",
          },
        }}
      >
        <Stack.Screen
          name="home"
          component={HomeScreen}
          options={() => ({
            title: "首页",
            headerRight: () => (
              <IconButton
                variant="solid"
                bgColor="#2878ff"
                onPress={handleLogout}
                _icon={{
                  as: MaterialIcons,
                  name: "logout",
                }}
              />
            ),
          })}
        />
        <Stack.Screen
          name="check"
          component={CheckScreen}
          options={() => ({ title: "投料验收" })}
        />
        <Stack.Screen
          name="inStock"
          component={InStockScreen}
          options={() => ({ title: "上架入库" })}
        />
        <Stack.Screen
          name="outStock"
          component={OutStockScreen}
          options={() => ({ title: "下架出库" })}
        />
        <Stack.Screen
          name="quickReturn"
          component={QuickReturnScreen}
          options={() => ({ title: "快速返库" })}
        />
        <Stack.Screen
          name="order"
          component={OrderScreen}
          options={({ route }) => ({
            presentation: "modal",
            title: "下架出库",
          })}
        />
        <Stack.Screen
          name="BL"
          component={BL}
          options={({ route }) => ({
            presentation: "modal",
            title: (route.params as any).BL.batchCode,
          })}
        />
        <Stack.Screen
          name="login"
          component={LoginScreen}
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen
          name="modal"
          component={ModalScreen}
          options={{ headerShown: false, presentation: "modal" }}
        />
      </Stack.Navigator>
    </NativeBaseProvider>
  );
}
