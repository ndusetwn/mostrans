import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  ListItem,
  Text,
  Left,
  Right,
  Body
} from "native-base";
import AsyncStorage from "@react-native-community/async-storage";

class SettingView extends Component {
  constructor(props) {
    super(props);
  }

  signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.replace("Login");
  };
  
  render() {
    return (
      <Container>
        <Header style={{height: 55, paddingTop:0}}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Setting</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <Button
            iconRight
            transparent
            primary
            onPress={this.signOutAsync}
          >
            <Text>Logout</Text>
            <Icon name="md-arrow-dropright" />
          </Button>
        </Content>
      </Container>
    );
  }
}

export default SettingView;
