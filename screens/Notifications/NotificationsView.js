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
  ListItem
} from "native-base";

class NotificationsView extends Component {
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
            <Title>Notifications</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <ListItem itemHeader first>
            <Text>ORDERS</Text>
          </ListItem>
          <ListItem button onPress={() => this.props.navigation.navigate("HOrders", { page: 0})}>
            <Left>
              <Text>Booked</Text>
            </Left>
            <Right>
              <Badge style={{ backgroundColor: "#FD3C2D" }}>
                <Text>1</Text>
              </Badge>
            </Right>
          </ListItem>
          <ListItem button onPress={() => this.props.navigation.navigate("HOrders", { page: 1})}>
            <Text>Terverifikasi</Text>
          </ListItem>
          <ListItem>
            <Text>Diterima</Text>
          </ListItem>
          <ListItem>
            <Text>Pickup</Text>
          </ListItem>
          <ListItem>
            <Text>Loaded</Text>
          </ListItem>
          <ListItem>
            <Left>
              <Text>Drop-Off</Text>
            </Left>
            <Right>
              <Badge style={{ backgroundColor: "#FD3C2D" }}>
                <Text>4</Text>
              </Badge>
            </Right>
          </ListItem>
          <ListItem>
            <Text>Unloaded</Text>
          </ListItem>
          <ListItem last>
            <Text>Ditolak</Text>
          </ListItem>

          <ListItem itemHeader>
            <Text>TRIPS</Text>
          </ListItem>
          <ListItem>
            <Text>Trip Berjalan</Text>
          </ListItem>
          <ListItem last>
            <Left>
              <Text>Trip Selesai</Text>
            </Left>
            <Right>
              <Badge style={{ backgroundColor: "#FD3C2D" }}>
                <Text>2</Text>
              </Badge>
            </Right>
          </ListItem>
        </Content>
      </Container>
    );
  }
}

export default NotificationsView;
