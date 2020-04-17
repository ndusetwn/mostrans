import React, { Component } from "react";
import { View, Image, RefreshControl } from "react-native";
import styles from "./styles";
import NoData from "../../../components/NoData";
import PropTypes from "prop-types";
import {
  Body,
  Text,
  Card,
  CardItem,
  Container,
  Content,
  Header,
  Right,
  Button,
  Title,
  Icon,
  Left,
  Thumbnail,
  Badge,
  ActionSheet
} from "native-base";
import images from "../../../components/Images";
let url;
import Loading, { getUrl, setUrl} from "../../../api/ApiConstants";
import AsyncStorage from "@react-native-community/async-storage";
import { decrypt, encrypt } from "../../../lib/keys";
import Axios from "axios";

let BUTTONS = ["All", "Planning", "Confirm", "Accepted", "Close", "Cancel", "Reject"];

class HTripsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seg: 1,
      trips: [],
      refreshing: false,
      isLoading: false,
      filter: 'All'
    };
  }

  async componentDidMount() {
    await setUrl();
    await getUrl().then(result=>{
        url =result;
    });
    console.log(url.select);
    this.fetchData();
  }

  _onRefresh() {
    this.setState({ refreshing: true });
    this.fetchData().then(() => {
      this.setState({ refreshing: false });
    });
  }


  //Ini utk ngambil data
  fetchData = async () => {
    let trid;
    let uid;
    let query;
    this.setState({ isLoading: true});

    AsyncStorage.getItem("@uid", async (error, value) => {
      await decrypt(value).then(result => {
        uid = result;
      });
      AsyncStorage.getItem("@trid", async (error, value) => {
        await decrypt(value).then(result => {
          trid = result;
        });
        await encrypt(
          // begin of query
          "   SELECT MMT.ID, " +
            "          MMT.ID_TRIP TRIP, " +
            "          INITCAP(MMT.STATUS) STATUS, " +
            "          TO_CHAR(MMT.TANGGAL_PENGIRIMAN, 'dd-Mon-yyyy') TANGGAL_PENGIRIMAN, " +
            "          MMT.JAM_PENGIRIMAN, " +
            "          TO_CHAR(MMT.TANGGAL_SAMPAI, 'dd-Mon-yyyy') TANGGAL_SAMPAI, " +
            "          MMT.JAM_SAMPAI, " +
            "          DATE_PART('day', AGE(MMT.TANGGAL_PENGIRIMAN, now())) ESTIMASI, " +
            "          MMKK.NAMA ASAL, " +
            "          MMKK2.NAMA TUJUAN, " +
            "          MMJK.JENIS_KENDARAAN KEBUTUHANKENDARAAN, " +
            "		       MTU.NAMA DRIVER, " +
            "		       MMK2.PLAT_NOMOR KENDARAAN " +
            "     FROM MT_MASTER_TRIP MMT " +
            "LEFT JOIN MT_MASTER_KOTA MMKK ON MMT.ASAL_ID = MMKK.ID " +
            "LEFT JOIN MT_MASTER_KOTA MMKK2 ON MMT.TUJUAN_ID = MMKK2.ID " +
            "LEFT JOIN MT_MASTER_JENIS_KENDARAAN MMJK ON MMT.JENIS_KENDARAAN_ID = MMJK.ID " +
            "LEFT JOIN MT_MASTER_KENDARAAN MMK2 ON MMT.KENDARAAN_ID = MMK2.ID " +
            "LEFT JOIN MT_MASTER_USER MTU ON MMT.DRIVER_ID = MTU.ID " +
            "    WHERE MMT.TRANSPORTER_ID = " +
            trid +
            "      AND MMT.STATUS != 'planning' AND MMT.TANGGAL_PENGIRIMAN >= (current_date - interval '1' month) " +
            "  ORDER BY MMT.TANGGAL_PENGIRIMAN DESC, MMT.JAM_PENGIRIMAN DESC"
          // end of query
        ).then(result => {
          query = result;
        });
        Axios.post(url.select, {
          user_id: uid,
          query: query
        })
          .then(result => {
            this.setState({ trips: result.data.data });
          })
          .catch(error => {
            console.log("Error Log: " + error);
          }).finally(()=>{
            this.setState({ isLoading: false});
          });
      });
    });
  };
  actionButton = ()=>{
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: 0,
        destructiveButtonIndex: 0,
      },
      buttonIndex=>{
        this.setState({ filter: BUTTONS[buttonIndex]});
      }
    )
  }
  render() {
    return (
      <Container>
        <Header style={{height: 55, paddingTop:0}}>
        <Body style={{marginLeft:10}}>
            <Title>All Trips</Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => this.props.navigation.goBack()}
            >
              <Text>Kembali</Text>
            </Button>
          </Right>
        </Header>
        <Button style={styles.buttonFilter} onPress={this.actionButton}><Text>Filter: {this.state.filter}</Text></Button>
        <Content
          padder
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          contentContainerStyle={{
            justifyContent: this.state.trips.length === 0 ? "center" : undefined,
            flex: this.state.trips.length === 0 ? 1 : undefined
          }}
        >
          { this.state.isLoading ? <Loading/> :
            this.state.trips.length === 0 ?  <Text style={{alignSelf: 'center'}}>Tidak ada Data</Text> 
            :
            this.state.trips.map((value, index) => {
              if (this.state.filter === 'All' || this.state.filter === value.status)
              return (
                <Card key={index}>
                  <CardItem
                    header
                    bordered
                    style={{
                      backgroundColor: "rgba(0, 140, 69, 0.1)",
                      justifyContent: "center"
                    }}
                  >
                    <Text style={{ color: "#000000" }}>{value.status}</Text>
                  </CardItem>
                  <CardItem bordered>
                    <Left>
                      <Body>
                        <Text note>{value.tanggal_pengiriman} {value.jam_pengiriman}</Text>
                        <Text style={{ fontSize: 14 }}>{value.trip}</Text>
                      </Body>
                    </Left>
                    <Right>
                      <Button
                        iconRight
                        transparent
                        primary
                        onPress={() =>
                          this.props.navigation.navigate("TripsDetail", value)
                        }
                      >
                        <Text>Detail</Text>
                        <Icon name="md-arrow-dropright" />
                      </Button>
                    </Right>
                  </CardItem>
                  <CardItem bordered>
                    <Left>
                      <Thumbnail source={images.Logo} />
                      <Body>
                        <Text style={{ fontSize: 14 }}>
                          {value.asal} - {value.tujuan}
                        </Text>
                      </Body>
                    </Left>
                    {/* <Right>
                      <Badge primary style={{ marginBottom: 15 }}>
                        <Text style={{ fontSize: 14 }}>
                          {value.estimasi} Hari
                        </Text>
                      </Badge>
                    </Right> */}
                  </CardItem>
                </Card>
              );
            })
          }
        </Content>
      </Container>
    );
  }
}

HTripsView.propTypes = {
  onLoadTrips: PropTypes.func
};

export default HTripsView;