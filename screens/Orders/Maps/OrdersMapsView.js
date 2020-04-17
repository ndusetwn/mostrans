import React, { Component } from "react";
import { Dimensions, View, StyleSheet } from "react-native";
import { Button, Icon, Text, Badge } from "native-base";
import styles from './styles';
import MapView, { Callout } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GOOGLE_MAPS_APIKEY = "AIzaSyCzNbgMZ4KM4oiYTozTV7kDXol30YWfr3Q";

class OrdersMapsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coordinates: [
        {
          latitude: parseFloat(this.props.navigation.state.params.asallat),
          longitude: parseFloat(this.props.navigation.state.params.asallang)
        },
        {
          latitude: parseFloat(this.props.navigation.state.params.tujuanlat),
          longitude: parseFloat(this.props.navigation.state.params.tujuanlang)
        }
      ],
      distances: "",
      durations: ""
    };

    this.mapView = null;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          initialRegion={{
            latitude: parseFloat(this.props.navigation.state.params.asallat),
            longitude: parseFloat(this.props.navigation.state.params.asallang),
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }}
          style={StyleSheet.absoluteFill}
          ref={c => (this.mapView = c)}
        >
          {this.state.coordinates.map((coordinate, index) => (
            <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate}>
              <View>
                {index === 0 ? (
                  <Badge style={{ backgroundColor: "#ff9797" }}>
                    <Text style={{ fontSize: 12 }}>Asal - ({this.props.navigation.state.params.asalperusahaan})</Text>
                  </Badge>
                ) : (
                  <Badge style={{ backgroundColor: "#ff9797" }}>
                    <Text style={{ fontSize: 12 }}>Tujuan - ({this.props.navigation.state.params.tujuanperusahaan})</Text>
                  </Badge>
                )}
              </View>
            </MapView.Marker>
          ))}
          {this.state.coordinates.length >= 2 && (
            <MapViewDirections
              origin={this.state.coordinates[0]}
              waypoints={
                this.state.coordinates.length > 2
                  ? this.state.coordinates.slice(1, -1)
                  : null
              }
              destination={
                this.state.coordinates[this.state.coordinates.length - 1]
              }
              mode="DRIVING"
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={4}
              strokeColor="#008c45"
              optimizeWaypoints={true}
              onStart={params => {
                console.log(
                  `Started routing between "${params.origin}" and "${
                    params.destination
                  }"`
                );
              }}
              onReady={result => {
                this.setState({
                  distances: Number(result.distance.toFixed(1))
                });
                this.setState({
                  durations: Number(result.duration.toFixed(1))
                });
                console.log(`Distance: "${result.distance}" km"`);
                console.log(`Duration: "${result.duration}" min."`);

                this.mapView.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: width / 20,
                    bottom: height / 20,
                    left: width / 20,
                    top: height / 20
                  }
                });
              }}
              onError={() => {
                // console.log('GOT AN ERROR');
              }}
            />
          )}
        </MapView>
        <Callout>
          <View style={{ top: 20 }}>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </View>
        </Callout>
        <View style={styles.members}>
          <View style={styles.member}>
            <Icon type="Ionicons" name="ios-speedometer" style={{ color: '#008c45' }}></Icon>
            <Text style={styles.memberName}>{this.state.distances} KM</Text>
          </View>
          <View style={styles.member}>
            {/* <View style={[styles.avatar, { backgroundColor: "#008c45" }]}></View> */}
            <Icon type="Ionicons" name="ios-time" style={{ color: '#008c45' }}></Icon>
            <Text style={styles.memberName}>{this.state.durations} Min</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default OrdersMapsView;
