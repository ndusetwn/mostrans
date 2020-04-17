import React, { Component } from "react";
import { PermissionsAndroid, Alert } from "react-native";
import NavigationStack from "./NavigationStack";
import NavigationService from "./NavigationService";
import { StyleProvider, Root } from "native-base";
import getTheme from "../../theme/components";
import variables from "../../theme/variables/variables";
import material from "../../theme/variables/material";

// export async function request_location_runtime_permission() {
//     try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             'title': 'Your App',
//             'message': 'Allow app to access your location '
//           }
//         )
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           Geolocation.getCurrentPosition(
//             (position) => {
//                 console.log(position);
//                Geocoder.geocodePosition({lat: position.coords.latitude, lng: position.coords.longitude})
//                .then(res => {
//                 this.setState({
//                   locationResult: res[0].formattedAddress
//                 });
//             })
//             },
//             (error) => {
//                 // See error code charts below.
//                 console.log(error.code, error.message);
//             },
//             { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//         );
//         } else {
//           alert("Location permission denied");
//         }
//       } catch (err) {
//         console.log("No Access  to location" + err);
//       }
// }

class AppNavigator extends Component {
  // async componentDidMount(){
  //     await request_location_runtime_permission()
  // }

  render() {
    return (
      <NavigationStack
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    );
  }
}
export default () => (
  <StyleProvider style={getTheme(variables)}>
    <Root>
      <AppNavigator />
    </Root>
  </StyleProvider>
);
