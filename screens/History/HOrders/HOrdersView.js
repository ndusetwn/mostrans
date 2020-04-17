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
  Tabs,
  Tab,
  ScrollableTab
} from "native-base";

import Booked from "../../../components/History/Tab/Booked";
import Verified from "../../../components/History/Tab/Verified";
import Confirm from "../../../components/History/Tab/Confirm";
import Pickup from "../../../components/History/Tab/Pickup";
import Loaded from "../../../components/History/Tab/Loaded";
import DropOff from "../../../components/History/Tab/DropOff";
import Unloaded from "../../../components/History/Tab/Unloaded";
import Reject from "../../../components/History/Tab/Reject";

class HOrdersView extends Component {
  constructor(props) {
    super(props);
    this.state = { initialPage: 1, activeTab: 1 }
  }

  componentDidMount = () => {
    this.setState({ initialPage: this.props.navigation.state.params.page, 
                    activeTab: this.props.navigation.state.params.page })
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
            <Title>History Orders</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <Tabs initialPage={this.state.initialPage} page={this.state.activeTab} 
                renderTabBar={() => <ScrollableTab />}>
            <Tab heading="Booked">
              <Booked />
            </Tab>
            <Tab heading="Terverifikasi">
              <Verified />
            </Tab>
            <Tab heading="Diterima">
              <Confirm />
            </Tab>
            <Tab heading="Pickup">
              <Pickup />
            </Tab>
            <Tab heading="Loaded">
              <Loaded />
            </Tab>
            <Tab heading="Drop-Off">
              <DropOff />
            </Tab>
            <Tab heading="Unloaded">
              <Unloaded />
            </Tab>
            <Tab heading="Ditolak">
              <Reject />
            </Tab>
          </Tabs>
        </Content>
      </Container>
    );
  }
}

export default HOrdersView;
