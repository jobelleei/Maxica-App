import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.content}>
        {/* Logo Placeholder */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>LOGO</Text>
        </View>

        {/* App Name */}
        <Text style={styles.appName}>Maxica</Text>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing{"\n"}
            elit, sed do eiusmod tempor incididunt ut labore et
          </Text>

          {/* Get Started Button */}
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => router.push("/scan")}
          >
            <Text style={styles.buttonText}>Get Started</Text>

            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5C97BB",
  },

  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
  },

  logoContainer: {
    width: 135,
    height: 135,
    backgroundColor: "#F5F1ED",
    borderRadius: 22,
    marginTop: 165,
    justifyContent: "center",
    alignItems: "center",
    borderBottomRightRadius: 8,
  },

  logoText: {
    fontSize: 20,
    fontWeight: "400",
    color: "#292929",
    letterSpacing: 1,
  },

  appName: {
    marginTop: 8,
    fontSize: 52,
    color: "#F5F1ED",
    fontFamily: "serif",
    fontWeight: "600",
  },

  bottomSection: {
    width: "100%",
    alignItems: "center",
    marginTop: 105,
  },

  description: {
    color: "#F5F1ED",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    letterSpacing: 0.2,
  },

  button: {
    width: 220,
    height: 45,
    backgroundColor: "#E6EDF2",
    borderRadius: 30,
    marginTop: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#273A7A",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  arrow: {
    color: "#273A7A",
    fontSize: 30,
    fontWeight: "700",
    marginLeft: 14,
    marginTop: -2,
  },
});