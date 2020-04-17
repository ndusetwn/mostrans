import React, { Component } from 'react';
import HOrdersView from './HOrdersView';
import { connect } from 'react-redux';

class HOrdersContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <HOrdersView {...this.props} />;
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
)(HOrdersContainer);
