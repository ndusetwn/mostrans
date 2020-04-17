import {Text, View, Image,BackHandler,PermissionsAndroid} from 'react-native';
import React, {Component} from 'react';
import {Container, Content, Spinner} from 'native-base';
import styles from './styles'
import AsyncStorage from '@react-native-community/async-storage';

export default class Splash extends Component{
    async componentDidMount(){
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              'title': 'Mostrans Transporter',
              'message': 'Locate Your Company Location'
            }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {}
          else{
            BackHandler.exitApp();
            alert("Active Location Permission For Using This Application");
          }

        const uid = await AsyncStorage.getItem('@uid');
        this.interval = setInterval(()=>{
            this.props.navigation.replace(uid ?'Home' : 'Login');
          }, 1000);
    }
    componentWillUnmount(){
        clearInterval(this.interval);
      }

    render() {
        return (
          <Container>
            <Content contentContainerStyle={styles.container} style={{flex: 1}}>
              <View style={{width: '100%', height: 200, position: 'absolute', bottom: 0}}>
                <Image resizeMode='cover' source={require('../../../assets/images/BackgroundFinal.jpg')} style={{flex: 1, width: undefined, height: undefined, opacity: 0.5}}/>
              </View>
              <Image source={require('../../../assets/images/logo.png')} style={styles.logo}/>
              <Spinner style={styles.spinner}/>
              {/* <Text>{version.version} {version.type}</Text> */}
            </Content>
          </Container>
        );
      }
}