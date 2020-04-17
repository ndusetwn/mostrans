/**
 * React Native App
 * Everthing starts from the entrypoint
 */
import React, { Component, useContext } from 'react';
import { ActivityIndicator, Alert, BackHandler, Linking, Text } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import Navigator from 'app/navigation';
import configureStore from 'app/store/configureStore';
import { setUrl, getUrl, encrypt, version } from './api/ApiConstants';
import Axios from 'axios';

import ApolloClient from 'apollo-client'
import { getMainDefinition } from 'apollo-utilities';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from "graphql-tag";
import {ApolloProvider} from 'react-apollo';

const wsLink = new WebSocketLink({
  uri: `ws://www.mostrans.co.id:4000/graphql`,
  options: {
    reconnect: true,
  },
});

const httpLink = new HttpLink({
  uri: 'http://www.mostrans.co.id:4000/graphql'
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link
});

const { persistor, store } = configureStore();
let url;

export default class Entrypoint extends Component {
    checkVersion = async (version,app) =>{
        let id_app = "market://details?id=com.mostrans.transporter";
        let x = await encrypt("select update from mt_master_version where version='" + version + "' and app='" + app + "'");
        await Axios.post(url.select,{
          query: x
        }).then(value=>{
          let x = value.data.data;
          if(x.length === 0 ) Alert.alert('Error', 'Versi tidak sesuai. Silahkan install ulang aplikasi di Play Store',[
            {'text': 'Ok', onPress: ()=>{
              BackHandler.exitApp();
              Linking.openURL(id_app);
            }}
          ], {cancelable: false});
          else {
            if(x[0].update === 'N') return true;
            else Alert.alert('New Updates Available', 'Mohon Update Aplikasi untuk menggunakan Mostrans.',[
              {'text': 'Ok', onPress: ()=>{
                BackHandler.exitApp();
                Linking.openURL(id_app);
              }}
            ], {cancelable: false});
          }
        })
      }

        //ketika masuk ke halamannya... pertama kali dipanggil
    async componentDidMount(){
        await setUrl();
        await getUrl().then(result=>{
            url =result;
        });
        // await this.checkVersion(version.version,version.app);
    }
 
    render() {
        return (
          <ApolloProvider client={client}>
              <Provider store={store}>
                  <PersistGate
                      loading={<ActivityIndicator />}
                      persistor={persistor}
                  >
                      <Navigator />
                  </PersistGate>
              </Provider>
          </ApolloProvider>
        );
    }
}
//6.3