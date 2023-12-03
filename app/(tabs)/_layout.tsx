import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable, useColorScheme } from "react-native";

import Colors from "../../constants/Colors";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerTintColor: "#ffffff",
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "#2878ff",
        },
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "首页",
          tabBarIcon: ({ color }) => undefined,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="check"
        options={{
          title: "投料验收",
          tabBarIcon: ({ color }) => undefined,
        }}
      />
      <Tabs.Screen
        name="inStock"
        options={{
          title: "上架入库",
          tabBarIcon: ({ color }) => undefined,
        }}
      />
      <Tabs.Screen
        name="outStock"
        options={{
          title: "下架出库",
          tabBarIcon: ({ color }) => undefined,
        }}
      />
    </Tabs>
  );
}
