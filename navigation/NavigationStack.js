import React from "react";
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  Alert,
  PermissionsAndroid
} from 'react-native';
import { createStackNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation';
import AsyncStorage from "@react-native-community/async-storage";
import Login from 'app/screens/Login';
import Home from 'app/screens/Home';
import Splash from 'app/screens/Splash';
import Orders from 'app/screens/Orders';
import OrdersDetail from 'app/screens/Orders/Detail';
import OrdersMaps from 'app/screens/Orders/Maps';
import Trips from 'app/screens/Trips';
import TripsDetail from "app/screens/Trips/Detail";
import Setting from 'app/screens/Setting';
import Notifications from 'app/screens/Notifications';
import Inbox from 'app/screens/Inbox'
import Chat from 'app/screens/Inbox/Chat';
import HOrders from 'app/screens/History/HOrders'
import HTrips from 'app/screens/History/HTrips'
import { decrypt } from "../api/ApiConstants";

// import Sidebar from '../components/Sidebar/Sidebar';

// const Drawer = createDrawerNavigator(
//   {
//     Login: { screen: Login },
//     Home: { screen: Home },
//     Orders: { screen: Orders },
//     Trips: { screen: Trips },
//     Setting: { screen: Setting }
//   },
//   {
//     initialRouteName: "Login",
//     contentOptions: {
//       activeTintColor: "#e91e63"
//     },
//     contentComponent: props => <Sidebar {...props} />
//   }
// );

class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'Mostrans Transporter',
        'message': 'Locate Your Company Location'
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // console.log("You can use the location")
      // alert("You can use the location");
    } else {
      // console.log("location permission denied")
      // alert("Location permission denied");
    }
    this.props.navigation.replace('Splash');
    // const uid = await AsyncStorage.getItem('@uid');
    // this.props.navigation.replace(uid ?'Home' : 'Login');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

//ini utk ngelempar yg udh selesai di proses contoh ada di rejectTrip(), dan dimasukin
const RNApp = createStackNavigator(
    {
        //Drawer : { screen: Drawer },
        //Welcome: { screen: Welcome },
        Auth: AuthLoadingScreen,
        Splash:{screen:Splash},
        Login: { screen: Login },
        Home: { screen: Home },
        Orders: { screen: Orders },
        OrdersDetail: { screen: OrdersDetail },
        OrdersMaps: { screen: OrdersMaps },
        Trips: { screen: Trips },
        TripsDetail: { screen: TripsDetail},
        Setting: { screen: Setting },
        Notifications: { screen: Notifications },
        Inbox: { screen: Inbox },
        Chat: { screen: Chat },
        HOrders: { screen: HOrders },
        HTrips: { screen: HTrips }
    },
    {
      initialRouteName: "Splash",
      headerMode: "none"
    }
);

export default createAppContainer(RNApp);
