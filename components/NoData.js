import React, { Component } from "react";
import { StyleSheet, View, Image } from "react-native";
import { Text } from 'native-base';

export default class NoData extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{ width: 200, height: 200 }}
          source={require("../../assets/images/nodata.jpg")}
        />
        <Text note style={styles.logoText}>Mohon maaf trip anda kosong</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  logoText: {    
    fontFamily: "Gadugi",
    fontSize: 14
  }
});
