import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { NativeBaseProvider } from "native-base";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import TabCheck from "./(tabs)/check";
import ModalScreen from "./modal";
import BL from "./BL";
import InStockScreen from "./inStock";
import HomeScreen from "./home";
import CheckScreen from "./check";
import OutStockScreen from "./outStock";
import OrderScreen from "./order";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

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
  const colorScheme = useColorScheme();

  return (
    <NativeBaseProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
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
            options={() => ({ title: "首页" })}
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
            name="modal"
            component={ModalScreen}
            options={{ presentation: "modal" }}
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
            name="order"
            component={OrderScreen}
            options={({ route }) => ({
              presentation: "modal",
              title: "下架出库",
            })}
          />
        </Stack.Navigator>
      </ThemeProvider>
    </NativeBaseProvider>
  );
}
