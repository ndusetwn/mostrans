import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class Logo extends Component<{}> {

	render(){
		return(
			<View style={styles.container}>
          <Text style={styles.signTitle}></Text>
          <LinearGradient colors={['#ffffff', '#ffffff', 'rgba(47, 245, 166, 0.1)']} style={styles.inputBox}>
              <View style={styles.SectionStyle}>
                  <Image source={require('../../assets/images/people.png')} style={styles.ImageStyle} />
                  <TextInput
                    style={{flex:1}}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    placeholder="Email | No Handphone"
                    placeholderTextColor = "#1e2427"
                    selectionColor="#1e2427"
                    keyboardType="email-address"
                    onSubmitEditing={()=> this.password.focus()}
                  />
              </View>
          </LinearGradient>
          <LinearGradient colors={['#ffffff', '#ffffff', 'rgba(47, 245, 166, 0.1)']} style={styles.inputBox}>
              <View style={styles.SectionStyle}>
                  <Image source={require('../../assets/images/lock.png')} style={styles.ImageStyle} />
                  <TextInput
                    style={{flex:1}}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    placeholder="Password"
                    secureTextEntry={true}
                    placeholderTextColor = "#1e2427"
                    ref={(input) => this.password = input}
                  />
              </View>
          </LinearGradient>
          <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>MASUK</Text>
          </TouchableOpacity>
  		</View>
			)
	}
}

const styles = StyleSheet.create({
  container : {
    flexGrow: 1,
    justifyContent:'center',
    alignItems: 'center'
  },

  inputBox: {
    width:300,
    backgroundColor:'rgba(255, 255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal:16,
    fontSize:16,
    color:'#ffffff',
    marginVertical: 10
  },
  button: {
    width:300,
    backgroundColor:'#008D45',
     borderRadius: 10,
      marginVertical: 10,
      paddingVertical: 13
  },
  buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'#ffffff',
    textAlign:'center'
  },
  signTitle: {
    color: '#1e2427',
    fontFamily: 'Gadugi',
    fontSize: 21,
    fontWeight: 'bold',
    textAlign:'center',
    marginTop: 20
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImageStyle: {
    alignItems: 'center',
    height: 20,
    width: 20,
    resizeMode: 'contain'
  }
});
