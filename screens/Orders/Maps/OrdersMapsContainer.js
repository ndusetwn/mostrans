import React, { Component } from 'react';
import OrdersMapsView from './OrdersMapsView';
import { connect } from 'react-redux';

class OrdersMapsContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <OrdersMapsView {...this.props} />;
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
)(OrdersMapsContainer);
