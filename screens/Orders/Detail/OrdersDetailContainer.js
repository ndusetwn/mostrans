import React, { Component } from 'react';
import OrdersDetailView from './OrdersDetailView';
import { connect } from 'react-redux';

class OrdersDetailContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <OrdersDetailView {...this.props} />;
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
)(OrdersDetailContainer);
