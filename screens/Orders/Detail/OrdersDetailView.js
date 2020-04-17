import React, { Component } from "react";
import { Image, View, Modal } from "react-native";
import {
  Container,
  Header,
  Left,
  Button,
  Icon,
  Body,
  Title,
  Subtitle,
  Right,
  Content,
  Card,
  CardItem,
  Text,
  Separator
} from "native-base";
import Timeline from "react-native-timeline-listview";
import styles from "./styles";

class OrdersDetailView extends Component {
  constructor(props) {
    super(props);
    this.data = [
      {
        circleColor: "#008c45",
        lineColor: "#008c45",
        time: "  Asal  ",
        title: this.props.navigation.state.params.asalperusahaan,
        description:
          this.props.navigation.state.params.asalalamat +
          " " +
          this.props.navigation.state.params.asalalamat2
      },
      {
        circleColor: "#008c45",
        lineColor: "#008c45",
        time: "Tujuan",
        title: this.props.navigation.state.params.tujuanperusahaan,
        description:
          this.props.navigation.state.params.tujuanalamat +
          " " +
          this.props.navigation.state.params.tujuanalamat2
      }
    ];
    this.state={
      isOpen: false
    }
  }

  render() {
    let images = { uri: this.props.navigation.state.params.foto_logo };
    let data = {
      'asallat': this.props.navigation.state.params.asallat,
      'asallang': this.props.navigation.state.params.asallang,
      'tujuanlat': this.props.navigation.state.params.tujuanlat,
      'tujuanlang': this.props.navigation.state.params.tujuanlang,
      'asalperusahaan': this.props.navigation.state.params.asalperusahaan,
      'tujuanperusahaan': this.props.navigation.state.params.tujuanperusahaan

    }
    return (
      <Container>
        <Header style={{height: 55, paddingTop:0}}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Order</Title>
            <Subtitle>{this.props.navigation.state.params.id_order}</Subtitle>
          </Body>
          <Right />
        </Header>
        <Content>
          <View style={styles.mainContainer}>
            <View style={styles.container}>
              <Text style={styles.paragraphLeft}>Order</Text>
              <Text style={[styles.paragraphCenter, { marginLeft: '15%' }]}>
                Status
              </Text>
              <Text style={styles.paragraphRight}>Pickup Date</Text>
            </View>
            <View style={styles.container}>
              <Text note style={styles.paragraphLeft}>
                {this.props.navigation.state.params.id_order}
              </Text>
              <Text note style={styles.paragraphCenter}>
                {this.props.navigation.state.params.statussekarang}
              </Text>
              <Text note style={styles.paragraphRight}>
                {this.props.navigation.state.params.jadwal_penjemputan}
              </Text>
            </View>
          </View>
          <View style={{ borderColor: "#008c45", borderWidth: 10 }}>
            <Card transparent>
              <CardItem
                style={{
                  paddingLeft: 0,
                  paddingRight: 0,
                  paddingTop: 0,
                  paddingBottom: 0
                }}
              >
                <Left>
                  <Image
                    source={images}
                    style={{ height: 75, width: 75, resizeMode: "center" }}
                  />
                  <Body>
                    <Text style={{ fontSize: 14 }}>Shipper</Text>
                    <Text note style={{ fontSize: 14, marginBottom: 25 }}>
                      {this.props.navigation.state.params.kode_shipper} -{" "}
                      {this.props.navigation.state.params.nama_shipper}
                    </Text>
                    <View style={styles.leftRightContainer}>
                      <View style={styles.container}>
                        <Text style={styles.paragraphLeft}>Pengemudi</Text>
                        <Text
                          style={{
                            fontSize: 14,
                            textAlign: "right",
                            marginRight: 17
                          }}
                        >
                          Kendaraan
                        </Text>
                      </View>
                      <View style={styles.container}>
                        {this.props.navigation.state.params.drivers !== null ? (
                          <Text note style={styles.paragraphLeft}>
                            {this.props.navigation.state.params.drivers}
                          </Text>
                        ) : (
                          <Text note style={styles.paragraphLeft}>
                            Driver belum assign
                          </Text>
                        )}
                        {this.props.navigation.state.params.external_id !==
                        null ? (
                          <Text
                            note
                            style={{
                              fontSize: 14,
                              textAlign: "right",
                              marginRight: 17
                            }}
                          >
                            {this.props.navigation.state.params.external_id} -
                            {this.props.navigation.state.params.jenis_kendaraan}{" "}
                            -{this.props.navigation.state.params.plat_nomor}
                          </Text>
                        ) : (
                          <Text
                            note
                            style={{
                              fontSize: 14,
                              textAlign: "right",
                              marginRight: 17
                            }}
                          >
                            Mobil belum di assign
                          </Text>
                        )}
                      </View>
                    </View>
                    <Text style={{ fontSize: 14, marginTop: 25 }}>
                      Berat / Dimensi / Jarak / Quantity
                    </Text>
                    <Text note style={{ fontSize: 14 }}>
                      {this.props.navigation.state.params.weight} KG /{" "}
                      {this.props.navigation.state.params.dimension} CBM /{ " "} 
                      {this.props.navigation.state.params.jarak} KM /{" "}
                      {this.props.navigation.state.params.qty !== null
                        ? undefined
                        : "-"}{" "}
                      Unit
                    </Text>
                  </Body>
                </Left>
              </CardItem>
              <CardItem>
                <Left>
                  <Button bordered primary onPress={() => this.setState({isOpen: true})}>
                    <Text
                      uppercase={false}
                      style={{ textAlign: "center", fontSize: 14 }}
                    >
                      Lihat POD
                    </Text>
                  </Button>
                </Left>
                <Right>
                  <Button
                    bordered
                    primary
                    onPress={() =>
                      this.props.navigation.navigate(
                        "OrdersMaps", data
                      )
                    }
                  >
                    <Text
                      uppercase={false}
                      style={{ textAlign: "center", fontSize: 14 }}
                    >
                      Lihat Maps
                    </Text>
                  </Button>
                </Right>
              </CardItem>
            </Card>
          </View>
          <View style={{ marginLeft: 10, marginRight: 10 }}>
            <Timeline
              style={styles.list}
              data={this.data}
              timeStyle={{
                textAlign: "center",
                backgroundColor: "#ff9797",
                color: "white",
                padding: 5,
                borderRadius: 13
              }}
              titleStyle={{ marginTop: -7 }}
              innerCircle={"dot"}
            />
          </View>
        </Content>
        <Modal onRequestClose={()=>this.setState({isOpen: false})} visible={this.state.isOpen} transparent={true} >
          <View style={{flex: 1, jusifyContent: 'center', alignContent:'center', backgroundColor: 'white'}}>
            <Image source={{uri: this.props.navigation.state.params.dokumen_pod}} style={{width: 300, height: 300, alignSelf: 'center'}}/>
          </View>
        </Modal>
      </Container>
    );
  }
}

export default OrdersDetailView;
