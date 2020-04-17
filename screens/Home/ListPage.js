import React,{useContext } from 'react'
import {graphql,
  Subscription,
  Query,ApolloConsumer} from 'react-apollo';
import gql from "graphql-tag";
import {Text,View} from 'react-native'

var GET_PROFILE = gql`
  query {
    Hello
  }
`;

const COMMENTS_SUBSCRIPTION = gql`
    subscription postAdded {
        postAdded
    }
    `;

class ListPage extends React.Component {
    constructor(props) {
        super(props)
      }
    
      componentDidMount() {
        // this.subscription = this.props.GET_PROFILE.subscribeToMore({
        //   document: COMMENTS_SUBSCRIPTION,
        //   variables: null,
        //   updateQuery: (previousState, {subscriptionData}) => {
        //     alert(subscriptionData);
        //   },
        //   onError: (err) => console.error(err),
        // })
      }
      render(){
        return(
          <Subscription
            subscription={COMMENTS_SUBSCRIPTION}>
            {({ data, loading }) => {
              // this.setState({teks:JSON.stringify(data,null,2)});
              // console.log("hai");
              // console.log(JSON.stringify(data,null,2));
              return <Text>{JSON.stringify(data)}</Text>;
            }}
        </Subscription>
        // <Query query={GET_PROFILE}>
        //   {({ data, loading, error }) => {
        //     // alert(data);
        //     return (
        //       <Text>{JSON.stringify(data)}</Text>
        //     );
        //   }}
        // </Query>
          );
        
      }
}

// const ListPageWithData = graphql(GET_PROFILE, {name: 'GET_PROFILE'})(ListPage)

export default ListPage