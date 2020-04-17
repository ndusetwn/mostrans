// import React,{Component} from "react";
// import {Query,Subscription, ApolloProvider, graphql} from "react-apollo";
// import {gql} from "apollo-boost";
// import { split } from 'apollo-link';
// import { HttpLink } from 'apollo-link-http';
// import { ApolloClient } from 'apollo-client';
// import { WebSocketLink } from 'apollo-link-ws';
// import { getMainDefinition } from 'apollo-utilities';
// import { InMemoryCache } from 'apollo-cache-inmemory';
// import { Text,Button } from "native-base";
// import { Client, addGraphQLSubscriptions } from 'subscriptions-transport-ws';


// const wsLink = new WebSocketLink({
//   uri: `ws://10.163.219.197:4000/graphql`,
//   options: {
//     reconnect: true,
//   },
// });

// const httpLink = new HttpLink({
//   uri: 'http://10.163.219.197:4000/graphql'
// });

// const link = split(
//   // split based on operation type
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return (
//       definition.kind === 'OperationDefinition' &&
//       definition.operation === 'subscription'
//     );
//   },
//   wsLink,
//   httpLink,
// );

// const client = new ApolloClient({
//   cache: new InMemoryCache(),
//   link
// });
        
// const COMMENTS_SUBSCRIPTION = gql`
//     subscription postAdded {
//         postAdded
//     }
//     `;

// // const sub = ()=>subscribeToMore({
// //           document: COMMENTS_SUBSCRIPTION,
// //           variables: { repoName: params.repoName },
// //           updateQuery: (prev, { subscriptionData }) => {
// //             alert("Hai");
// //           }
// //         })

// var GET_PROFILE = gql`
//   query {
//     Hello
//   }
// `;

// export default class Test extends Component{
//     componentDidMount(){
//         alert("Test Class");
//         this.singleSubscribe();
//     }

//     singleQuery = async()=>{
//         alert("Test Query")
//         const {data} = await client.query({
//           query: GET_PROFILE
//         });
//         alert(JSON.stringify(data));
//       };

//     singleSubscribe=()=>{
//         alert("Subscribe")
//         const { data: { commentAdded }, loading } = client.subscribe(
//             COMMENTS_SUBSCRIPTION
//           );
//           alert(commentAdded);
//       };
//     render(){
//         return(
//             <ApolloProvider client={client}>
//                 <Subscription
//                     subscription={COMMENTS_SUBSCRIPTION}>
//                     {({ data, loading }) => {
//                     // this.setState({teks:JSON.stringify(data,null,2)});
//                     console.log("hai");
//                     console.log(JSON.stringify(data,null,2));
//                     return <Text>Hai</Text>;
//                     }}
//                 </Subscription>
//                 <Button onPress={this.singleQuery}><Text>Press</Text></Button>
//             </ApolloProvider>
//         )
//     }
    
// };


import React,{Component} from 'react';
import {Text,View} from 'react-native'
import ListPage from './ListPage'


class Test extends Component {
    render(){
        return(
          <ListPage/>

            // <View>
            //     <Text>HaiSubscribe</Text>
            // </View>
        )
    }
}


export default Test
    
        