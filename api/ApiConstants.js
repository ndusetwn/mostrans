/* App config for apis
 */

import AesCrypto from 'react-native-aes-kit';
import Axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {Modal, Text, TouchableOpacity, View} from 'react-native';
import {Spinner} from 'native-base';

const secretKey = '(1xkfh*2.zl^23-]';
const iv = "43i9{tdk'14045xw";

export const encrypt = (data) => new Promise((resolve)=>{
    AesCrypto.encrypt(data,secretKey, iv).then(cipher=>{
        resolve(cipher)
    }).catch(err=>{
        resolve(false)
    });
});
export const decrypt = (data) => new Promise((resolve)=>{
    AesCrypto.decrypt(data,secretKey, iv).then(plaintext=>{
        resolve(plaintext)
    }).catch(err=>{
        resolve(false)
    });
});

export const setUrl = () => new Promise(async (resolve)=>{
    console.log('set url start');
    console.log(version);
    let url = 'http://mostrans.co.id/apimobile/';
    if (version.type === 'dev') url += 'testing';
    console.log(url);
    let encrypted_response = await Axios.get(url);
    // let encrypted_response;
    // await fetch('http://mostrans.co.id/apimobile/testing/').then();
    console.log('=============================================');
    console.log(encrypted_response);
    console.log('=============================================');
    let decrypted_response = await decrypt(encrypted_response.data);
    console.log('open' + url);
    await AsyncStorage.setItem('url', decrypted_response).then(value=>{
        console.log('sukses set');
        console.log(value);
    });
    console.log('dalam get url');
    resolve('success');
})

export const getUrl = () => new Promise(async (resolve, reject)=>{
    await AsyncStorage.getItem('url').then(value=>{
        resolve(JSON.parse(value));
    }).catch(err=>{
        console.log(err);
        reject('error');
    })
})

export const version = {
    app: 'TRANSPORTER',
    version: '1.2.2',
    type: 'dev'// prod | dev
}

export default class Loading extends Component{
    render(){
        return(
            <View style={{position: 'absolute', top: 0, left: 0, right:0, bottom:0, flex:1, backgroundColor: '#00000044', justifyContent: 'center'}}>
                <Spinner/>
                <Text style={{alignSelf: 'center'}}>Loading..</Text>
            </View>
        )
    }
}