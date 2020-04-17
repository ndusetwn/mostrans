import React, { Component } from "react";
import { Image, View, RefreshControl } from "react-native";
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
  Badge
} from "native-base";
import { decrypt, encrypt } from "../../lib/keys";
import AsyncStorage from "@react-native-community/async-storage";
import Loading, { getUrl, setUrl} from "../../api/ApiConstants";
import Axios from "axios";
import NoData from "../../components/NoData";
import images from "../../components/Images";
import styles from "./Detail/styles";
import DateTimePicker from '@react-native-community/datetimepicker';

let url;

class TripsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seg: 1,
      trips: [],
      refreshing: false,
      isLoading: false
    };
  }

  state = {
    date: new Date('2020-06-12T14:42:42'),
    mode: 'date',
    show: false,
  }

  setDate = (event, date) => {
    date = date || this.state.date;

    this.setState({
      show: Platform.OS === 'ios' ? true : false,
      date,
    });
  }

  show = mode => {
    this.setState({
      show: true,
      mode,
    });
  }

  datepicker = () => {
    this.show('date');
  }

  timepicker = () => {
    this.show('time');
  }

  async componentDidMount() {

    console.log('Current route name is : '+ this.props.navigation.state.routeName);

    await setUrl();
    await getUrl().then(result=>{
        url =result;
    });
    console.log(url.select);
    
    // ini utk manggil data ketika aplikasi jalan/reload (fungsi)
    this.fetchData();
  }

  _onRefresh() {
    this.setState({ refreshing: true });
    this.fetchData().then(() => {
      this.setState({ refreshing: false });
    });
  }


  //Ini utk narik data, agar bisa ditampilkan
  fetchData = async () => {
    this.setState({isLoading: true});
    let trid;
    let uid;
    let query;

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
            "          (MMT.JAM_PENGIRIMAN - interval '1' hour ) as JAM_PENGIRIMAN, " +
            "          TO_CHAR(MMT.TANGGAL_SAMPAI, 'dd-Mon-yyyy') TANGGAL_SAMPAI, " +
            "          MMT.JAM_SAMPAI, " +
            "          DATE_PART('day', AGE(MMT.TANGGAL_PENGIRIMAN, now())) ESTIMASI, " +
            "          MMKK.NAMA ASAL, " +
            "          MMKK2.NAMA TUJUAN, " +
            "          MMJK.JENIS_KENDARAAN KEBUTUHANKENDARAAN, " +
            "		       MTU.NAMA DRIVER, " +
            "		       MMK2.EXTERNAL_ID KENDARAAN " +
            "     FROM MT_MASTER_TRIP MMT " +
            "LEFT JOIN MT_MASTER_KOTA MMKK ON MMT.ASAL_ID = MMKK.ID " +
            "LEFT JOIN MT_MASTER_KOTA MMKK2 ON MMT.TUJUAN_ID = MMKK2.ID " +
            "LEFT JOIN MT_MASTER_JENIS_KENDARAAN MMJK ON MMT.JENIS_KENDARAAN_ID = MMJK.ID " +
            "LEFT JOIN MT_MASTER_KENDARAAN MMK2 ON MMT.KENDARAAN_ID = MMK2.ID " +
            "LEFT JOIN MT_MASTER_USER MTU ON MMT.DRIVER_ID = MTU.ID " +
            "    WHERE MMT.TRANSPORTER_ID = " +
            trid +
            "      AND MMT.STATUS = 'planning' " +
            "  ORDER BY TANGGAL_PENGIRIMAN DESC "
          // end of query
        ).then(result => {
          query = result;
        });
        Axios.post(url.select, {
          user_id: uid,
          query: query
        })
          .then(result => {
            this.setState({ trips: result.data.data});
            //Ini panggil datanya bisa, tpi pakai console log pakai , jangan +
            console.log('fetch data trip view : ', result.data.data);
            console.log('fetch data trip view dgn array: ', result.data.data[0]); //isi data tampungan diatas bisa dipanggil di child dengan this.props.navigation.state.params.nama-elelement-nya
            console.log('fetch data trip view dgn array, values: ', result.data.data[0].trip);
            // console.log(JSON.stringify(result));
            //console.log(JSON.stringify(result.data.data));
            // console.log(result.trip);
            // console.log(result.data.data.trip)
          })
          .catch(error => {
            console.log("Error Log: " + error);
          });
      });
    });
    this.setState({isLoading: false});
  };


  render() {
    const { show, date, mode } = this.state;
    return (
      <Container>
        <Header style={{height: 55, paddingTop:0}}>
        <Body style={{marginLeft:10}}>
            <Title>Trips</Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("HTrips")}
            >
              <Icon type="FontAwesome5" name="history" />
            </Button>
          </Right>
        </Header>
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
            this.state.trips.length === 0 ? (
            <NoData /> //If else, jika refresh(isLoading) ternyata data tidak ada maka tidak ditampilkan
          ) : (
            <View>
              <Text style={{backgroundColor:"red", color:"white", textAlign:"center", padding:10, borderRadius:10}}>Batal dalam 30 menit, segera proses.</Text>
              { show && <DateTimePicker value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={this.setDate} />
              }
              {
                this.state.trips.map((value, index) => {
                  return (
                    <Card key={index}>
                      <CardItem
                        header
                        bordered
                        style={[styles.cardPaddingHeader,{
                          backgroundColor: "rgba(0, 140, 69, 0.1)",
                          justifyContent: "center"
                        }]}
                      >
                        <Text style={{ color: "#000000",padding:0,margin:0}}>{value.trip}</Text>
                      </CardItem>
                      <CardItem bordered  style={styles.cardPadding}>
                        <Left >
                          <Body >
                          <View style={{alignSelf: 'stretch', flexDirection: 'row' }}>
                            <View style={{marginRight:10}}>
                              <Text style={{ fontSize: 14 }} >{value.asal} </Text>
                              <Text note>{value.tanggal_pengiriman}</Text>
                              <Text note style={{fontStyle:"italic"}}>{(value.jam_pengiriman.toString()).substring(0,5)}</Text>
                            </View>
                            <View>
                              <Text style={{ fontSize: 14 }} >{value.tujuan} </Text>
                              <Text note>{value.tanggal_sampai}</Text>
                              <Text note style={{fontStyle:"italic"}}>{(value.jam_sampai.toString()).substring(0,5)}</Text>
                            </View>
                          </View>
                          </Body>
                        </Left>
                        <Right style={{justifyContent:"center"}}>
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
                      <CardItem bordered style={styles.cardPadding}>
                        <View style={{alignSelf: 'stretch', flexDirection: 'row' ,width:"50%"}}>
                          <Thumbnail source={images.Logo} />
                          <View>
                            <Text style={{ fontSize: 14 , marginTop:15, marginLeft:10}}>
                              {value.kebutuhankendaraan}
                            </Text>
                          </View>
                        </View>
                        <Right style={{textAlign:"center"}}>
                          <Badge primary style={{ marginTop: 5 }}>
                            <Text style={{ fontSize: 14 }}>
                              {value.estimasi} Hari
                            </Text>
                          </Badge>
                        </Right>
                      </CardItem>
                    </Card>
                  );
                })
              }
            </View>
            
          )}
        </Content>
      </Container>
    );
  }
}

TripsView.propTypes = {
  onLoadTrips: PropTypes.func
};

export default TripsView;
