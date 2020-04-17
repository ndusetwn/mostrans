import React, { Component } from 'react';
import { View, Image } from 'react-native';
import styles from './styles';
import {
  Container,
  Header,
  Title,
  Content,
  Text,
  Button,
  Icon,
  Footer,
  FooterTab,
  Left,
  Right,
  Body,
  Badge
} from "native-base";

class ChatView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
          <Container style={{backgroundColor: "#ffffff"}}>
            <Header>
              <Left>
                <Button
                  transparent
                  onPress={() => this.props.navigation.openDrawer()}
                >
                  <Icon name="ios-menu" />
                </Button>
              </Left>
              <Body>
                <Title>Chat</Title>
              </Body>
              <Right />
            </Header>

            <Content padder>
              <Text>Content goes here (internal)</Text>
            </Content>
          </Container>
        );
    }
}

export default ChatView;
