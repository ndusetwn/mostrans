import React, { Component } from 'react';
import ChatView from './ChatView';
import { connect } from 'react-redux';

class ChatContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <ChatView {...this.props} />;
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
)(ChatContainer);
