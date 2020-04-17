import React, { Component } from "react";
import { Image } from "react-native";
import styles from "./styles";
import {
  Content,
  Text,
  List,
  ListItem,
  Icon,
  Container,
  Left,
  Right,
  Badge
} from "native-base";

const datas = [
  {
    name: "Beranda",
    routes: "Home",
    icon: "dashboard"
  },
  {
    name: "Orders",
    routes: "Orders",
    icon: "description"
  },
  {
    name: "Trips",
    routes: "Trips",
    icon: "explore"
  },
  {
    name: "Setting" ,
    routes: "Setting",
    icon: "person"
  }];

export class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shadowOffsetWidth: 1,
      shadowRadius: 4
    };
  }

  render() {
    return (
      <Container>
        <Content>
        <Image
          source={require('../../../assets/images/bgheader.png')}
          style={{
            height: 120,
            width: "100%",
            alignSelf: "stretch",
            position: "absolute"
          }}
        />
          <List
            dataArray={datas}
            contentContainerStyle={{ marginTop: 120 }}
            renderRow={data => {
              return (
                <ListItem
                  button
                  noBorder
                  onPress={() => this.props.navigation.navigate(data.routes)}
                >
                  <Left>
                    <Icon
                      active
                      type="MaterialIcons"
                      name={data.icon}
                      style={{ color: "#777", fontSize: 26, width: 30 }}
                    />
                    <Text style={styles.text}>
                      {data.name}
                    </Text>
                  </Left>
                </ListItem>
              );
            }}
          />
        </Content>
      </Container>
    );
  }
}

export default Sidebar;
