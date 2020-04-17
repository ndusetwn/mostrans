// import React, { Component } from "react";
// import ProfileContainer from "../Profile/ProfileContainer";
// import SideBar from "../../components/SideBar.js";
// import { createDrawerNavigator } from "react-navigation";

import React, { Component } from "react";
import HomeContainer from './HomeContainer';
import OrdersContainer from '../Orders/OrdersContainer';
import TripsContainer from '../Trips/TripsContainer';
import { createBottomTabNavigator } from "react-navigation";
import {
  Button,
  Text,
  Icon,
  Item,
  Footer,
  FooterTab,
  Label
} from "native-base";
import SettingContainer from "../Setting/SettingContainer";
import { BackHandler, Alert } from 'react-native';

const test = (a) => {
  alert(a);
}

function backAction (value, param) {
  console.log('backhandler param : '+ param);
  console.log('backhandler value : '+ value);
  if(value === 'Home'){ //gabisa nangkep ini;(
    //this.props.navigation.state.index === 0
    Alert.alert("MOSTRANS", "Anda yakin ingin menutup aplikasi ?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      { text: "YES", onPress: () => BackHandler.exitApp() }
    ]);
  }else{
    param.goBack(null);
  }
  
  return true;
};

export default (MainScreenNavigator = createBottomTabNavigator(
  {
    //Ini udh manggil semua untuk ditampilin diatas MenuBottom
    Home: { screen: props => <HomeContainer  {...props} backAction={backAction}  /> }, //bisa masukin fungsi disini
    // Orders: { screen: props => <OrdersContainer {...props} />},
    Trips: { screen: props => <TripsContainer {...props} backAction={backAction} />},
    Setting: { screen: props => <SettingContainer {...props} backAction={backAction} /> }
  },
  {
    tabBarPosition: "bottom",
    tabBarComponent: props => {
      return (
        <Footer>
          <FooterTab>
            {/* <Button
              vertical
              active={props.navigation.state.index === 0}
              onPress={() => props.navigation.navigate("Home")}
            >
              <Icon type="MaterialIcons" name="dashboard" />
              <Text>Beranda</Text>
            </Button>
            {/* <Button
              vertical
              active={props.navigation.state.index === 1}
              onPress={() => props.navigation.navigate("Orders")}
            >
              <Icon type="MaterialIcons" name="description" />
              <Text>Orders</Text>
            </Button> */} 
            <Button
              vertical
              active={props.navigation.state.index === 0}
              onPress={() => props.navigation.navigate("Home")}
            >
              <Icon type="MaterialIcons" name="dashboard" />
              <Text>Dashboard</Text>
            </Button>

            <Button
              vertical
              active={props.navigation.state.index === 1}
              onPress={() => props.navigation.navigate("Trips")}
            >
              <Icon type="MaterialIcons" name="explore" />
              <Text>Trips</Text>
            </Button>
            <Button
              vertical
              active={props.navigation.state.index === 2} //warnanya akan berubah
              onPress={() => props.navigation.navigate("Setting")} //Ini arah link yg dituju
            >
              <Icon type="MaterialIcons" name="settings" />
              <Text>Setting</Text>
            </Button>
          </FooterTab>
        </Footer>
      );
    }
  }
));
