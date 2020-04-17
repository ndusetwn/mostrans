import React, { Component } from 'react';
import OrdersView from './OrdersView';
import { connect } from 'react-redux';

class OrdersContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <OrdersView {...this.props} />;
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
)(OrdersContainer);
