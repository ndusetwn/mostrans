import React, { Component } from "react";
import { Alert, View, ScrollView } from "react-native";
import Modal from "react-native-modal";
import { decrypt, encrypt } from "../../../lib/keys"; //bljr ini, utk enkrip dan dekrip query
import AsyncStorage from "@react-native-community/async-storage"; //bljr ini utk ngambil data dari db userId, dll
import ApiConstants, {setUrl, getUrl} from "../../../api/ApiConstants"; //bljr ini
import Axios from "axios"; //bljr ini utk crud db
import styles from "./styles";
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
  Subtitle,
  Separator,
  Item,
  Picker,
  Badge
} from "native-base";
import Loading from "../../../api/ApiConstants";
let url;

class TripsDetailView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: [], 
      drivers: [], //biasanya digunakan utk penampilan perulangan, seperti order, drivers, kendaraan, orderid
      kendaraan: [],
      orderid: [],
      reject:[],
      driver: "",
      kendaraanid: "",
      isModalVisible: false,
      isModalVisibleReject: false,
      isLoading: false,
      alasanCancelId: ""
    };
  }

  //DIATAS DIGUNAKAN UTK MENAMPUNG DI this.state.nama-var
  //Lalu bisa digunakan lagi difungsi dengan contoh dibawah

  onValueChangeDriver = value => { //biasanya digunakan pada picker yg select value (bisa milih/combo box)
    this.setState({
      driver: value
    });
  };

  onValueChangeKendaraan = value => {
    this.setState({
      kendaraanid: value
    });
  };

  onValueChangeAlasan = value => {
    this.setState({
      alasanCancelId: value
    })
  }



  modalReject = () => {
    //Isi fungsi modalReject
    let uid;
    let query;
    this.setState({ isModalVisibleReject: !this.state.isModalVisibleReject });

      //console.log("SELECT mt_master_reason.id, mt_master_reason.keterangan from mt_master_reason where mt_master_reason.role = 'T'");

      AsyncStorage.getItem("@uid", async (error, value) => {
        await decrypt(value).then(result => {
          uid = result;
          console.log('user_id : '+ uid);
        });


      await encrypt(
        "SELECT id, keterangan from mt_master_reason where mt_master_reason.role = 'T' and mt_master_reason.id != 7"
      ).then(result => {
        query = result;
      });
      Axios.post(url.select, { //ini apa url.select
        user_id: uid,
        query: query //ini query yg udh di enkrip
      })
        .then(result => {
          this.setState({ reject: result.data.data }); //merubah state kendaraan, result.data.data isinya apa ?
          console.log('testt')
          console.log('Query : '+query); //ini utk coba" query di postman
          console.log('Url console log : '+url.select); //ini utk coba" query di postman
          console.log(result.data.data);
        })
        .catch(error => {
          console.log("Error Log: " + error);
        });
      });
  }




  //dalam modalDriver ada query untuk narik data drivers dan kendaraan
  modalDriver = () => {
    let trid;
    let uid;
    let query;
    this.setState({ isModalVisible: !this.state.isModalVisible });

    //Ngambil userId, dan ngambil transporterId
    AsyncStorage.getItem("@uid", async (error, value) => {
      await decrypt(value).then(result => {
        uid = result;
      });
      AsyncStorage.getItem("@trid", async (error, value) => {
        await decrypt(value).then(result => {
          trid = result;
        });


        await encrypt(
          "SELECT ID, NAMA, HP, EMAIL FROM MT_MASTER_USER WHERE ROLE = 'DRIVER' AND ACTIVE = 'A' AND TRANSPORTER_ID = " +
            trid
        ).then(result => {
          query = result; //menyimpan result query didalam variabel query
        });

        Axios.post(url.select, { //ini apaa ?
          user_id: uid,
          query: query
        })
          .then(result => {
            this.setState({ drivers: result.data.data }); // lalu nampung, semua datanya di drivers, yg udh dideklarasiin di state atas
          })
          .catch(error => {
            console.log("Error Log: " + error);
          });


        await encrypt(
          "SELECT MMK.ID, MMK.EXTERNAL_ID, MMK.JENIS_KENDARAAN, MMK.PLAT_NOMOR FROM MT_MASTER_KENDARAAN MMK LEFT JOIN MT_MASTER_POOL MMP ON MMP.ID = MMK.POOL_ID WHERE MMK.ACTIVE = 'A' AND MMP.TRANSPORTER_ID = " +
            trid
        ).then(result => {
          query = result;
        });
        Axios.post(url.select, { //ini apa url.select
          user_id: uid,
          query: query //ini query yg udh di enkrip
        })
          .then(result => {
            this.setState({ kendaraan: result.data.data }); //merubah state kendaraan, result.data.data isinya apa ?
          })
          .catch(error => {
            console.log("Error Log: " + error);
          });
      });
    });
  };


  //componentDidMount itu setiap kali dibuka halamannya, maka dia logik yg pertama kali dijalankan
  async componentDidMount() {
    this.setState({ isLoading: true });
    await setUrl();
    await getUrl().then(result=>{
        url =result;
    });
    AsyncStorage.getItem("@uid", async (error, value) => {
      await decrypt(value).then(result => {
        uid = result;
      });
      await encrypt(
        // begin of query
        "   SELECT MSO.ID_ORDER, MSO.WEIGHT, MSO.DIMENSION, MSO.SHIPPER_ID, MMU.NAMA DRIVERS, " +
          "	         MMK.EXTERNAL_ID, MMK.PLAT_NOMOR, MMJK.JENIS_KENDARAAN, " +
          "	         INITCAP(MSOT.NAMA) STATUSSEKARANG, SUM(MSOD.QTY) QTY, " +
          "	         MMS.KODE_SHIPPER, MMS.NAMA_SHIPPER, MMS.PHONE, " +
          "	         MMS.FOTO_LOGO, MSO.TIPE_KENDARAAN, MSO.FEE, " +
          "	   	     MSO.LENGTH, MSO.WIDTH, MSO.HEIGHT, " +
          "          INITCAP(TO_CHAR((MSO.JADWAL_PENJEMPUTAN - interval '1' hour)  , 'DD-MON-YYYY HH24:MI:ss')) JADWAL_PENJEMPUTAN, " +
          "	   	     MSCA.NAMA_PERUSAHAAN ASALPERUSAHAAN, MSCA.ALAMAT1 ASALALAMAT, " +
          "	  	     MSCA.ALAMAT2 ASALALAMAT2, MSCA.PHONE ASALPHONE, " +
          "  	       MSCA.KOTA ASALKOTA, MSCA.KODE_POS ASALKODEPOS, " +
          "	         MSCA.LAT ASALLAT, MSCA.LANG ASALLANG, " +
          "	         MSCB.NAMA_PERUSAHAAN TUJUANPERUSAHAAN, MSCB.ALAMAT1 TUJUANALAMAT, " +
          "          MSCB.ALAMAT2 TUJUANALAMAT2, MSCB.PHONE TUJUANPHONE, " +
          "	         MSCB.KOTA TUJUANKOTA, MSCB.KODE_POS TUJUANKODEPOS, " +
          "	  	     MSCB.LAT TUJUANLAT, MSCB.LANG TUJUANLANG, " +
          "	         MSO.TIPE_MUATAN, MSO.TIPE_ARMADA, MSO.DOKUMEN_POD, " +
          "          ROUND(CAST(ST_Distance_Sphere( " +
          "                     ST_GeomFromText('POINT(' || MSCA.LANG || ' ' || MSCA.LAT || ')', 4326), " +
          "                     ST_GeomFromText('POINT(' || MSCB.LANG || ' ' || MSCB.LAT || ')', 4326)) " +
          "                     AS NUMERIC) / 1000, 2) JARAK " +
          "     FROM MT_TRIP_ORDER_TRANSACTION MTOT " +
          "LEFT JOIN MT_SHIPPER_ORDER MSO ON MTOT.ORDER_ID = MSO.ID " +
          "LEFT JOIN MT_SHIPPER_ORDER_DETAIL MSOD ON MSOD.ORDER_ID = MSO.ID " +
          "LEFT JOIN MT_SHIPPER_ORDER_STATUS MSOT ON MSO.STATUS = MSOT.ID " +
          "LEFT JOIN MT_MASTER_SHIPPER MMS ON MMS.ID = MSO.SHIPPER_ID " +
          "LEFT JOIN MT_SHIPPER_CONTACT MSCA ON MSCA.ID = MSO.ASAL_ID " +
          "LEFT JOIN MT_SHIPPER_CONTACT MSCB ON MSCB.ID = MSO.TUJUAN_ID " +
          "LEFT JOIN MT_MASTER_TRIP MMT ON MMT.ID = MTOT.TRIP_ID " +
          "LEFT JOIN MT_MASTER_USER MMU ON MMU.ID = MMT.DRIVER_ID " +
          "LEFT JOIN MT_MASTER_KENDARAAN MMK ON MMK.ID = MMT.KENDARAAN_ID " +
          "LEFT JOIN MT_MASTER_JENIS_KENDARAAN MMJK ON MMJK.ID = MMK.JENIS_KENDARAAN " +
          "    WHERE MTOT.TRIP_ID = " +
          this.props.navigation.state.params.id +
          " GROUP BY MSO.ID_ORDER, MSO.WEIGHT, MSO.DIMENSION, MSO.SHIPPER_ID, MMU.NAMA, " +
          "     	   MMK.EXTERNAL_ID, MMK.PLAT_NOMOR, MMJK.JENIS_KENDARAAN, " +
          "	         MSOT.NAMA, MMS.KODE_SHIPPER, MMS.NAMA_SHIPPER, MMS.PHONE, " +
          "	         MMS.FOTO_LOGO, MSO.TIPE_KENDARAAN, MSO.FEE, " +
          "	         MSO.LENGTH, MSO.WIDTH, MSO.HEIGHT, MSO.JADWAL_PENJEMPUTAN, " +
          "	         MSCA.NAMA_PERUSAHAAN, MSCA.ALAMAT1, " +
          "	         MSCA.ALAMAT2, MSCA.PHONE, " +
          "  	       MSCA.KOTA, MSCA.KODE_POS, " +
          "	         MSCA.LAT, MSCA.LANG, " +
          "		       MSCB.NAMA_PERUSAHAAN, MSCB.ALAMAT1, " +
          "          MSCB.ALAMAT2, MSCB.PHONE, " +
          "	         MSCB.KOTA, MSCB.KODE_POS, " +
          "	         MSCB.LAT, MSCB.LANG, " +
          "	         MSO.TIPE_MUATAN, MSO.TIPE_ARMADA, MSO.DOKUMEN_POD"
        // end of query
      ).then(result => {
        query = result;
      });
      
      Axios.post(url.select, {
        user_id: uid,
        query: query
      })
        .then(result => {
          this.setState({ order: result.data.data });
        })
        .catch(error => {
          console.log("Error Log: " + error);
        });
    });
    this.setState({ isLoading: false });
  }

  // reject = async () => {
    
  //   Alert.alert(
  //     'REJECT TRIP',
  //     'Apakah anda yakin ?',
  //     [
  //       {
  //         text: 'Cancel',
  //         onPress: () => console.log('Cancel Pressed'),
  //         style: 'cancel',
  //       },
  //       {
  //           text: 'OK', 
  //           onPress: () => {
  //             console.log('OK Pressed fix reject') //Next lakukan query
  //             console.log('Buat query disini')
  //           }
            
  //       },
  //     ],
  //     {cancelable: false},
  //   );
  // };


rejectTrip = async () => {
  console.log('======================')
  console.log('Fix Reject Trip');
  console.log('Lakukan query reject trip')

  this.setState({isLoading: true});
  let query;
  let trid;

  AsyncStorage.getItem("@uid", async (error, value) => {
    await decrypt(value).then(result => {
      uid = result;
      console.log('user_id : '+ uid);
    });

    AsyncStorage.getItem("@trid", async (error, value) => {
      await decrypt(value).then(result => {
        trid = result;
        console.log('trid : '+ trid);
      });
        //update_by : trid // itu transporter id
        //where id_trip : this.props.navigation.state.params.trip



        await encrypt(
          "UPDATE mt_master_trip SET update_by = " + trid +", update_date=now(), status = 'reject', reason_cancel_id = " + this.state.alasanCancelId +
          "where id_trip = '" + this.props.navigation.state.params.trip +"'"
        ).then(result => {
          query = result;
          console.log('query reject-trip: '+query)
          console.log('url query: '+url.select)
          
        });

        Axios.post(url.select, {
          query: query 
        })
          .then(result => {
            
            let temp = result.data.data[0];
            
            Alert.alert("Data berhasil direject","",[
              {
                text: 'Ok',
                onPress: ()=>this.props.navigation.replace('Home') //parameter OK dari alert, lalu ke fungsi onPress
              }
            ]);
          })
          .catch(error => {
            console.log(error);
          });
        this.setState({isLoading: false});
        

      });
      this.setState({isLoading: false});
    });
}


  assign = async () => {
    this.setState({isLoading: true});
    let query;
    let trid;

    await AsyncStorage.getItem("@trid", async (error, value) => {
      
      await decrypt(value).then(result => {
        trid = result;
      });

    //Cek query di console
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++UPDATE MT_MASTER_TRIP SET DRIVER_ID = " +
    this.state.driver +
    ", KENDARAAN_ID = " +
    this.state.kendaraanid + ", update_date=now(), update_by=" + trid +"  WHERE ID_TRIP = '" +this.props.navigation.state.params.trip+"'++++++++++++++++++++++=");
    
    await encrypt(
      "UPDATE MT_MASTER_TRIP SET DRIVER_ID = " +
        this.state.driver +
        ", KENDARAAN_ID = " +
        this.state.kendaraanid + ", update_date=now(), update_by=" + trid +"  WHERE ID_TRIP = '" +this.props.navigation.state.params.trip+"'"
        // ", STATUS='confirm' WHERE ID_TRIP = '" +
        // this.props.navigation.state.params.trip +
        // "' and STATUS = 'planning'"
    ).then(result => {
      query = result;
    });
    Axios.post(url.select, {
      query: query
    })
      .then(result => {
        let temp = result.data.data[0];
        
        Alert.alert("Data berhasil tersimpan","",[
          {
            text: 'Ok',
            onPress: ()=>this.props.navigation.replace('Home') //parameter OK dari alert, lalu ke fungsi onPress
          }
        ]);
      })
      .catch(error => {
        console.log(error);
      });
    this.setState({isLoading: false});
    });
    
  };




  confirm = async () => {
    
    let query;
    console.log("======== query start ========");
    console.log("UPDATE MT_MASTER_TRIP SET STATUS = 'confirm' WHERE ID_TRIP = '" +
    this.props.navigation.state.params.trip +
    "'");
    //Diatas untuk ngecek query, yg bawah dikomen dulu

    await encrypt(
      "UPDATE MT_MASTER_TRIP SET STATUS = 'confirm' WHERE ID_TRIP = '" +
        this.props.navigation.state.params.trip +
        "'"
    ).then(result => {
      query = result;
    });
    Axios.post(url.select, {
      query: query
    })

      .then(result => {
        let temp = result.data.data[0];
      })
      .catch(error => {
        console.log(error);
      });

      console.log("SELECT ORDER_ID FROM MT_TRIP_ORDER_TRANSACTION WHERE TRIP_ID = '" +
      this.props.navigation.state.params.id +
      "'");
    await encrypt(
      "SELECT ORDER_ID FROM MT_TRIP_ORDER_TRANSACTION WHERE TRIP_ID = '" +
        this.props.navigation.state.params.id +
        "'"
    ).then(result => {
      query = result;
    });
    Axios.post(url.select, {
      user_id: uid,
      query: query
    })
      .then(result => {
        this.setState({ orderid: result.data.data });
        for (let data of this.state.orderid) {
          AsyncStorage.getItem("@trid", async (error, value) => {
            await decrypt(value).then(result => {
              trid = result;
            });
            console.log("UPDATE MT_SHIPPER_ORDER SET STATUS = '2', CONFIRMED_DATE = NOW(), CONFIRMED_BY = '" + trid + "' " +
            "WHERE ID = '" + data.order_id + "'");
            await encrypt(
              "UPDATE MT_SHIPPER_ORDER SET STATUS = '2', CONFIRMED_DATE = NOW(), CONFIRMED_BY = '" + trid + "' " +
              "WHERE ID = '" + data.order_id + "'"
            ).then(result => {
              query = result;
            });
            Axios.post(url.select, {
              query: query
            })
            .then(result => {
              let temp = result.data.data[0];
            })
            .catch(error => {
              console.log(error);
            });
          });
        }
        Alert.alert("Data berhasil tersimpan","",[
          {
            text: 'Ok',
            onPress: ()=>this.props.navigation.replace('Home')
          }
        ]);
      })
      .catch(error => {
        console.log("Error Log: " + error);
      });
    console.log("======== query end ========");
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
            <Title>Trip</Title>
            <Subtitle>{this.props.navigation.state.params.trip}</Subtitle>
          </Body>
          <Right />
        </Header>
        <Content padder>
          <Text style={{ fontSize: 14 }}>Nomor Trip:</Text>
          <Text note>{this.props.navigation.state.params.trip}</Text>
          {/* Kalo diatas, juga diambil dari database */}
          <Separator />
          <Text note>Tujuan</Text>
          <Text style={{ fontSize: 14, marginBottom: 15 }}>
            {this.props.navigation.state.params.asal} -{" "}
            {this.props.navigation.state.params.tujuan}
          </Text>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <Text note>Status Trip</Text>
              <Text style={{ fontSize: 14, marginBottom: 30 }}>
                {this.props.navigation.state.params.status}
              </Text>
              <Text note>Driver</Text>
              {this.props.navigation.state.params.driver !== null ? (
                <Text style={{ fontSize: 14, marginBottom: 15 }}>
                  {this.props.navigation.state.params.driver}
                </Text>
              ) : (
                <Text style={{ fontSize: 14, marginBottom: 15 }}>
                  Driver belum di assign
                </Text>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text note>Kebutuhan Kendaraan</Text>
              <Text style={{ fontSize: 14, marginBottom: 15 }}>
                {this.props.navigation.state.params.kebutuhankendaraan}
                {/* ============================================== */}
                {/* Kalo ini contoh ngambil data dari db, dan bawahnya contoh if else ngecek dari db */}
              </Text>
              <Text note>Kendaraan</Text>
              {this.props.navigation.state.params.kendaraan !== null ? (
                <Text style={{ fontSize: 14, marginBottom: 15 }}>
                  {this.props.navigation.state.params.kendaraan}
                </Text>
              ) : (
                <Text style={{ fontSize: 14, marginBottom: 15 }}>
                  Kendaraan belum di assign
                </Text>
              )}
            </View>
          </View>
          <Separator />
          <Text style={{ fontSize: 14, marginBottom: 15 }}>Daftar Order</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {this.state.order.map((value, index) => {
              return (
                <Card key={index}>
                  <CardItem
                    bordered
                    button
                    onPress={() =>
                      this.props.navigation.navigate("OrdersDetail", value) //inget bisa ngelempar value
                    }
                  >
                    <Left>
                      <Body>
                        <Text style={{ fontSize: 14 }}>Order: </Text>
                        <Text note>{value.id_order}</Text>
                      </Body>
                    </Left>
                  </CardItem>
                </Card>
              );
            })}
          </ScrollView>
        </Content>

      <View style={{flexDirection: 'row', justifyContent: "center", alignItems: "center"}}>
        {this.props.navigation.state.params.status !== 'Close' &&  this.props.navigation.state.params.status !== 'Reject' && this.props.navigation.state.params.status !== 'Cancel'? 
        // <Button full warning onPress={this.modalDriver}>
        //   {/* Kalo klik disini, menuju fungsi modalDriver */}
        //   <Text uppercase={false}>Assign Driver</Text>
        // </Button>
        <Button warning block style={{ margin: 10, borderRadius: 5, flex: 1}} onPress={this.modalDriver}>
          <Icon type="MaterialCommunityIcons" name='steering' />
          <Text uppercase={false}>Assign Driver</Text>
        </Button>
        : false}
      </View>


      <View style={{flexDirection: 'row', justifyContent: "center", alignItems: "center"}}>
        {this.props.navigation.state.params.status === 'Planning' ? 
          // <Button full danger onPress={this.reject} style={{ marginBottom: 15, marginTop: 15 }}>
          //   <Text uppercase={false}>Reject</Text>
          // </Button>
          <Button danger block style={{ margin: 10, borderRadius: 5, flex: 1}} onPress={this.modalReject}>
            <Icon type="MaterialCommunityIcons" name='close-circle-outline' />
            <Text uppercase={false}>Reject</Text>
          </Button>
          : false
        }

        {this.props.navigation.state.params.status === 'Planning' ? 
          // <Button full success onPress={this.confirm}>
          //   <Text uppercase={false}>Confirm</Text>
          // </Button>
          <Button success block style={{ margin: 10, borderRadius: 5, flex: 1 }} onPress={this.confirm}>
            <Icon type="MaterialCommunityIcons" name='check-circle-outline' />
            <Text uppercase={false}>Confirm</Text>
          </Button>
          : false }
        </View>


        {/* Modal Assign Driver */}
        <Modal
          isVisible={this.state.isModalVisible}
          onBackdropPress={this.modalDriver}
          onRequestClose={()=>this.setState({isModalVisible: false})}
        >
          <View style={styles.content}>
            <Text style={{ fontSize: 14 }}>Nomor Trip:</Text>
            <Text note>{this.props.navigation.state.params.trip}</Text>
            {/* Mengambil nilai data trip dari db */}
            <Text style={{ marginTop: 10, fontSize: 14 }}>Drivers</Text>
            <Item picker>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                placeholder="Select Drivers"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.driver}
                onValueChange={this.onValueChangeDriver} //Digunakan khusus jika menggunakan value
              >
                {/* kyknya ini dan atas mengamil query yg berbeda */}
                {this.state.drivers.map((value, index) => {
                  return (
                    <Picker.Item
                      label={value.nama}
                      value={value.id}
                      key={index}
                    />
                  );
                })}
              </Picker>
            </Item>
            <Text style={{ marginTop: 10, fontSize: 14 }}>Kendaraan</Text>
            <Item picker>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                placeholder="Select Kendaraan"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.kendaraanid}
                onValueChange={this.onValueChangeKendaraan}
              >
                {/* kyknya ini dan atas mengamil query yg berbeda */}
                {this.state.kendaraan.map((value, index) => {
                  return (
                    <Picker.Item
                      label={value.external_id + " - " + value.plat_nomor}
                      value={value.id}
                      key={index}
                    />
                  );
                })}
              </Picker>
            </Item>
            {/* <Button
              transparent
              onPress={this.assign}
              style={{ alignSelf: "flex-end", marginTop: 20 }}
            >
              <Text uppercase={false}>Assign</Text>
              
            </Button> */}

            <Button
              warning
              onPress={this.assign}
              style={{ alignSelf: "flex-end", marginTop: 20, borderRadius: 5 }}
            >
              <Text uppercase={false}>Assign</Text>
              
            </Button>
          </View>
        </Modal>


        {/* Modal Reject */}
        <Modal 
        isVisible={this.state.isModalVisibleReject}
        onBackdropPress={this.modalReject}
        onRequestClose={()=>this.setState({isModalVisibleReject: false})}
        animationIn='bounceIn'
        animationOut= 'bounceOut'
        >
          <View style={styles.content}>
            <Text style={{color: 'black'}}>Reject Trip</Text>
            <Text note>Alasan reject</Text>
            <Item picker>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{ width: undefined }}
                placeholder="Pilih alasan anda"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.alasanCancelId}
                onValueChange={this.onValueChangeAlasan.bind(this)} //Disini tempat untuk menampung valuenya, cek di onValueChange
           
              >
                {/* kyknya ini dan atas mengamil query yg berbeda */}
                {this.state.reject.map((value, index) => {
                  return (
                    <Picker.Item
                      label={value.keterangan}
                      value={value.id}
                      key={index}
                    />
                  );
                })}
              </Picker>
            </Item>
            <Button
              danger
              onPress={this.rejectTrip}
              style={{ alignSelf: "flex-end", marginTop: 20, borderRadius: 5 }}
            >
              <Text uppercase={false}>Reject</Text>
              
            </Button>
          </View>
        </Modal>
        {this.state.isLoading ? <Loading/> : false}
      </Container>
    );
  }
}

export default TripsDetailView;
