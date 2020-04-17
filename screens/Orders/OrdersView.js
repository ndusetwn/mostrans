import React, { Component } from "react";
import { Modal, TouchableHighlight } from "react-native";
import {
  Content,
  Container,
  Header,
  Button,
  Icon,
  InputGroup,
  Input,
  Item,
  Text,
  List,
  ListItem,
  Thumbnail,
  View
} from "native-base";
import images from "../../components/Images";

class OrdersView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false
    };
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
    return (
      <Container>
        <Header searchBar rounded>
          <Item>
            <Icon active name="search" />
            <Input
              placeholder="Pencarian order berjalan ..."
              style={{ height: 480 }}
            />
          </Item>
          <Button transparent>
            <Text>Cari</Text>
          </Button>
        </Header>

        <Content padder>
          <List>
            <ListItem button onPress={() => this.setModalVisible(true)}>
              <Thumbnail square size={80} source={images.Logo} />
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={{ fontWeight: "600", color: "#46ee4b" }}>
                  EPM-001-2019-04
                </Text>

                <Text style={{ color: "#007594", flexWrap: "wrap" }}>
                  Jakarta - Semarang
                </Text>

                <Text note style={{ marginTop: 5 }}>
                  15 April 2019
                </Text>
              </View>
            </ListItem>
            <ListItem button onPress={() => this.setModalVisible(true)}>
              <Thumbnail square size={80} source={images.Logo} />
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={{ fontWeight: "600", color: "#46ee4b" }}>
                  EPM-001-2019-04
                </Text>

                <Text style={{ color: "#007594", flexWrap: "wrap" }}>
                  Jakarta - Semarang
                </Text>

                <Text note style={{ marginTop: 5 }}>
                  15 April 2019
                </Text>
              </View>
            </ListItem>
            <ListItem button onPress={() => this.setModalVisible(true)}>
              <Thumbnail square size={80} source={images.Logo} />
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={{ fontWeight: "600", color: "#46ee4b" }}>
                  EPM-001-2019-04
                </Text>

                <Text style={{ color: "#007594", flexWrap: "wrap" }}>
                  Jakarta - Semarang
                </Text>

                <Text note style={{ marginTop: 5 }}>
                  15 April 2019
                </Text>
              </View>
            </ListItem>
            <ListItem button onPress={() => this.setModalVisible(true)}>
              <Thumbnail square size={80} source={images.Logo} />
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={{ fontWeight: "600", color: "#46ee4b" }}>
                  EPM-001-2019-04
                </Text>

                <Text style={{ color: "#007594", flexWrap: "wrap" }}>
                  Jakarta - Semarang
                </Text>

                <Text note style={{ marginTop: 5 }}>
                  15 April 2019
                </Text>
              </View>
            </ListItem>
            <ListItem button onPress={() => this.setModalVisible(true)}>
              <Thumbnail square size={80} source={images.Logo} />
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={{ fontWeight: "600", color: "#46ee4b" }}>
                  EPM-001-2019-04
                </Text>

                <Text style={{ color: "#007594", flexWrap: "wrap" }}>
                  Jakarta - Semarang
                </Text>

                <Text note style={{ marginTop: 5 }}>
                  15 April 2019
                </Text>
              </View>
            </ListItem>
            <ListItem button onPress={() => this.setModalVisible(true)}>
              <Thumbnail square size={80} source={images.Logo} />
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={{ fontWeight: "600", color: "#46ee4b" }}>
                  EPM-001-2019-04
                </Text>

                <Text style={{ color: "#007594", flexWrap: "wrap" }}>
                  Jakarta - Semarang
                </Text>

                <Text note style={{ marginTop: 5 }}>
                  15 April 2019
                </Text>
              </View>
            </ListItem>
            <ListItem button onPress={() => this.setModalVisible(true)}>
              <Thumbnail square size={80} source={images.Logo} />
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={{ fontWeight: "600", color: "#46ee4b" }}>
                  EPM-001-2019-04
                </Text>

                <Text style={{ color: "#007594", flexWrap: "wrap" }}>
                  Jakarta - Semarang
                </Text>

                <Text note style={{ marginTop: 5 }}>
                  15 April 2019
                </Text>
              </View>
            </ListItem>
            <ListItem button onPress={() => this.setModalVisible(true)}>
              <Thumbnail square size={80} source={images.Logo} />
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={{ fontWeight: "600", color: "#46ee4b" }}>
                  EPM-001-2019-04
                </Text>

                <Text style={{ color: "#007594", flexWrap: "wrap" }}>
                  Jakarta - Semarang
                </Text>

                <Text note style={{ marginTop: 5 }}>
                  15 April 2019
                </Text>
              </View>
            </ListItem>
          </List>

          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              alert("Modal has been closed.");
            }}
          >
            <View style={{ marginTop: 22 }}>
              <View>
                <Text>Hello World!</Text>

                <TouchableHighlight
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                  }}
                >
                  <Text>Hide Modal</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
        </Content>
      </Container>
    );
  }
}

export default OrdersView;
