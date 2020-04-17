import React, { Component } from 'react';
import TripsDetailView from './TripsDetailView';
import { connect } from 'react-redux';

class TripsDetailContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <TripsDetailView {...this.props} />;
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
)(TripsDetailContainer);
