import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Welcome } from "./src/pages/Welcome";
export default function app() {
  return <Welcome></Welcome>;
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
