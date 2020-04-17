import React, { Component } from "react";
import { View, Image } from "react-native";
import styles from "./styles";
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
  Badge,
  List,
  ListItem
} from "native-base";

class InboxView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container style={{ backgroundColor: "#ffffff" }}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Kotak Masuk</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <List>
            <ListItem thumbnail>
              <Left>
                <Icon style={{ width:null, textAlign: 'center', padding: 10, fontSize: 30, color: "#008c45" }} type="MaterialIcons" name="chat-bubble-outline" />
              </Left>
              <Body>
                <Text>Obrolan</Text>
                <Text note>Percakapan pribadi anda</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem thumbnail>
              <Left>
                <Icon style={{ width:null, textAlign: 'center', padding: 10, fontSize: 30, color: "#008c45" }} type="SimpleLineIcons" name="question" />
              </Left>
              <Body>
                <Text>Diskusi</Text>
                <Text note>Seputar pertanyaan yang sering ditanyakan</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem thumbnail>
              <Left>
                <Icon style={{ width:null, textAlign: 'center', padding: 10, fontSize: 30, color: "#008c45" }} type="SimpleLineIcons" name="star" />
              </Left>
              <Body>
                <Text>Ulasan</Text>
                <Text note>Penilaian terhadap drivers dan perjalanan</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem thumbnail>
              <Left>
                <Icon style={{ width:null, textAlign: 'center', padding: 10, fontSize: 30, color: "#008c45" }} type="FontAwesome5" name="teamspeak" />
              </Left>
              <Body>
                <Text>Pusat bantuan</Text>
                <Text note>Percakapan dengan pusat bantuan</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}

export default InboxView;
