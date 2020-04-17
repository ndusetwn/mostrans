import React, { Component } from 'react';
import HTripsView from './HTripsView';
import { connect } from 'react-redux';

class HTripsContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <HTripsView {...this.props} />;
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
)(HTripsContainer);
