import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default class Logo extends Component<{}> {
	render(){
		return(
			<View style={styles.container}>
				<Image style={{width:193, height: 124, shadowColor: 'rgba(5, 5, 5, 0.35)',
											 shadowOffset: { width: 5, height: -8 },
											 shadowRadius: 9,  }} source={require('../../assets/images/logo.png')}/>
  		</View>
    )
	}
}

const styles = StyleSheet.create({
  container : {
    
    justifyContent:'center',
    alignItems: 'center'
  },
  logoText : {
    height: 17,
    color: '#1e2427',
    fontFamily: 'Gadugi',
    fontSize: 12
  }
});
