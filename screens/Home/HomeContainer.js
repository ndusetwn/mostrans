import React, { Component } from 'react';
import HomeView from './HomeView';
import { connect } from 'react-redux';
import {
    Container,
    Header,
    Title,
    Content,
    Button,
    Left,
    Right,
    Body,
    Text,
    Icon,
    Card,
    CardItem,
    Grid,
    Row,
    View,
    Col
  } from "native-base";
import {BackHandler, Alert} from 'react-native';
import {NavigationEvents} from 'react-navigation';

class HomeContainer extends Component {
    constructor(props) {
        super(props);
    }


    componentDidMount=()=>{
        //this.props.backAction();
        //console.log('HomeDidMout')
        //BackHandler.addEventListener("hardwareBackPress", ()=>this.props.backAction('Home', this.props.navigation));
    }

    componentWillUnmount(){
       // BackHandler.removeEventListener("hardwareBackPress", ()=>this.props.backAction('Home', this.props.navigation));
    }

    binding(){
        BackHandler.addEventListener("hardwareBackPress", ()=>this.props.backAction('Home', this.props.navigation));
                                                                                    //Ini parameter utk ngelempar param di fungsi backAction di index.js
    }

    render() {
        //<NavigationEvents onDidFocus={()=> alert('testttt')} />
        // return <Text>Hai</Text>
        return(
        <View style={{flex:1}}>
            
            <HomeView {...this.props} />
            <NavigationEvents onDidFocus={()=> this.binding()} />
        </View>
        )
    }
}

function mapStateToProps() {
    return {};
}

function mapDispatchToProps() {
    return {};
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeContainer);
