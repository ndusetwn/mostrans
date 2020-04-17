import React, { Component } from 'react';
import SettingView from './SettingView';
import { connect } from 'react-redux';
import {BackHandler, Alert } from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {View} from 'native-base';

class SettingContainer extends Component {
    constructor(props) {
        super(props);
    }


    binding(){
        BackHandler.addEventListener("hardwareBackPress", ()=>this.props.backAction('Setting', this.props.navigation));
    }


    render() {
        return(
            <View style={{flex:1}}>
                <SettingView {...this.props} />
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
)(SettingContainer);
