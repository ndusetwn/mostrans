
import React, { Component } from 'react';
import NotificationsView from './NotificationsView';
import { connect } from 'react-redux';

class NotificationsContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <NotificationsView {...this.props} />;
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
)(NotificationsContainer);
