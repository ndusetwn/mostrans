import React, { Component } from 'react';
import TripsView from './TripsView';
import { connect } from 'react-redux';
import {BackHandler, Alert } from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {View} from 'native-base';

class TripsContainer extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount=()=>{
        //this.props.backAction();
        //BackHandler.addEventListener("hardwareBackPress", ()=>this.props.backAction('Trips', this.props.navigation));
    }

    componentWillUnmount(){
        //BackHandler.removeEventListener("hardwareBackPress", ()=>this.props.backAction('Trips', this.props.navigation));
    }

    binding(){
        BackHandler.addEventListener("hardwareBackPress", ()=>this.props.backAction('Trips', this.props.navigation));
    }


    render() {
        return (
            <View style={{flex:1}}>
                <TripsView {...this.props} />
                <NavigationEvents onDidFocus={()=> this.binding()} />
            </View>
        )
    }
}

function mapStateToProps() {
    return {};
}

function mapDispatchToProps() {
    return {        
        onLoadTrips: (uid, query) => dispatch(tripActions.getAllTrips(uid, query))
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TripsContainer);
