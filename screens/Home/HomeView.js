import React, { Component, useEffect } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Left,
  Right,
  Body,
  Text,
  Icon,
  Card,
  CardItem,
  Grid,
  Row,
  View,
  Col
} from "native-base";
import { AppState,Platform,Dimensions, Image, FlatList , TouchableOpacity,ScrollView, ImageBackground, BackHandler, Alert } from "react-native";
import { WebView } from "react-native-webview";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import styles from "./styles";
import { decrypt, encrypt } from "../../lib/keys";
import Loading, { getUrl, setUrl} from "../../api/ApiConstants";
import getTheme from "../../../theme/components";
import material from "../../../theme/variables/material";
import AsyncStorage from "@react-native-community/async-storage";
import PieChart from 'react-native-pie-chart';
import Axios from 'axios';
import Modal from 'react-native-modal';
import SearchableDropdown from 'react-native-searchable-dropdown';
import MapViewDirections from 'react-native-maps-directions';
import Timeline from 'react-native-timeline-listview'
import Spinner from 'react-native-loading-spinner-overlay';
import {Subscription} from 'react-apollo';
import gql from "graphql-tag";
import VIForegroundService from '@voximplant/react-native-foreground-service';
import BackgroundTimer from 'react-native-background-timer';
import LoginView from '../Login/LoginView';
import LinearGradient from 'react-native-linear-gradient';
// import ProgressBar from 'react-native-progress/Bar';
// import ProgressPie from 'react-native-progress/Pie';
//import * as Progress from 'react-native-progress';
import ProgressBar from 'react-native-progress/Bar';
import ProgressPie from 'react-native-progress/Pie';
import ProgressCircle from 'react-native-progress/Circle';

//Range date picker
import moment from 'moment';
import DateRangePicker from 'react-native-daterange-picker';

//Search filter
import SearchInput,{ createFilter } from 'react-native-search-filter';
// import emails from './emails';
//ini mau ngambil apa
const KEYS_TO_FILTERS = ['id_trip', 'nama_shipper', 'kota_asal', 'kota_tujuan', 
'plat_nomor', 'nama_driver', 'tanggal_pengiriman', 'tanggal_sampai', 'jenis_kendaraan'];

// import RNLocalNotifications from 'react-native-local-notifications';

var logoTruck = require('../../../assets/images/truck_small.png')
var logoMostrans = require('../../../assets/images/logo.png')
var logoPin = require('../../../assets/images/pin2.png')

// var loadingIcon = require('../../../assets/json/loader.json')

var { width, height } = Dimensions.get("window");
let url;
const ASPECT_RATIO = width / height;
const LATITUDE = -6.117664;
const LONGITUDE = 106.906349;
const LATITUDE_DELTA = 1;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const dataMonth = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const GOOGLE_MAPS_APIKEY = "AIzaSyCzNbgMZ4KM4oiYTozTV7kDXol30YWfr3Q";
const origin = {latitude: -6.1833572, longitude: 106.91568940000002};
const destination = {latitude: -6.189466811050627, longitude: 106.9115986599495};
const keteranganStatus = [
  "Shipper Order : ",
  "Order Diterima : ",
  "Driver Konfirmasi : ",
  "Tiba Lokasi Muat : ",
  "Mulai Muat : ",
  "Selesai Muat : ",
  "Mulai Perjalanan : ",
  "Tiba Lokasi Bongkar : ",
  "Mulai Bongkar : ",
  "Selesai Bongkar : ",
  "POD Dokumen : "
]

const statusDetail = [
  "Planning",
  "Confirmed",
  "Accepted",
  "Arrival",
  "Start Loaded",
  "Finish Loaded",
  "On The Way",
  "Dropoff",
  "Start Unloaded",
  "Finish Unloaded",
  "POD"
]

const COMMENTS_SUBSCRIPTION=gql`
    subscription ($transporter_id: String) {
      tripAdded(transporter_id:$transporter_id){
        countNewTrip
        transporter_id
      }
    }
`;



class HomeView extends Component {
  constructor(props) {
    super(props);



    //this.handleBackButton = this.handleBackButton.bind(this);
    this.state = {
      trans_id:0,
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      searchTerm: "",
      startDate: moment(),
      endDate: moment(),
      displayedDate: moment(),
      startDatePick: "",
      endDatePick: "",
      getCountKonfirmasi: 0,
      getCountKonfirmasiPercentage: 0,
      getCountKedatangan: 0,
      getCountKedatanganPercentage: 0,
      getCountPengiriman: 0,
      getCountPengirimanPercentage: 0,
      getCountOnTime: 0,
      getCountOnTimePercentage: 0,
      getCountJumlahPesanan:0,
      getCountSudahKonfirmasi: 0,
      getCountBelumKonfirmasi: 0,
      getCountBatal: 0,
      getCountSudahDatang: 0,
      getCountBelumDatang: 0,
      getCountSudahBerangkat: 0,
      getCountBelumBerangkat: 0,
      getCountPOD: 0,
      getMtdPesan: 0,
      getMtdPesanPercentage: 0,
      getMtdTepat: 0,
      getMtdTepatPercentage: 0,
      getMtdTerlambat: 0,
      getMtdTerlambatPercentage: 0,
      getMtdBatal: 0,
      getMtdBatalPercentage: 0,
      getCountOccupancy: 0,
      getCountOccupancyPercentage: 0,
      getKendaraanIdle: 0,
      elevation: 5,
      countPlanningTrip:0,
      countActiveTrip:0,
      countArmadaTrip:0,
      allTripActive:[],
      allTripArmada:[],
      activeTripArr:[],
      armadaTripArr:[],
      displayModal:'Active',
      markerData:[],
      performanceData:[1,1,1],
      percentageConfirm:0,
      isLoading:false,
      periodeRapor: "Agustus 2019",
      modalVisible: false,
      modalDetailOrderVisible:false,
      dataMasterKota:[],
      dataMasterShipper:[],
      dataMasterKendaraan:[],
      searchByShipper:"",
      searchByPlat:"",
      searchByAsal:"",
      searchByTujuan:"",
      displayDetailTrip:false,
      totalOrderPerformance:0,
      modalDashboardVisible: false,
      judulDashboard: "",
      indexData:{
        id:1,
        id_trip:"TRIP-2019082010",
        nama_shipper:"PT. Enseval PM",
        kota_asal:"Jakarta Timur",
        kota_tujuan:"Bogor",
        tanggal_pengiriman:"2019-09-19",
        jam_pengiriman:"08:00:00",
        tanggal_sampai:"2019-09-20",
        jam_sampai:"13:00:00",
        status:"accepted",
        jenis_kendaraan:"Cold Diesel Double (CDD) - 11CBM / 4000KG",
        nama_driver:"Dony",
        plat_nomor:"B208KX"
      },
      daftarOrder:[
        {
          id_order:"EPM180123129",
          asal_order:"Jakarta Timur",
          tujuan_order:"Bogor",
          status_detail:"OnTheWay"
        },
        {
          id_order:"EPM180123120",
          asal_order:"Jakarta Timur",
          tujuan_order:"Bogor",
          status_detail:"Arrival"
        }
      ],
      arrAsal:[],
      arrTujuan:[],
      selectedTripLocDriver:null,
      selectedOrder:{
        id_order:"EPM180123120",
        nama_shipper:"PT. Enseval PM",
        status:3,
        status_detail:"Arrival",
        jadwal_sampai:"2019-10-09T10:00:00",
        jadwal_penjemputan:"2019-10-09",
        foto_logo:"https://firebasestorage.googleapis.com/v0/b/mostrans-storage.appspot.com/o/LogoShipper%2F2.png?alt=media",
        asal_perusahaan:"PT. Bintang Toedjoe",
        tujuan_perusahaan:"PT. Enseval Pulogadung",
        booked_date:"2019-07-05T11:05:16",
        confirmed_date:"2019-07-05T11:11:16",
        accepted_date:"2019-07-05T11:13:16"
      },
      timelineData:[
        {time: '09:00', title: 'Planning', description: 'Shipper Order: 2019-05-01'}
      ],
      arrDetailOrder:[]
    };
  }


  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }

  setDates = dates => {

    this.setState({
      ...dates,
    });
    
    console.log('dates :', dates)
    // console.log('dates start : ',dates.startDate)
    //if condition utl set state startDate diawal pake dates.startDate

    // this.setState({
    //   startDatePick: dates.startDate
    // })
    // console.log('start with state: ', this.state.startDatePick)
    // console.log('dates end : ', dates.endDate)
    


    if(dates.endDate == null || typeof(dates.endDate) === 'undefined'){
      this.setState({
        endDate: dates.startDate
      })
    }
    console.log('start with state: ', this.state.startDate)
    console.log('end with state : ', this.state.endDate)

    console.log('displayedDate : ', dates.displayedDate)


    this.getCountDashboard();
    this.getOccupancy();
    this.getCountKendaraanIdle();
    
  };

  testClick = () => {
    console.log(this.state.startDate)
    console.log(this.state.endDate)

    let x = this.state.startDate
    let y = this.state.endDate

    console.log('x :', typeof(x.format('YYYY-MM-DD')))
    console.log('y :', y.format('YYYY-MM-DD'))
  }

  onCloseDates = (x,y) =>{
    console.log('hasil lemparan x :', x)
    console.log('hasil lemparan y :', y)

    this.setState({
      startDatePick: x,
      endDatePick: y
    })

    console.log('startDate z:', this.state.startDatePick)
    console.log('endDate z:', this.state.endDatePick)
  }

  offElevation = () => {
    this.setState({elevation: 0});
  }

  modalDashboard = (title) => {
    this.setState({modalDashboardVisible: true, judulDashboard: title});
    console.log(title);
    // alert(title);
  }

  closeModalDashboard = () => {
    this.setState({modalDashboardVisible: false});
  }

  backAction = () => {
    console.log('Current route name is : '+ this.props.navigation.state.routeName);
    if(this.props.navigation.state.routeName === 'Home'){ //gabisa nangkep ini;(
      //this.props.navigation.state.index === 0
      Alert.alert("Hold on!", "Are you sure you want to go back?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
    }else{
      this.props.navigation.goBack(null);
    }
    
    return true;
  };

  async startService() {
    if (Platform.Version >= 26) {
        const channelConfig = {
            id: 'GraphQLServiceChannel',
            name: 'GraphQL Service',
            description: 'Notification Channel for GraphQL Service',
            enableVibration: false,
            importance: 2
        };
        await VIForegroundService.createNotificationChannel(channelConfig);
    }
    const notificationConfig = {
        id: 3456,
        title: 'MOSTRANS Transporter Service Config',
        text: 'MOSTRANS Transporter service is running',
        icon: 'ic_notification',
        priority: 0
    };
    if (Platform.Version >= 26) {
        notificationConfig.channelId = 'GraphQLServiceChannel';
    }

    await VIForegroundService.startService(notificationConfig);
    
}

  openModal=(typeTrip)=>{
    this.setState({modalVisible: true, displayModal:typeTrip})
  }

  openDetailOrderModal=async (value)=>{
    this.setState({isLoading:true});
    // {time: '09:00', title: 'Planning', description: 'Shipper Order: 2019-05-01'}
    var tmpTimelineData =[];
    for (var i = 0;i< Number(value.status);i++){
      var tmpTanggal;
      var tmpJam;
      switch (i){
        case 0: tmpTanggal= value.booked_date.split('T')[0];tmpJam = value.booked_date.split('T')[1].substring(0,5);break;
        case 1: tmpTanggal= value.confirmed_date.split('T')[0];tmpJam =value.confirmed_date.split('T')[1].substring(0,5);break;
        case 2: tmpTanggal= value.accepted_date.split('T')[0];tmpJam =value.accepted_date.split('T')[1].substring(0,5);break;
        case 3: tmpTanggal= value.arrival_date.split('T')[0];tmpJam =value.arrival_date.split('T')[1].substring(0,5);break;
        case 4: tmpTanggal= value.startloaded_date.split('T')[0];tmpJam =value.startloaded_date.split('T')[1].substring(0,5);break;
        case 5: tmpTanggal= value.finishloaded_date.split('T')[0];tmpJam =value.finishloaded_date.split('T')[1].substring(0,5);break;
        case 6: tmpTanggal= value.ontheway_date.split('T')[0];tmpJam =value.ontheway_date.split('T')[1].substring(0,5);break;
        case 7: tmpTanggal= value.dropoff_date.split('T')[0];tmpJam =value.dropoff_date.split('T')[1].substring(0,5);break;
        case 8: tmpTanggal= value.startunloaded_date.split('T')[0];tmpJam =value.startunloaded_date.split('T')[1].substring(0,5);break;
        case 9: tmpTanggal= value.finishunloaded_date.split('T')[0];tmpJam =value.finishunloaded_date.split('T')[1].substring(0,5);break;
        case 10: tmpTanggal= value.pod_date.split('T')[0];tmpJam =value.pod_date.split('T')[1].substring(0,5);break;
      }
      tmpTimelineData.push({
        time:tmpJam,
        title:statusDetail[i],
        description:keteranganStatus[i]+tmpTanggal
      })
    }

    await this.getOrderDetailLoad(value.id);
    this.setState({modalDetailOrderVisible:true, selectedOrder:value, timelineData:tmpTimelineData});
    this.setState({isLoading:false});
  }

  closeModal=()=>{
    this.setState({modalVisible: false, modalDetailOrderVisible:false})
  }

  getPerformanceTransporter = async (transporter_id,botRange,upRange) =>{
    let x = await encrypt(`
      select 
        count(1), status 
      from 
        mt_master_trip 
      where 
        tanggal_pengiriman <= '`+upRange+`' and 
        tanggal_pengiriman >= '`+botRange+`' and
        transporter_id = '`+transporter_id+`'
      group by 
        status
        `);
        await Axios.post(url.select,{
          query: x
        }).then(value=>{
          var closeCount =0;
          var rejectedCount =0;
          var cancelCount =0;
          if(value.data.data.length<1){
            var tmpArray =[1,1,1];
            this.setState({performanceData:tmpArray});
          }else{
            for(var i=0;i<value.data.data.length;i++){
              if(value.data.data[i].status =='reject'){
                rejectedCount = value.data.data[i].count;
              }if(value.data.data[i].status =='cancel'){
                cancelCount = value.data.data[i].count;
              }else{
                if(value.data.data[i].status !='planning' && value.data.data[i].status !='confirm'){
                  closeCount+= Number(value.data.data[i].count);
                }
              }
            }
            var tmpArray=[parseInt(closeCount.toString()),parseInt(rejectedCount.toString()),parseInt(cancelCount.toString())];
            
            if(closeCount<1){
              this.setState({percentageConfirm:0});
            }else if((rejectedCount+cancelCount)<1){
              this.setState({percentageConfirm:100})
            }else{
              var totalTrip = +closeCount+ +rejectedCount+ +cancelCount;
              this.setState({percentageConfirm:((closeCount/totalTrip)*100)})
            }

            //kyknya ada bug disini
            this.setState({performanceData:tmpArray, totalOrderPerformance:(+closeCount+ +rejectedCount+ +cancelCount)});
          }
      }).catch(err=>{
        console.log("getPerformanceTransporter");
        console.log(err);
      });
  }

  getMasterKota = async()=>{
    let x = await encrypt(`
      select 
        *
      from
        mt_master_kota
      `);
      await Axios.post(url.select,{
        query: x
      }).then(value=>{
        let x = value.data.data;
        var tmpLoc = [];
        if(x.length === 0 ) 
            alert("Master Kota Kosong");
          else {
            tmpLoc.push({id:-1,name:'Show All'});
            x.map((value,index)=>{
              if(value.nama != null){
                tmpLoc.push({id:index, name:value.nama});
              }
            });
          }
          this.setState({dataMasterKota:tmpLoc});
          // alert(tmpLoc);
    }).catch(err=>{
      console.log("getMasterKota");
      console.log(err);
    });
  }

  getMasterShipper = async()=>{
    let x = await encrypt(`
      select 
        *
      from
        mt_master_shipper
      where
        active='A'
      `);
      await Axios.post(url.select,{
        query: x
      }).then(value=>{
        let x = value.data.data;
        var tmpLoc = [];
        if(x.length === 0 ) 
            alert("Master Shipper Kosong");
          else {
            tmpLoc.push({id:-1,name:'Show All'});
            x.map((value,index)=>{
              if(value.nama_shipper != null){
                tmpLoc.push({id:value.id, name:value.nama_shipper});
              }
            });
          }
          this.setState({dataMasterShipper:tmpLoc});
          // alert(tmpLoc);
    }).catch(err=>{
      console.log("getMasterShipper");
      console.log(err);
    });
  }

  getMasterKendaraanByTrans = async(transporter_id)=>{
    let x = await encrypt(`
      select 
        mmk.*
      from
        mt_master_kendaraan mmk,
        mt_master_pool mmp
      where
        mmk.pool_id = mmp.id and
        mmp.transporter_id = '`+transporter_id+`'
      `);
      await Axios.post(url.select,{
        query: x
      }).then(value=>{
        let x = value.data.data;
        var tmpLoc = [];
        if(x.length === 0 ) 
            alert("Master Kendaraan Kosong");
          else {
            tmpLoc.push({id:-1,name:'Show All'});
            x.map((value,index)=>{
              if(value.plat_nomor != null){
                tmpLoc.push({id:value.id, name:value.plat_nomor});
              }
            });
          }
          this.setState({dataMasterKendaraan:tmpLoc});
          // alert(tmpLoc);
    }).catch(err=>{
      console.log("getMasterKendaraanByTrans");
      console.log(err);
    });
  }

  getOrderByTrip = async(trip_id)=>{
    let x = await encrypt(`
      select 
      mso.id, mso.id_order, mso.order_reference, mso.status, mso.customer_reference, mso.remarks, mso.instruksi, mso.shipment_number, mso.weight, mso.dimension, mso.tipe_customer_id, mso.shipper_id, mso.tipe_kendaraan, mso.booked_date, mso.booked_by, mso.confirmed_date, mso.confirmed_by, mso.accepted_date, mso.accepted_by, mso.accepted_latitude, mso.accepted_longitude, mso.arrival_date, mso.arrival_latitude, mso.arrival_longitude, mso.startloaded_date, mso.startloaded_latitude, mso.startloaded_longitude, mso.finishloaded_date, mso.finishloaded_latitude, mso.finishloaded_longitude, mso.ontheway_date, mso.ontheway_latitude, mso.ontheway_longitude, mso.dropoff_date, mso.dropoff_latitude, mso.dropoff_longitude, mso.startunloaded_date, mso.startunloaded_latitude, mso.startunloaded_longitude, mso.finishunloaded_date, mso.finishunloaded_latitude, mso.finishunloaded_longitude, mso.pod_date, mso.cancel_date, mso.length, mso.width, mso.height, mso.fee, mso.asal_kota, mso.tujuan_kota, mso.asal_id, mso.tujuan_id, mso.jenis_kendaraan_id, mso.tipe_muatan, mso.tipe_armada, mso.dokumen_pod, mso.deskripsi_dokumen, (mso.jadwal_penjemputan - interval '1' hour) as jadwal_penjemputan, mso.jadwal_sampai, mso.star, mso.create_date, mso.create_by, mso.update_date, mso.update_by, mso.dokumen_pod_2, mso.deskripsi_dokumen_2, mso.dokumen_pod_3, mso.deskripsi_dokumen_3, mso.dokumen_pod_4, mso.deskripsi_dokumen_4, mso.dokumen_pod_5, mso.deskripsi_dokumen_5, mso.keterangan, 
        sos.nama as status_detail,
        mms.nama_shipper,mms.foto_logo,
        msc.nama_perusahaan as asal_perusahaan, msc.lat as lat_asal, msc.lang as lang_asal,
        msc2.nama_perusahaan as tujuan_perusahaan, msc2.lat as lat_tujuan, msc.lang as lang_tujuan
      from
        mt_trip_order_transaction tot,
        mt_shipper_order mso,
        mt_shipper_order_status sos,
        mt_shipper_contact msc,
        mt_shipper_contact msc2,
        mt_master_shipper mms
      where
        tot.order_id = mso.id and
        mso.status = sos.id and
        mso.asal_id = msc.id and
        mso.tujuan_id= msc2.id and
        mso.shipper_id = mms.id and
        tot.trip_id = '`+trip_id+`'
      `);
      await Axios.post(url.select,{
        query: x
      }).then(value=>{
        let x = value.data.data;
        if(x.length === 0 ) {
          alert("Order Kosong");
          this.setState({daftarOrder:[], arrAsal:[], arrTujuan:[]});
        }
        else {
          var tmpAsal =[];
          var tmpTujuan =[];
          x.map((value,index)=>{
            tmpAsal.push({latitude:Number(value.lat_asal), longitude:Number(value.lang_asal)});
            tmpTujuan.push({latitude:Number(value.lat_tujuan), longitude:Number(value.lang_tujuan)});
          })

          this.setState({daftarOrder:x, arrAsal:tmpAsal, arrTujuan:tmpTujuan});
        }
    }).catch(err=>{
      console.log("getOrderByTrip");
      console.log(err);
    });
  }

  //contoh coba
  getOrderDetailLoad = async(order_id)=>{
    let x = await encrypt(`
      select 
        sod.*
      from
        mt_shipper_order mso,
        mt_shipper_order_detail sod
      where
        mso.id = sod.order_id and
        mso.id = '`+order_id+`' 
      `);
      await Axios.post(url.select,{
        query: x
      }).then(value=>{
        let x = value.data.data;
        if(x.length === 0 ) {
          alert("Order Kosong");
        }
        else {
          this.setState({arrDetailOrder:x});
        }
    }).catch(err=>{
      console.log('getOrderDetailLoad');
      console.log(err);
    });
  }



  getCountMTD = async () => {
    let query;
    let trid;

    let bulan = moment().format('MM/DD/YYYY')

    AsyncStorage.getItem("@uid", async (error, value) => {
      await decrypt(value).then(result => {
        uid = result;
      });


          await encrypt(`
          select sum(a.total) total, sum(a.pemesanan) pesan, sum(a.batal) batal, sum(a.tepat) tepat, sum(a.telat) telat 
             from     ( select distinct o.id, o.jadwal_penjemputan, o.arrival_date,   
             case when  o.status <= 12 then 1  else 0 end as total,  
             case when  o.status = 11 then 1  else 0 end as pemesanan,   
             case when o.status = 12 then 1 else 0 end as batal,   
             case when o.jadwal_penjemputan > o.arrival_date then 1 else 0 end as tepat,       
             case when o.jadwal_penjemputan < o.arrival_date then 1 else 0 end as telat 
             from     mt_shipper_order o    
             left join mt_shipper_contact sca on o.asal_id=sca.id    
             left join mt_shipper_contact sct  on o.tujuan_id=sct.id    
             left join mt_order_status_indonesia ind on o.status=ind.id    
             left join mt_trip_order_transaction tod on tod.order_id=o.id     
             left join mt_master_trip tr on tod.trip_id=tr.id    
             left join mt_master_kendaraan k on tr.kendaraan_id=k.id    
             left join mt_master_user dr on dr.id=tr.driver_id    
             left join mt_master_user u on u.transporter_id = tr.transporter_id     
             where u.id = '`+uid+`'   
             and o.jadwal_penjemputan >= date_trunc('month', timestamp '`+bulan+`')  
             and o.jadwal_penjemputan < date_trunc('month', timestamp '`+bulan+`' + interval '1 month')    ) a
          `).then(result => {
            query = result;
          });
          Axios.post(url.select, {
            query: query 
          })
            .then(result => {
              let res = result.data.data[0]
            
              console.log('Total:', res.total)
              console.log('MTD Pesan:', res.pesan)
              console.log('MTD Tepat :', res.tepat)
              console.log('MTD Batal :', res.batal)
              console.log('MTD Telat :', res.telat)
              this.setState({
                getMtdPesan: res.pesan,
                getMtdTepat: res.tepat,
                getMtdTerambat: res.telat,
                getMtdBatal: res.batal,
              })

              var persentasePesan = (res.pesan/res.total).toFixed(2)
              var persentaseTepat = (res.tepat/res.total).toFixed(2)
              var persentaseTerlambat = (res.telat/res.total).toFixed(2)
              var persentaseBatal = (res.batal/res.total).toFixed(2)

              console.log('persentase Pesan : ', persentasePesan)
              console.log('persentase Tepat : ', persentaseTepat)
              console.log('persentase Terlambat : ', persentaseTerlambat)
              console.log('persentase Batal : ', persentaseBatal)

              console.log('type of persentase mtd', typeof(persentaseTerlambat))

              if(persentasePesan == 0 || persentasePesan == 'NaN'){
                this.setState({getMtdPesanPercentage: 0})
              }else{
                this.setState({getMtdPesanPercentage: persentasePesan})
              }

              if(persentaseTepat == 0 || persentaseTepat == 'NaN'){
                this.setState({getMtdTepatPercentage: 0})
              }else{
                this.setState({getMtdTepatPercentage: persentaseTepat})
              }

              if(persentaseTerlambat == 0 || persentaseTerlambat == 'NaN'){
                this.setState({getMtdTerlambatPercentage: 0})
              }else{
                this.setState({getMtdTerlambatPercentage: persentaseTerlambat})
              }

              if(persentaseBatal == 0 || persentaseBatal == 'NaN'){
                this.setState({getMtdBatalPercentage: 0})
              }else{
                this.setState({getMtdBatalPercentage: persentaseBatal})
              }



            })
            .catch(error => {
              console.log(error);
            });
  
        });
  }


  getCountKendaraanIdle = async () => {
    let query;
    let trid;
    // let x = this.state.startDate.format('YYYY-MM-DD')
    // let y = this.state.endDate
    // console.log('x di countdashboard', x)

    var x1 = this.state.startDate
    var y1 = this.state.endDate
    x1 = x1.format('MM/DD/YYYY')
    y1 = y1.format('MM/DD/YYYY')
    
    // console.log('x :', typeof(x))
    // console.log('y :', y)
    // console.log('x1 :', typeof(x1))
    console.log('x1 idle:', x1)
    console.log('y1 idle:', y1)
    
    AsyncStorage.getItem("@uid", async (error, value) => {
      await decrypt(value).then(result => {
        uid = result;
      });
          await encrypt(`
          select (select count(1) 
                      from mt_master_kendaraan a, mt_master_pool b, mt_master_user c  
                      where a.pool_id = b.id 
                      and b.transporter_id = c.transporter_id 
                      and c.id = '`+uid+`' 
                      and a.id    not in  (select kendaraan_id from mt_master_trip a, mt_master_user b    
                      where a.tanggal_pengiriman 
                      between '`+x1+`'  and '`+y1+`'  
                      and a.transporter_id = b.transporter_id 
                      and b.id = '`+uid+`'  
                      and a.status in ('planning', 'accepted', 'confirm'))) kendaraan
            `).then(result => {
            query = result;
          });
          Axios.post(url.select, {
            query: query 
          })
            .then(result => {
              let res = result.data.data[0]
              // console.log('res idle', res)

              this.setState({
                getKendaraanIdle: res.kendaraan
              })
              
             
            })
            .catch(error => {
              console.log(error);
            });
  
        });
  }




  getOccupancy = async () => {
    let query;
    let trid;
    // let x = this.state.startDate.format('YYYY-MM-DD')
    // let y = this.state.endDate
    // console.log('x di countdashboard', x)

    var x1 = this.state.startDate
    var y1 = this.state.endDate
    x1 = x1.format('MM/DD/YYYY')
    y1 = y1.format('MM/DD/YYYY')
    
    // console.log('x :', typeof(x))
    // console.log('y :', y)
    // console.log('x1 :', typeof(x1))
    console.log('x1 occu:', x1)
    console.log('y1 occu:', y1)
    
    AsyncStorage.getItem("@uid", async (error, value) => {
      await decrypt(value).then(result => {
        uid = result;
      });
          await encrypt(`
          select coalesce(sum(p.dimensi),0) as dimensi, coalesce(sum(p.maksimal_dimensi),0) as maks_dimensi 
             	 	 from  (  select tr.id_trip, sum(o.dimension) dimensi, jk.maksimal_dimensi   
             	 	 from mt_shipper_order o 
             	 	 left join mt_master_jenis_kendaraan jk on o.jenis_kendaraan_id = jk.id 
             	 	 left join mt_order_status_indonesia ind on o.status = ind.id  
             	 	 left join mt_trip_order_transaction tod on tod.order_id = o.id  
             	 	 left join mt_master_trip tr on tod.trip_id = tr.id  
             	 	 left join mt_master_user u on  u.transporter_id = tr.transporter_id  
             	 	 left join mt_master_kendaraan k on tr.kendaraan_id = k.id   
             	 	 left join mt_master_user dr on tr.driver_id = dr.id 
             	 	 left join mt_master_kota akota on akota.id = tr.asal_id 
             	 	 left join mt_master_kota tkota on tkota.id = tr.tujuan_id 
             	 	 where  u.id = '`+uid+`'
             	 	 and tr.status != 'cancel'  
             	 	 and  o.jadwal_penjemputan  >= ('`+x1+`')   
             	 	 and o.jadwal_penjemputan <= '`+y1+`'   
             	 	 group by tr.id_trip, jk.maksimal_dimensi) p
          `).then(result => {
            query = result;
          });
          Axios.post(url.select, {
            query: query 
          })
            .then(result => {
              let res = result.data.data[0]
            
              console.log('UID : ', uid)
              console.log('dimensi:', res.dimensi)
              console.log('maks_dimensi:', res.maks_dimensi)

              var persentaseOccupancy = (res.dimensi/res.maks_dimensi).toFixed(2)
              // console.log('perhitungan occu : ', Math.sqrt(res.dimensi).toFixed(0))
              // console.log('persentase occu : ', persentaseOccupancy)

              if(res.dimensi == 0){
                this.setState({getCountOccupancy: 0})
              }else{
                this.setState({getCountOccupancy: res.dimensi})
              }

              if(persentaseOccupancy == 0 || persentaseOccupancy == 'NaN'){
                this.setState({getCountOccupancyPercentage: 0})
              }else{
                this.setState({getCountOccupancyPercentage: persentaseOccupancy})
              }


            })
            .catch(error => {
              console.log(error);
            });
  
        });
  }







  getCountDashboard = async () => {
    let query;
    let trid;
    // let x = this.state.startDate.format('YYYY-MM-DD')
    // let y = this.state.endDate
    // console.log('x di countdashboard', x)

    let x = '2020-04-03'
    let y = '2020-04-09'

    var x1 = this.state.startDate
    var y1 = this.state.endDate
    x1 = x1.format('YYYY-MM-DD')
    y1 = y1.format('YYYY-MM-DD')
    
    console.log('x :', typeof(x))
    console.log('y :', y)
    console.log('x1 :', typeof(x1))
    console.log('x1 :', x1)
    console.log('y1 :', y1)

    AsyncStorage.getItem("@uid", async (error, value) => {
      await decrypt(value).then(result => {
        uid = result;
      });


          await encrypt(`
          select coalesce(sum(a.pesanan),0) q_pesanan, coalesce(sum(a.sudah_konfirm),0) q_sudahkonfirm, coalesce(sum(a.belum_konfirm),0) q_belumkonfirm, coalesce(sum(a.batal),0) q_batal,  
          coalesce(sum(a.sudah_dtg),0) q_sudahdtg, coalesce(sum(a.belum_dtg),0) q_belumdtg, coalesce(sum(a.sudah_brgkt),0) q_sudahbrgkt, coalesce(sum(a.belum_brgkt),0) q_belumbrgkt, 
          coalesce(sum(a.kirim),0) pengiriman, coalesce(sum(a.datang),0) kedatangan, coalesce(sum(a.tepat),0) tepat, coalesce(sum(a.pod),0) pod 
   from  
         (select distinct o.id, o.jadwal_penjemputan, o.arrival_date,   
                  case when (o.jadwal_penjemputan >= o.arrival_date and o.status >= 4) then 1 else 0 end tepat , 
                  case when o.status > 0 and o.status <= 12 then 1  else 0 end as pesanan, 
                  case when o.status > 1 and o.status < 12 then 1 else 0 end as sudah_konfirm, 
                 case when o.status = 1 then 1 else 0 end as belum_konfirm, 
                 case when o.status = 11 then 1 else 0 end as pod, 
                 case when o.status = 12 then 1 else 0 end as batal, 
                 case when o.status >= 4 and o.status < 12  then 1 else 0 end as sudah_dtg, 
                 case when o.status > 1 and o.status < 4 then 1 else 0 end as belum_dtg, 
                 case when o.status > 6 and o.status < 12  then 1 else 0 end as sudah_brgkt, 
                 case when o.status > 4 and o.status < 7 then 1 else 0 end as belum_brgkt, 
                 case when o.status >= 4 and o.status < 12 then 1 else 0 end as datang, 
                 case when o.status > 4 and o.status < 12 then 1 else 0 end as kirim 
                   from mt_shipper_order o
                   left join mt_shipper_contact sca on o.asal_id=sca.id
                   left join mt_shipper_contact sct  on o.tujuan_id=sct.id
                   left join mt_order_status_indonesia ind on o.status=ind.id
                   left join mt_trip_order_transaction tod on tod.order_id=o.id 
                   left join mt_master_trip tr on tod.trip_id=tr.id
                   left join mt_master_kendaraan k on tr.kendaraan_id=k.id
                   left join mt_master_user dr on dr.id=tr.driver_id
                   left join mt_master_user u on u.transporter_id = tr.transporter_id 
                   where u.id = '`+uid+`'
                   and o.jadwal_penjemputan >= '`+x1+` 00:00:00' and o.jadwal_penjemputan < '`+y1+` 24:00:00')a
          `).then(result => {
            query = result;
          });
          Axios.post(url.select, {
            query: query 
          })
            .then(result => {
              let res = result.data.data[0]
            
              console.log('pesanan:', res.q_sudahkonfirm)
              console.log('kedatangan:', res.kedatangan)
              console.log('pengiriman:', res.pengiriman)
              console.log('on time tepat kedatangan:', res.tepat)
              this.setState({
                getCountKonfirmasi: res.q_sudahkonfirm,
                // getCountKonfirmasiPercentage: (res.q_sudahkonfirm / (res.q_batal + res.q_sudahkonfirm)).toFixed(2),
                getCountKedatangan: res.kedatangan,
                // getCountKedatanganPercentage: (res.kedatangan/res.q_sudahkonfirm).toFixed(2),
                getCountPengiriman: (res.pengiriman),
                // getCountPengirimanPercentage: (res.pengiriman/res.q_sudahkonfirm).toFixed(2),
                getCountOnTime: res.tepat,
                // getCountOnTimePercentage: (res.tepat/res.kedatangan).toFixed(2),
                getCountJumlahPesanan: res.q_pesanan,
                getCountSudahKonfirmasi: res.q_sudahkonfirm,
                getCountBelumKonfirmasi: res.q_belumkonfirm,
                getCountBatal: res.q_batal,
                getCountSudahDatang: res.q_sudahdtg,
                getCountBelumDatang: res.q_belumdtg,
                getCountSudahBerangkat: res.q_sudahbrgkt,
                getCountBelumBerangkat: res.q_belumbrgkt,
                getCountPOD: res.pod,
              })

              var persentaseKonfirm = (res.q_sudahkonfirm / (res.q_batal + res.q_sudahkonfirm)).toFixed(2)
              var persentaseKedatangan = (res.kedatangan/res.q_sudahkonfirm).toFixed(2)
              var persentasePengiriman = (res.pengiriman/res.q_sudahkonfirm).toFixed(2)
              var persentaseOnTime = (res.tepat/res.kedatangan).toFixed(2)

              if(persentaseKonfirm == 'NaN'){
                console.log('hasil NaN atau 0')
                this.setState({getCountKonfirmasiPercentage: 0})
              }else{
                this.setState({getCountKonfirmasiPercentage: persentaseKonfirm})
              }

              if(persentaseKedatangan == 'NaN'){
                console.log('hasil hasil NaN atau 0')
                this.setState({getCountKedatanganPercentage: 0})
              }else{
                this.setState({getCountKedatanganPercentage: persentaseKedatangan})
              }

              if(persentasePengiriman == 'NaN'){
                console.log('hasil hasil NaN atau 0')
                this.setState({getCountPengirimanPercentage: 0})
              }else{
                this.setState({getCountPengirimanPercentage: persentasePengiriman})
              }

              if(persentaseOnTime == 'NaN'){
                console.log('hasil NaN atau 0')
                this.setState({getCountOnTimePercentage: 0})
              }else{
                this.setState({getCountOnTimePercentage: persentaseOnTime})
              }


              // var test2 = (5 / (5+0)).toFixed(2)
              // var test = (res.q_sudahkonfirm / (res.q_batal + res.q_sudahkonfirm)).toFixed(2)
              // console.log('test error : ', test)
              // console.log('test error typeof : ', typeof(test))
              // console.log('test2 error : ', test2)
              console.log('persentase konfirmasi:', this.state.getCountKonfirmasiPercentage)
              console.log('persentase kedatangan:', this.state.getCountKedatanganPercentage)
            // console.log('fetch data trip view : ', result.data.data);
            // console.log('fetch data trip view dgn array: ', result.data.data[0]);
            // console.log('fetch data trip view dgn array, values: ', result.data.data[0].q_pesanan);
            })
            .catch(error => {
              console.log(error);
            });
  
        });
  }




  //ambil contoh ini utk getCount
  getCountNewTrip = (transpor_id) => new Promise(async (resolve)=>{
    var ret = 100;
    let x = await encrypt(`
      select 
        count(1)
      from
        mt_master_trip mmt
      where
        mmt.status = 'planning' and
        mmt.transporter_id = '`+transpor_id+`' 
      `);
      await Axios.post(url.select,{
        query: x
      }).then(value=>{
        ret = value.data.data[0].count;
        // let x = value.data.data;
        // if(x.length === 0 ) {
        //   alert("Order Kosong");
        // }
        // else {
        //   this.setState({arrDetailOrder:x});
        // }
    }).catch(err=>{
      console.log('getCountNewTrip');
      console.log(err);
    });
    resolve(ret);
  })


  //Untuk dapetin list AktifTrip di Modal // another contoh
  getActiveTrip = async () =>{
    var x1 = this.state.startDate
    var y1 = this.state.endDate
    x1 = x1.format('YYYY-MM-DD')
    y1 = y1.format('YYYY-MM-DD')

    // o.jadwal_penjemputan >= '`+x1+` 00:00:00' and o.jadwal_penjemputan < '`+y1+` 24:00:00' pake mt_shipper_order

    AsyncStorage.getItem("@trid", async (error, value) => {
      await decrypt(value).then(async (result)=> {
        // alert(parseInt(result));
        this.setState({trans_id:parseInt(result)});
        var transporter_id = result;
        let dataQry = `select 
          mmt.id, mmt.id_trip, mmt.transporter_id, mmt.driver_id, mmt.kendaraan_id, mmt.jenis_kendaraan_id, mmt.asal_id, mmt.tujuan_id, mmt.tanggal_pengiriman, (mmt.jam_pengiriman - interval '1' hour) as jam_pengiriman, mmt.tanggal_sampai, mmt.jam_sampai, mmt.status, mmt.create_date, mmt.create_by, mmt.update_date, mmt.update_by,
          logLoc.lat, logLoc.lang,
          mtka.nama as kota_asal,
          mtkt.nama as kota_tujuan,
          tot.nama_shipper,
          mjk.jenis_kendaraan,
          mmk.plat_nomor,
          mmu.nama as nama_driver,
          mmu.hp as hp_driver
        from 
          mt_master_trip mmt
          left join
          (WITH DEDUPE AS (
              SELECT  *
                  , ROW_NUMBER() OVER ( PARTITION BY trip_id ORDER BY id desc) AS OCCURENCE
              FROM mt_log_location
              )
            SELECT  * FROM DEDUPE
            WHERE
            OCCURENCE = 1  ) logLoc
          on
            mmt.id = logLoc.trip_id
          left join
            mt_master_kota mtka
          on 
            mmt.asal_id = mtka.id
          left join
            mt_master_kota mtkt
          on 
            mmt.tujuan_id = mtkt.id
          left join
            mt_master_jenis_kendaraan mjk
          on 
            mmt.jenis_kendaraan_id = mjk.id
          left join
            mt_master_kendaraan mmk
          on 
            mmt.kendaraan_id = mmk.id
          left join
            mt_master_user mmu
          on 
            mmt.driver_id = mmu.id
          left join
            (
              select
                tot.order_id, tot.trip_id,
                mso.nama_shipper
              from
                  (WITH DEDUPE AS (
                    SELECT  *
                        , ROW_NUMBER() OVER ( PARTITION BY trip_id ORDER BY id desc) AS OCCURENCE
                    FROM mt_trip_order_transaction
                    )
                  SELECT  * FROM DEDUPE
                  WHERE
                  OCCURENCE = 1  ) tot,
                (
                  select mso.*, mms.nama_shipper from mt_shipper_order mso, mt_master_shipper mms where mso.shipper_id = mms.id
                ) mso
              where 
                tot.order_id = mso.id
            ) tot
          on 
            mmt.id = tot.trip_id
        where 	
          (mmt.status = 'planning' or
          mmt.status = 'confirm' or
          mmt.status = 'accepted') and 
          mmt.transporter_id = '`+transporter_id+`'  
          `
        let x = await encrypt(dataQry);
        console.log("First :"+dataQry);
        console.log(url.select);
        console.log("Encrypt : "+x);
        await Axios.post(url.select,{
          query: x
        }).then(value=>{
          let x = value.data.data;
          //search filter
          // const filtered= value.data.data.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))

          // console.log('123');
          console.log('Isi getActiveTrip : ', value.data.data);
          console.log('Isi getActiveTrip : ', value.data.data[0]);
          console.log('Isi data -> value status: ', value.status)
          console.log('Isi data, length x ', x.length)
          if(x.length === 0 ) 
            alert("Lokasi Kendaraan Trip Tidak Ditemukan");
          else {
            var tmpLoc = [];
            var tmpCountPlanningTrip=0;
            var tmpArrActiveTrip =[];
            var tmpArrArmadaTrip =[];
            //Perhatikan utk dipelajari disini
            x.map((value,index)=>{
              if(value.status == 'planning'){
                tmpCountPlanningTrip++;
              }else if(value.status == 'confirm'){
                tmpArrActiveTrip.push(value);
              }else{
                tmpArrArmadaTrip.push(value); //armada itu otw ke tempat bongkar
              }

              //cek lat di db, lalu simpan di array
              if(value.lat != null){
                tmpLoc.push({latitude:Number(value.lat), longitude:Number(value.lang)});
              }
            });
            this.setState({
                markerData:tmpLoc,
                countPlanningTrip:tmpCountPlanningTrip,
                countActiveTrip:tmpArrActiveTrip.length, 
                countArmadaTrip:tmpArrArmadaTrip.length,
                activeTripArr:tmpArrActiveTrip,
                allTripActive:tmpArrActiveTrip,
                allTripArmada:tmpArrArmadaTrip,
                armadaTripArr:tmpArrArmadaTrip
              });
            var curDate = new Date(); //Date
            var date= curDate.getDate();
            var month = curDate.getMonth()+1; //Current Month
            if(month.toString().length<2) month="0" +month
            if(date.toString().length<2) date="0" +date
            var year = curDate.getFullYear(); //Current Year
            var botRange = year+"-"+month+"-"+"01";
            var upRange = year+"-"+month+"-"+date;
            console.log('234');
            console.log(botRange+" { "+upRange);
            this.getPerformanceTransporter(transporter_id,botRange,upRange);
            this.setState({periodeRapor:dataMonth[Number(curDate.getMonth())]+" "+curDate.getFullYear()});

            console.log('tgl botRange: '+botRange);
            console.log('tgl upRange : '+upRange);
            // alert(tmpArrActiveTrip);
            // alert("Up : "+upRange);
          }
        }).catch(err=>{
          console.log("getActiveTrip");
          console.log(err);
          // console.log(x);
        });
        
        await this.getMasterKendaraanByTrans(transporter_id);
        
      }).catch(err=>{
        console.log("diluar");
        console.log(err);
        // console.log(x);
      });
    });
  }
  
  async componentDidMount() {
    this.setState({isLoading:true});
    //BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    //BackHandler.addEventListener("hardwareBackPress", this.backAction);

    // bisa nih
    // console.log('start coy', this.state.startDate.format('YYYY-MM-DD'))

    // var start = moment().format('YYYY-MM-DD')
    // var end = moment().format('YYYY-MM-DD')
    // this.setState({
    //   startDatePick: start,
    //   endDatePick: end
    // })
  
    // let x = this.state.startDatePick
    // let y = this.state.endDatePick

    // console.log('start date didmount', x)
    
    
    console.log('Current State Route name in HomeView is : '+ this.props.navigation.state.routeName);
    // console.log('Current parent'+this.props.navigation.dangerouslyGetParent().state.index);
    // if(this.props.navigation.state.routeName === 'Login'){
    //   BackHandler.exitApp();
    // }else{
    //   this.props.navigation.goBack(null);
    // }

    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }
        });
      },
      error => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    this.watchID = navigator.geolocation.watchPosition(position => {
      this.setState({
        region: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }
      });
    });
    var trid=0;

    await setUrl();
    await getUrl().then(async(result)=>{
        url =result;
    });

    await this.getActiveTrip();
    await this.getMasterKota();
    await this.getMasterShipper();
    this.getCountDashboard();
    this.getOccupancy();
    this.getCountMTD();
    this.getCountKendaraanIdle();


    console.log('tgl hari ini: '+ moment().format('YYYY-MM-DD'));
    console.log(moment())
    console.log('tgl bulan ini utk MTD : ', moment().format('MM/DD/YYYY'))

    this.setState({isLoading:false});

    // var i=0; setInterval(function(){ console.log("Hello "+i++); }, 1000)
    // await 
    
    //RNLocalNotifications.createNotification(id, text, datetime, sound[, hiddendata]);
    // RNLocalNotifications.setAndroidIcons("ic_launcher", "mipmap", "notification_small", "drawable"); //this are the default values, this function is optional
    // RNLocalNotifications.createNotification(1021, 'Test Notif', '2019-11-04 09:22', 'default');
    // var i=0; setInterval(function(){ console.log("Hello "+i++); }, 1000)
    var i=0;

    //testing
    // if(BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)){
    //   console.log('wkwkwkwkw')
    //   BackHandler.exitApp();
    // }


    this.startService();
    await BackgroundTimer.stopBackgroundTimer();
    BackgroundTimer.runBackgroundTimer(async() => { 
      if(AppState.currentState.match(/inactive|background/)){
        console.log(this.state.trans_id);
        var count, countKonfirmasi ;
        await this.getCountNewTrip(this.state.trans_id).then(result=>{count=result});
        // await this.getCountKonfirmasi(this.state.trans_id).then(result=>{countKonfirmasi=result});
        
        if(this.state.countPlanningTrip < count){ 
          this.setState({countPlanningTrip : count});
          const Sound = require('react-native-sound');
        
            // Enable playback in silence mode
          Sound.setCategory('Playback');
          
          const music = new Sound('notif_tripbaru.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
              console.log('failed to load the sound', error);
              return;
            }else{
            // loaded successfully, play			
            music.play((success) => {
              if (success) {
                console.log('successfully finished playing');
              } else {
                console.log('playback failed due to audio decoding errors');
              }
            });
            }
          });
        }
        
      }
      
          }, 
          10000);

          await this.getCountNewTrip();
          // await this.getCountKonfirmasi();
  }

  componentWillMount(){
    //BackHandler.addEventListener('hardwareBackPress', this.handleBackButton); // untuk afterlogin, klo udh diback harus exitApp
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
    //BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton); // untuk afterlogin, klo udh diback harus exitApp
    //BackHandler.removeEventListener("hardwareBackPress", this.backAction);
  }

//   handleBackButton = () => {
//     //add your code
//     // untuk afterlogin, klo udh diback harus exitApp
//     //this.props.navigation.goBack(null);
//     //BackHandler.exitApp();
//     // let a = false
//     //console.log('Current State Route name '+ this.props.navigation.state.routeName);

//     if(this.props.navigation.state.routeName === 'Home'){ // bingung cara nangkepnya;(
//       // BackHandler.exitApp();
//       //this.props.navigation.goBack(null);
//       console.log('true')
//     }else{
//       this.props.navigation.goBack(null);
//       //console.log('ini else')
//     }
//     return true;
// };

  clearSearch = ()=>{
    this.setState({searchByShipper:"", searchByPlat:"",searchByAsal:"", searchByTujuan:""});
    var tmpLoc;
    if(this.state.displayModal=='Active'){
      tmpLoc = this.state.allTripActive;
    }else{
      tmpLoc = this.state.allTripArmada;
    }
    if(this.state.displayModal=='Active'){
      this.setState({
        activeTripArr:tmpLoc
      })
    }else{
      this.setState({
        armadaTripArr:tmpLoc
      })
    }
    
  }

  searchTrip(factor,item){
    this.setState({isLoading:true});
    switch (factor){
      case 1: this.setState({searchByShipper:item.name}); break;
      case 2: this.setState({searchByPlat:item.name}); break;
      case 3: this.setState({searchByAsal:item.name}); break;
      case 4: this.setState({searchByTujuan:item.name}); break;
    }
    var tmpLoc;
    if(this.state.displayModal=='Active'){
      tmpLoc = this.state.allTripActive;
    }else{
      tmpLoc = this.state.allTripArmada;
    }
    
    if(this.state.searchByShipper.length>0 && this.state.searchByShipper!='Show All'){
      tmpLoc = tmpLoc.filter(value=>{
        return value.nama_shipper == this.state.searchByShipper;
      });
    }

    if(this.state.searchByPlat.length>0 && this.state.searchByPlat!='Show All'){
      tmpLoc = tmpLoc.filter(value=>{
        return value.plat_nomor == this.state.searchByPlat;
      });
    }

    if(this.state.searchByAsal.length>0 && this.state.searchByAsal!='Show All'){
      tmpLoc = tmpLoc.filter(value=>{
        return value.kota_asal == this.state.searchByAsal;
      });
    }

    if(this.state.searchByTujuan.length>0 && this.state.searchByTujuan!='Show All'){
      tmpLoc = tmpLoc.filter(value=>{
        return value.kota_tujuan== this.state.searchByTujuan;
      });
    }
    if(this.state.displayModal=='Active'){
      this.setState({
        activeTripArr:tmpLoc
      })
    }else{
      this.setState({
        armadaTripArr:tmpLoc
      })
    }
    this.setState({isLoading:false});
  }

  async itemSelected(item){
    this.setState({isLoading:true});

    this.setState({modalDashboardVisible: false});

    var data = JSON.parse(item);
    // this.setState({arrAsal:[],arrTujuan:[],selectedTripLocDriver:null});

    await this.getOrderByTrip(data.id);
    
    this.setState({displayDetailTrip:true, indexData:data, modalVisible:false, selectedTripLocDriver:{latitude:Number(data.lat),longitude:Number(data.lang)}});

    if(data.lat){
      this.setState({region:{latitude:Number(data.lat),longitude:Number(data.lang),latitudeDelta:LATITUDE_DELTA,longitudeDelta:LONGITUDE_DELTA}});
    }
    this.setState({isLoading:false});
    this.clearSearch();
  }







  backToNormal = () => {
    this.setState({isLoading: true});
    this.setState({displayDetailTrip: false});
    this.setState({isLoading: false});
    //setTimeout(() => {this.setState({isLoading: false})}, 3000)
  }















  render() {
    //ini untuk props navigationnya
    const { navigate } = this.props.navigation;
    const chart_wh = 150
    const sliceColor = ['#008c45','#7d8d8c', '#ADACB5', '#fafafa', '#f5f5f5','#00997A','#388789']
                        // Main Hijau, abu", abu"tua, cream, cream, ijo pastel icon, cobain pastel baru
    const { startDate, endDate, displayedDate } = this.state;
    //search filter
    const filteredActive = this.state.allTripActive.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
    const filteredArmada = this.state.allTripArmada.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
    return (
      
      <Container>
        {
          this.state.trans_id>0?
          <Subscription
            subscription={COMMENTS_SUBSCRIPTION}
            variables={{transporter_id:this.state.trans_id.toString()}}>
            { ({ data, loading }) => {
              if(data!= undefined && this.state.countPlanningTrip != data.tripAdded.countNewTrip){     
                // Load the sound file
                
                alert("Terdapat Trip Baru Untuk Anda, Harap Segera Diproses ya. Trip akan batal otomatis dalam 30 menit.");
                const Sound = require('react-native-sound');
        
                    // Enable playback in silence mode
                    Sound.setCategory('Playback');
                    
                    const music = new Sound('notif_tripbaru.mp3', Sound.MAIN_BUNDLE, (error) => {
                      if (error) {
                        console.log('failed to load the sound', error);
                        return;
                      }else{
                      // loaded successfully, play			
                      music.play((success) => {
                        if (success) {
                          console.log('successfully finished playing');
                        } else {
                          console.log('playback failed due to audio decoding errors');
                        }
                      });
                    }
                  });
                this.setState({countPlanningTrip:data.tripAdded.countNewTrip})
              }
              data=null;
              return <View></View>;
              
            }}
          </Subscription>:
          null
        }
        

        {/* Dashboard */}
        <Header style={{height: 55, paddingTop:0}}>
          <Body style={{marginLeft:10}}>
            <Title>Dashboard</Title>
          </Body>
          <Right>
            <Image source={logoMostrans} style={{height: 70, width:70,resizeMode:'contain'}} />
          </Right>
          {/* <Right>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("Inbox")}
            >
              <Icon type="FontAwesome5" name="envelope" />
            </Button>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("Notifications")}
            >
              <Icon type="FontAwesome5" name="bell" />
            </Button>
          </Right> */}
        </Header>
          <Content >    
            {/* <WebView
              style={styles.webview}
              source={{ uri: "https://sandboxdev.enseval.com/slider-mostrans/" }}
              renderError={e => {
                return <Text>Coming Soon</Text>;
              }}
            /> */}
            {this.state.isLoading?            
            <Spinner
              visible={this.state.isLoading}
              textContent={'Loading...'}
              textStyle={{color:"#fff"}}
            />:
            null}


            

            {/* Header */}
          {/* <View style={styles.flexGrid }>
            <Button style={styles.buttonHeader} onPress={()=>this.props.navigation.navigate("Trips")}>
              <Text style={styles.TextCustom}>Baru {"\n"} {this.state.countPlanningTrip}</Text>
            </Button>
            <Button style={styles.buttonHeader} onPress={()=>this.openModal('Active')}>
              <Text style={styles.TextCustom}>Aktif {"\n"} {this.state.countActiveTrip}</Text>
            </Button>
            <Button style={styles.buttonHeader} onPress={()=>this.openModal('Armada')}>
              <Text style={styles.TextCustom}>Armada {"\n"} {this.state.countArmadaTrip}</Text>
            </Button>
          </View> */}




          






          {/* Daterange picker */}
          

          <View style={styles.flexGrid }>
            {/* style lama pake buttonHeader dan TextCustom */}


            <View style={styles.headerViewStyleKanan}>
                <DateRangePicker
                  selectedStyle={styles.dateSetelected}
                  backdropStyle={styles.dateBackdrop}
                  dateContainer={styles.dateContainer}
                  endDate={endDate}
                  startDate={startDate}
                  onChange={this.setDates}
                  // onChange={()=>this.setDates(startDate,endDate)}
                  displayedDate={displayedDate}
                  range={true}
                >
                  <View style={styles.headerViewStyleGradientDate}>
                    {this.state.startDate.format('YYYY-MM-DD')==this.state.endDate.format('YYYY-MM-DD')? 
                      <Text style={{color:"#7d8d8c", fontSize:12, fontWeight:'bold', textAlign: 'center'}}>{this.state.startDate.format('D MMMM YYYY')}</Text>
                    :
                      <Text style={{color:"#7d8d8c", fontSize:12, fontWeight:'bold', textAlign: 'center'}}>{this.state.startDate.format('D MMMM YYYY')} - {this.state.endDate.format('D MMMM YYYY')}</Text>
                    }
                  </View>
                </DateRangePicker>
              </View>


            
            <Button style={styles.headerViewStyleKiri} onPress={()=>this.props.navigation.navigate("Trips")}>
              <View style={styles.headerViewStyleGradient}>
                <Text style={styles.textButtonHeader}> Baru {"\n"} {this.state.countPlanningTrip}</Text>
              </View>
            </Button>
            </View>
            {/* <View style={styles.headerViewStyleKanan}> */}
            
            {/* </View> */}

          
            {/* Sebelumnya pake ini, tinggal rubah stylenya aja */}
            {/* <Button style={styles.headerViewStyle} onPress={()=>this.openModal('Active')}>
              <Text style={styles.textButtonHeader}> Aktif {"\n"} {this.state.countActiveTrip}</Text>
            </Button> */}


            {/* <Text onPress={this.testClick}> test getCountDashboard</Text> */}

            <View style={styles.flexGrid}>
            {/* <Button style={styles.headerViewStyle} onPress={()=>this.openModal('Active')}>
              <LinearGradient colors={['#00997A', '#5CB588', '#5CB588', '#00997A']} style={styles.headerViewStyleGradient}>
                <Text style={styles.textButtonHeader}> Aktif {"\n"} {this.state.countActiveTrip}</Text>
              </LinearGradient>
            </Button>

            <Button style={styles.headerViewStyle} onPress={()=>this.openModal('Armada')}>
              <LinearGradient colors={['#00997A', '#5CB588', '#5CB588', '#00997A']} style={styles.headerViewStyleGradient}>
                <Text style={styles.textButtonHeader}> Armada {"\n"} {this.state.countArmadaTrip}</Text>
              </LinearGradient>
            </Button> */}

            <Button style={styles.headerViewStyleKiri2} onPress={()=>this.openModal('Active')}>
              <View style={styles.headerViewStyleGradient}>
                {/* Active -> Aktivitas ke tempat muat*/}
                <Text style={styles.textButtonHeader}> Active {"\n"} {this.state.countActiveTrip}</Text>
              </View>
            </Button>

            <Button style={styles.headerViewStyleKiri2} onPress={()=>this.openModal('Armada')}>
              <View style={styles.headerViewStyleGradient}>
                {/* Armada -> Aktivitas ke tempat bongkar*/}
                <Text style={styles.textButtonHeader}> Armada {"\n"} {this.state.countArmadaTrip}</Text>
              </View>
            </Button>
          </View>




          {/* MapView */}
          
          

            {/* DisplayFilterTrip */}
          {
            this.state.displayDetailTrip?

            

              <View>
                {/* <ImageBackground source={require('../../../assets/images/backgroundwhite.jpg')} style={{width: '100%'}}> */}

                <View style = {styles.lineStyle} />

                <TouchableOpacity style={styles.tombolClose3} onPress={this.backToNormal}>
                    <Text style={styles.textclose}>Tutup</Text>
                  </TouchableOpacity>

                  
            <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.mapStyle}
            showsUserLocation={true}
            showsMyLocationButton={true}
            region={this.state.region}
            // onRegionChange={region => this.setState({ region })}
            // onRegionChangeComplete={region => this.setState({ region })}
          >

            {/* {
              this.state.markerData.map((value,index)=>{
                return(
                  <MapView.Marker coordinate={value}>
                    <Image source={logoTruck} style={{height: 20, width:50 }} />
                  </MapView.Marker>
                )
              })
            } */}
            {
              this.state.selectedTripLocDriver!=null?
              <MapView.Marker coordinate={this.state.selectedTripLocDriver}>
                <Text style={{borderColor:"#008c45",backgroundColor:"white", textAlign:"center",borderRadius:4,borderWidth: 1, fontSize:10, padding:4}}>DRIVER</Text>
                <Image source={logoTruck} style={{height: 30, width:30,resizeMode:'contain'}} />
              </MapView.Marker>
              :
              null
            }
            {this.state.arrAsal.map((value,index)=>{
              
              return(
                // <MapView.Marker coordinate={this.state.arrAsal[index]}></MapView.Marker>
                <View>
                  <MapView.Marker title="Asal" coordinate={this.state.arrAsal[index]}>
                    <Text style={{borderColor:"#008c45",backgroundColor:"white", textAlign:"center",borderRadius:10,borderWidth: 1, fontSize:10, padding:2}}>ASAL{"\n"}<Text style={{fontSize:8,fontStyle:"italic"}}>{this.state.daftarOrder[index].id_order}</Text></Text><Image source={logoPin} style={{height: 40, width:80,resizeMode: 'contain' }} />
                  </MapView.Marker>
                  <MapView.Marker title="Tujuan" coordinate={this.state.arrTujuan[index]}>
                  <Text style={{borderColor:"#008c45",backgroundColor:"white", textAlign:"center",borderRadius:10,borderWidth: 1, fontSize:10, padding:2}}>TUJUAN{"\n"}<Text style={{fontSize:8,fontStyle:"italic"}}>{this.state.daftarOrder[index].id_order}</Text></Text><Image source={logoPin} style={{height: 40, width:80,resizeMode: 'contain' }} />
                  </MapView.Marker>
                  <MapViewDirections
                    origin={this.state.arrAsal[index]}
                    destination={this.state.arrTujuan[index]}
                    apikey={GOOGLE_MAPS_APIKEY}
                    mode="DRIVING"
                    strokeWidth={3}
                    strokeColor="hotpink"
                  />
                </View>
                
              );
            })}

          </MapView>



            
                  {/* <Button transparent onPress={this.backToNormal}>
                    <Icon name="arrow-back" />
                  </Button> */}

                <Text style={styles.classHeaderDetail}>{this.state.indexData.id_trip + " ("+this.state.indexData.status+")"}</Text>
                {/* <ScrollView style={{}}> */}
                  <View style={[styles.viewDetailTrip,{marginTop:5}]}>
                    <Text style={styles.classBodyInfo}>Shipper</Text>
                    <Text style={styles.classBodyInfo}>Jenis Kendaraan</Text>
                  </View>
                  <View style={[styles.viewDetailTrip, styles.viewMarginBottom]}>
                    <Text style={styles.classBodyData}>{this.state.indexData.nama_shipper}</Text>
                    <Text style={styles.classBodyData}>{this.state.indexData.jenis_kendaraan}</Text>
                  </View>
                  <View style={styles.viewDetailTrip}>
                    <Text style={styles.classBodyInfo}>Nama (HP) Driver</Text>
                    <Text style={styles.classBodyInfo}>Plat Nomor</Text>
                  </View>
                  <View style={[styles.viewDetailTrip, styles.viewMarginBottom]}>
                    <Text style={styles.classBodyData}>{this.state.indexData.nama_driver} {"\n"}({this.state.indexData.hp_driver})</Text>
                    <Text style={styles.classBodyData}>{this.state.indexData.plat_nomor}</Text>
                  </View>
                  <View style={styles.viewDetailTrip}>
                    <Text style={styles.classBodyInfo}>Kota Asal</Text>
                    <Text style={styles.classBodyInfo}>Kota Tujuan</Text>
                  </View>
                  <View style={[styles.viewDetailTrip, styles.viewMarginBottom]}>
                    <Text style={styles.classBodyData}>{this.state.indexData.kota_asal}</Text>
                    <Text style={styles.classBodyData}>{this.state.indexData.kota_tujuan}</Text>
                  </View>

                  <View style={styles.viewDetailTrip}>
                    <Text style={styles.classBodyInfo}>Waktu Pengiriman</Text>
                    <Text style={styles.classBodyInfo}>Waktu Sampai</Text>
                  </View>
                  <View style={[styles.viewDetailTrip, styles.viewMarginBottom]}>
                    <Text style={[styles.classBodyData,{fontStyle:"italic"}]}>{this.state.indexData.tanggal_pengiriman.split('T')[0]}{" "}{this.state.indexData.jam_pengiriman}</Text>
                    <Text style={[styles.classBodyData,{fontStyle:"italic"}]}>{this.state.indexData.tanggal_pengiriman.split('T')[0]}{" "}{this.state.indexData.jam_sampai}</Text>
                  </View>
                  <Text style={{fontSize:15,color:"black",width:"50%",marginLeft:20}}>Daftar Order</Text>
                  <FlatList
                    horizontal
                    data={this.state.daftarOrder}
                    style={{marginLeft:20,marginBottom:10}}
                    renderItem={({ item: value }) => {
                      return (
                        <Card>
                          {/* Ini untuk narik detailOrder/Daftar order dikode EPM*** */}
                          <TouchableOpacity onPress={()=>this.openDetailOrderModal(value)}>
                            <CardItem >
                              <Body >
                                <Text style={{fontSize:12,width:"100%",textAlign:"center",borderRadius:4}}>
                                      {value.id_order}
                                    </Text>
                                    <Text style={{fontSize:10,width:"100%",textAlign:"center",borderRadius:4}}>
                                      {value.status_detail}
                                  </Text>
                              </Body>
                            </CardItem>
                          </TouchableOpacity>
                        </Card>
                      );
                  }}
                  keyExtractor={(item, index) => index.toString()}
                />
                <View style = {styles.lineStyle} />
                {/* </ScrollView> */}
                {/* </ImageBackground> */}
              </View>
            :
            // if elsenya

            <View>
              {/* BUG KETIKA GANTI BULAN -> Fix di librarynya */}

              {this.state.startDate.format('YYYY-MM-DD')==this.state.endDate.format('YYYY-MM-DD')? 
              <Text style={{margin:10, color:"#7d8d8c", fontSize:12, fontWeight:'bold'}}>Performance Transporter ({this.state.startDate.format('D MMMM YYYY')}):</Text>
              :
              <Text style={{margin:10, color:"#7d8d8c", fontSize:12, fontWeight:'bold'}}>Performance Transporter ({this.state.startDate.format('D MMMM YYYY')} - {this.state.endDate.format('D MMMM YYYY')}):</Text>
              }

              
              {/* <Text style={{margin:10, color:"#7d8d8c", fontSize:16, fontWeight:'bold'}}>Performance Transporter ({moment().format('YYYY-MM-DD')}):</Text> */}
              {/* <Text style={{margin:10, color:"#7d8d8c", fontSize:16, fontWeight:'bold'}}>Performance Transporter ({this.state.periodeRapor}):</Text> */}
              {/* <Text style={{margin:10, color:"#616161", fontSize:17, alignSelf: 'center'}}> Performance Transporter</Text> */}

              <View style = {styles.lineStyle} />
              {/* Garis pemisah */}


              {/* Total Trip dan Pemenuhan */}
              {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row' }}>
                  <View style={{ flex: 1, alignSelf: 'stretch' , backgroundColor:sliceColor[0], margin:10, borderRadius:10}}>
                    <Text style={{textAlign:"center", color:"white"}}>Total Trip</Text>
                    <Text style={{textAlign:"center", color:"white", fontSize:20}}>{this.state.totalOrderPerformance}</Text>
                  </View>
                  <View style={{ flex: 1, alignSelf: 'stretch' ,  backgroundColor:sliceColor[1], margin:10, borderRadius:10}}>
                    <Text style={{textAlign:"center", color:"white"}}>Pemenuhan</Text>
                    <Text style={{textAlign:"center", color:"white", fontSize:20}}>{(this.state.percentageConfirm.toString()).substring(0,5)}%</Text>
                  </View>
                </View>
              </View>

              <View style = {styles.lineStyle} /> */}
              {/* Garis pemisah */}


              {/* PieChart */}
              {/* <View style={styles.pieChartViewStyle}>
              <View style={styles.flexGrid }>
                <PieChart
                  chart_wh={chart_wh}
                  series={this.state.performanceData}
                  sliceColor={sliceColor}
                  doughnut={true}
                  coverRadius={0.45}
                  coverFill={'#FFF'}
                  style={{marginTop:10, marginLeft:15,marginRight:10}}
                />
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' ,marginTop:30, marginLeft:10}}>
                  <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row'}}>
                    <View style={{backgroundColor:sliceColor[0], height: 20, width:20}}></View>
                    <View style={{ flex: 2, alignSelf: 'stretch' , marginLeft:10}}>
                      <Text style={styles.fontSmall}>Close Trip</Text>
                    </View>
                    <View style={{ flex: 1, alignSelf: 'stretch' , marginRight:20}}>
                      <Text style={{textAlign:"right"}}>{this.state.totalOrderPerformance>0?this.state.performanceData[0]:0}</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row' }}>
                    <View style={{backgroundColor:sliceColor[1], height: 20, width:20}}></View>
                    <View style={{ flex: 2, alignSelf: 'stretch' , marginLeft:10}}>
                      <Text style={styles.fontSmall}>Rejected Trip</Text>
                    </View>
                    <View style={{ flex: 1, alignSelf: 'stretch' , marginRight:20}}>
                      <Text style={{textAlign:"right"}}>{this.state.totalOrderPerformance>0?this.state.performanceData[1]:0}</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row' }}>
                    <View style={{backgroundColor:sliceColor[2], height: 20, width:20}}></View>
                    <View style={{ flex: 2, alignSelf: 'stretch' , marginLeft:10}}>
                      <Text style={styles.fontSmall}>Cancel Trip</Text>
                    </View>
                    <View style={{ flex: 1, alignSelf: 'stretch' , marginRight:20}}>
                      <Text style={{textAlign:"right"}}>{this.state.totalOrderPerformance>0?this.state.performanceData[2]:0}</Text>
                    </View>
                  </View>
                </View>
              </View>
              </View> */}
              {/* End of pieChar */}



              {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}> */}
                {/* <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row' }}>
                  <View style={{ flex: 1, alignSelf: 'stretch', justifyContent: 'center', backgroundColor:sliceColor[0], margin:10, borderRadius:10, height: 70}}>
                    <View style={{flex: 1}}>
                      <Text style={{alignSelf:'flex-start'}}> Total Trip</Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={{alignSelf:'flex-end'}}>{this.state.totalOrderPerformance}</Text>
                    </View>
                  </View>
                </View> */}
              {/* </View> */}

                {/* Old Dashboard */}
              {/* <View style={styles.dashboardViewStyle}>
                <View style={styles.dashboardViewStyleLeft}>
                  <View style={styles.dashboardViewStyleLeftIcon}>
                    <Icon type="MaterialCommunityIcons" name='steering' style={{color: 'green'}}/>
                  </View>
                  <View style={styles.dashboardViewStyleLeftText}>
                    <Text>Jumlah Pesanan</Text>
                  </View>
                </View>

                <View style={styles.dashboardViewStyleRight}>
                  <Text>Isi Content</Text>
                </View>
              </View>   */}



            <View style={{flex:1, flexDirection: 'row'}}>

              <View style={styles.circleViewStyle}>
                {/* <TouchableOpacity onPress={()=>this.openModal('Active')}> */}
                  <View>
                    <ProgressCircle 
                              style={{marginTop: 20}} 
                              color={'#64da8a'} 
                              size={60} 
                              thickness={3} 
                              borderWidth={0} 
                              showsText={true}
                              unfilledColor={'#F2F4F4'} 
                              indeterminate={false} 
                              progress={
                                parseFloat(
                                this.state.getCountKonfirmasiPercentage)
                              }  
                              textStyle={{fontSize: 10}}
                              formatText={() => {
                              return ` ${this.state.getCountKonfirmasi}\n${
                                this.state.getCountKonfirmasiPercentage*100
                              }%`
                            }} 
                    />
                    {/* Pake state biar progress dan format text responsive || warna yg lain #00997A */}
                  </View>

                  <View>
                    <Text style={styles.textStyleCircle}>Konfirmasi</Text>
                  </View>
                  {/* </TouchableOpacity> */}
              </View>
              

              <View style={styles.circleViewStyle}>
                <View>
                    <ProgressCircle 
                              style={{marginTop: 20}} 
                              color={'#2989E8'} 
                              size={60} 
                              thickness={3} 
                              borderWidth={0} 
                              showsText={true}
                              unfilledColor={'#F2F4F4'} 
                              indeterminate={false} 
                              progress={
                                parseFloat(
                                this.state.getCountKedatanganPercentage)
                              } 
                              // textStyle={{fontSize:10, color: '#7d8d8c'}}
                              textStyle={{fontSize: 10}} 
                              formatText={() => {
                              return ` ${this.state.getCountKedatangan}\n${
                                this.state.getCountKedatanganPercentage*100
                              }%`
                            }} 
                    />
                  {/* Pake state biar progress dan format text responsive || warna yg lain #00997A */}
                </View>

                <View>
                  <Text style={styles.textStyleCircle}>Kedatangan</Text>
                </View>
              </View>

            </View>



            <View style={{flex:1, flexDirection: 'row'}}>
              
              <View style={styles.circleViewStyle}>
                <View>
                    <ProgressCircle 
                              style={{marginTop: 20}} 
                              color={'#4ecdc4'} 
                              size={50} 
                              thickness={3} 
                              borderWidth={0} 
                              showsText={true}
                              unfilledColor={'#F2F4F4'} 
                              indeterminate={false} 
                              progress={
                                parseFloat(
                                this.state.getCountPengirimanPercentage)
                              }  
                              textStyle={{fontSize: 10}}
                              formatText={() => {
                              return ` ${this.state.getCountPengiriman}\n${
                                this.state.getCountPengirimanPercentage*100
                              }%`
                            }} 
                    />
                  {/* Pake state biar progress dan format text responsive || warna yg lain #00997A */}
                </View>

                <View>
                          <Text style={styles.textStyleCircle}>Pengiriman {'\n'}</Text>
                </View>
              </View>


              <View style={styles.circleViewStyle}>
                <View>
                    <ProgressCircle 
                              style={{marginTop: 20}} 
                              color={'#5c6b73'} 
                              size={50} 
                              thickness={3} 
                              borderWidth={0} 
                              showsText={true}
                              unfilledColor={'#F2F4F4'} 
                              indeterminate={false} 
                              progress={
                                parseFloat(
                                  this.state.getCountOccupancyPercentage)
                              }
                              textStyle={{fontSize: 10}}  
                              formatText={() => {
                              return ` ${this.state.getCountOccupancy}\n${
                                    this.state.getCountOccupancyPercentage*100
                              }%`
                            }} 
                    />
                  {/* Pake state biar progress dan format text responsive || warna yg lain #00997A */}
                </View>

                <View>
                  <Text style={styles.textStyleCircle}>Occupancy Truck</Text>
                </View>
              </View>


              <View style={styles.circleViewStyle}>
                <View>
                    <ProgressCircle 
                              style={{marginTop: 20}} 
                              color={'#F5AC41'} 
                              size={50} 
                              thickness={3} 
                              borderWidth={0} 
                              showsText={true}
                              unfilledColor={'#F2F4F4'} 
                              indeterminate={false} 
                              progress={
                                parseFloat(
                                this.state.getCountOnTimePercentage)
                              }  
                              textStyle={{fontSize: 10}}
                              formatText={() => {
                              return ` ${this.state.getCountOnTime}\n${
                                this.state.getCountOnTimePercentage*100
                              }%`
                            }} 
                    />
                  {/* Pake state biar progress dan format text responsive || warna yg lain #00997A */}
                </View>

                <View>
                  <Text style={styles.textStyleCircle}>On Time Kedatangan</Text>
                </View>
              </View>

            </View>






















          <View style={{flex:1, flexDirection: 'row'}}>
              {/* yg dibawah ini kotaknya */}
              <View style={styles.mtdViewStyleKiri}>
                  <View style={{backgroundColor: '#D1FCE8', height: 50, width: 50, borderRadius: 30, alignItems:'center', alignSelf: 'center', justifyContent: 'center'}}>
                    <Icon type="MaterialCommunityIcons" name='truck' style={{color: '#4D6680'}}/>
                  </View>
                  <View>
                    <Text style={{fontSize: 10, textAlign: 'center', marginTop: 5, color: '#7d8d8c'}}>Total Kendaraan Idle</Text>
                    <Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginTop: 10, color: '#7d8d8c'}}> {this.state.getKendaraanIdle} </Text>
                  </View>
              </View>


              <View style={styles.mtdViewStyleKanan}>
                <View style={{flex: 1}}>

                <View style={styles.mtdViewStyleKananPosition}>
                  <View style={{flex: 2}}>
                    <Text style={styles.mtdViewStyleKananText}>MTD Pesan</Text>
                  </View>
                  <View style={{flex: 2, marginRight: 10}}>
                    <Text style={styles.mtdViewStyleKananNumber}> {this.state.getMtdPesan}</Text>
                  </View>       
                </View>
                <ProgressBar 
                    progress={
                      parseFloat(this.state.getMtdPesanPercentage)
                    } 
                    borderWidth={0} 
                    width={null} 
                    style={styles.mtdViewStyleKananProgressBar} 
                    color={'#64da8a'} 
                    unfilledColor={'#F2F4F4'}/>


                {/* <ProgressPie progress={0.4} size={50} /> */}
                {/* <ProgressCircle progress={0.4} size={30} indeterminate={false} /> */}

                <View style={styles.mtdViewStyleKananPosition}>
                  <View style={{flex: 2}}>
                    <Text style={styles.mtdViewStyleKananText}>MTD Tepat Waktu</Text>
                  </View>
                  <View style={{flex: 2, marginRight: 10}}>
                    <Text style={styles.mtdViewStyleKananNumber}> {this.state.getMtdTepat}</Text>
                  </View>       
                </View>
                <ProgressBar 
                    progress={
                      parseFloat(this.state.getMtdTepatPercentage)
                    } 
                    borderWidth={0} 
                    width={null} 
                    style={styles.mtdViewStyleKananProgressBar} 
                    color={'#F5AC41'} 
                    unfilledColor={'#F2F4F4'}/>


                <View style={styles.mtdViewStyleKananPosition}>
                  <View style={{flex: 2}}>
                    <Text style={styles.mtdViewStyleKananText}>MTD Terlambat</Text>
                  </View>
                  <View style={{flex: 2, marginRight: 10}}>
                    <Text style={styles.mtdViewStyleKananNumber}> {this.state.getMtdTerlambat}</Text>
                  </View>       
                </View>
                <ProgressBar 
                    progress={
                      parseFloat(this.state.getMtdTerlambatPercentage)
                    } 
                    borderWidth={0} 
                    width={null} 
                    style={styles.mtdViewStyleKananProgressBar} 
                    color={'#5A6A7C'} 
                    unfilledColor={'#F2F4F4'}/>


                <View style={styles.mtdViewStyleKananPosition}>
                  <View style={{flex: 2}}>
                    <Text style={styles.mtdViewStyleKananText}>MTD Batal</Text>
                  </View>
                  <View style={{flex: 2, marginRight: 10}}>
                    <Text style={styles.mtdViewStyleKananNumber}> {this.state.getMtdBatal}</Text>
                  </View>       
                </View>
                <ProgressBar 
                    progress={
                      parseFloat(this.state.getMtdBatalPercentage)
                    } 
                    borderWidth={0} 
                    width={null} 
                    style={styles.mtdViewStyleKananProgressBar} 
                    color={'#EE585A'} 
                    unfilledColor={'#F2F4F4'}/>


                {/* <Text style={{marginLeft: 10, marginBottom:-7, marginTop: 5, fontSize: 12}}>MTD Tepat Waktu {'\t\t'} 42</Text>
                <ProgressBar progress={0.3} borderWidth={0} width={null} style={{margin: 10, marginBottom: 5}} color={'#F5AC41'} unfilledColor={'#F2F4F4'}/>
                
                <Text style={{marginLeft: 10, marginBottom:-7, marginTop: 5, fontSize: 12}}>MTD Terlambat {'\t\t'} 42</Text>
                <ProgressBar progress={0.3} borderWidth={0} width={null} style={{margin: 10, marginBottom: 5}} color={'#5A6A7C'} unfilledColor={'#F2F4F4'}/>

                <Text style={{marginLeft: 10, marginBottom:-7, marginTop: 5, fontSize: 12}}>MTD Batal {'\t\t'} 42</Text>
                <ProgressBar progress={0.3} borderWidth={0} width={null} style={{margin: 10, marginBottom: 5}} color={'#EE585A'} unfilledColor={'#F2F4F4'}/> */}

                </View>
              </View>
          </View>




          <View style={{flex: 1, flexDirection: 'row'}}>
          
              <View style={styles.dashboardViewStyle2}>
                {/* <TouchableOpacity onPress={()=>this.modalDashboard('Jumlah Pesanan')}> */}
                  <View style={styles.dashboardViewStyleLeft2}>
                    <View style={styles.dashboardViewStyleLeftIcon2}>
                      <Icon type="MaterialCommunityIcons" name='pencil' style={{color: '#00997A'}}/>
                    </View>
                    <View style={styles.dashboardViewStyleLeftText2}>
                      <Text style={[styles.textDashboard, {fontWeight: 'bold', fontSize: 16}]}>{this.state.getCountJumlahPesanan}</Text>
                      <Text style={styles.textDashboard}>Jumlah Pesanan</Text>
                    </View>
                  </View>
                {/* </TouchableOpacity> */}
              </View>
          

              <View style={styles.dashboardViewStyle2}>
                {/* <TouchableOpacity onPress={()=>this.modalDashboard('Sudah Konfirmasi')}> */}
                  <View style={styles.dashboardViewStyleLeft2}>
                    <View style={styles.dashboardViewStyleLeftIcon2}>
                      <Icon type="MaterialCommunityIcons" name='check' style={{color: '#00997A'}}/>
                    </View>
                    <View style={styles.dashboardViewStyleLeftText2}>
                      <Text style={styles.textDashboardNumber}>{this.state.getCountSudahKonfirmasi}</Text>
                      <Text style={styles.textDashboard}> Sudah Konfirmasi</Text>
                    </View>
                  </View>
                {/* </TouchableOpacity> */}
              </View>
          </View>

          <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={styles.dashboardViewStyle2}>
                {/* <TouchableOpacity onPress={()=>this.modalDashboard('Belum Konfirmasi')}> */}
                  <View style={styles.dashboardViewStyleLeft2}>
                    <View style={styles.dashboardViewStyleLeftIcon2}>
                      <Icon type="MaterialIcons" name='access-time' style={{color: '#00997A'}}/>
                    </View>
                    <View style={styles.dashboardViewStyleLeftText2}>
                      <Text style={styles.textDashboardNumber}>{this.state.getCountBelumKonfirmasi}</Text>
                      <Text style={styles.textDashboard}>Belum Konfirmasi</Text>
                    </View>
                  </View>
                {/* </TouchableOpacity> */}
              </View>

              <View style={styles.dashboardViewStyle2}>
                {/* <TouchableOpacity onPress={()=>this.modalDashboard('Batal')}> */}
                  <View style={styles.dashboardViewStyleLeft2}>
                    <View style={styles.dashboardViewStyleLeftIcon2}>
                      <Icon type="MaterialCommunityIcons" name='cancel' style={{color: '#00997A'}}/>
                    </View>
                    <View style={styles.dashboardViewStyleLeftText2}>
                      <Text style={[styles.textDashboardNumber, {alignItems: 'center'}]}>{'\t \t '}   {this.state.getCountBatal}</Text>
                      <Text style={[styles.textDashboard, {alignItems: 'center'}]}>{'\t \t '}   Batal</Text>
                    </View>
                  </View>
                {/* </TouchableOpacity> */}
              </View>
          </View>

          
          <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={styles.dashboardViewStyle2}>
                {/* <TouchableOpacity onPress={()=>this.modalDashboard('Sudah Datang')}> */}
                  <View style={styles.dashboardViewStyleLeft2}>
                    <View style={styles.dashboardViewStyleLeftIcon2}>
                      <Icon type="MaterialCommunityIcons" name='clipboard-check' style={{color: '#00997A'}}/>
                    </View>
                    <View style={styles.dashboardViewStyleLeftText2}>
                      <Text style={styles.textDashboardNumber}>{'   '}{this.state.getCountSudahDatang}</Text>
                      <Text style={styles.textDashboard}>{'   '}Sudah Datang</Text>
                    </View>
                  </View>
                {/* </TouchableOpacity> */}
              </View>

              <View style={styles.dashboardViewStyle2}>
                {/* <TouchableOpacity onPress={()=>this.modalDashboard('Belum Datang')}> */}
                  <View style={styles.dashboardViewStyleLeft2}>
                    <View style={styles.dashboardViewStyleLeftIcon2}>
                      <Icon type="MaterialCommunityIcons" name='timer' style={{color: '#00997A'}}/>
                    </View>
                    <View style={styles.dashboardViewStyleLeftText2}>
                      <Text style={styles.textDashboardNumber}>{'   '}{this.state.getCountBelumDatang}</Text>
                      <Text style={styles.textDashboard}>{'   '}Belum Datang</Text>
                    </View>
                  </View>
                {/* </TouchableOpacity> */}
              </View>
          </View>


          <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={styles.dashboardViewStyle2}>
                {/* <TouchableOpacity onPress={()=>this.modalDashboard('Sudah Berangkat')}> */}
                  <View style={styles.dashboardViewStyleLeft2}>
                    <View style={styles.dashboardViewStyleLeftIcon2}>
                      <Icon type="MaterialCommunityIcons" name='truck' style={{color: '#00997A'}}/>
                    </View>
                    <View style={styles.dashboardViewStyleLeftText2}>
                      <Text style={styles.textDashboardNumber}>{this.state.getCountSudahBerangkat}</Text>
                      <Text style={styles.textDashboard}>Sudah Berangkat</Text>
                    </View>
                  </View>
                {/* </TouchableOpacity> */}
              </View>

              <View style={styles.dashboardViewStyle2}>
                {/* <TouchableOpacity onPress={()=>this.modalDashboard('Belum Berangkat')}> */}
                  <View style={styles.dashboardViewStyleLeft2}>
                    <View style={styles.dashboardViewStyleLeftIcon2}>
                      <Icon type="MaterialCommunityIcons" name='package-variant-closed' style={{color: '#00997A'}}/>
                    </View>
                    <View style={styles.dashboardViewStyleLeftText2}>
                      <Text style={styles.textDashboardNumber}>{this.state.getCountBelumBerangkat}</Text>
                      <Text style={styles.textDashboard}>Belum Berangkat</Text>
                    </View>
                  </View>
                {/* </TouchableOpacity> */}
              </View>
          </View>


          <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={styles.dashboardViewStyle2}>
                {/* <TouchableOpacity onPress={()=>this.modalDashboard('POD')}> */}
                  {/* old this.modalDashboard apa bedanya dengan diatas */}
                  <View style={styles.dashboardViewStyleLeft2}>
                    <View style={styles.dashboardViewStyleLeftIcon2}>
                      <Icon type="MaterialCommunityIcons" name='barcode' style={{color: '#00997A'}}/>
                    </View>
                    <View style={styles.dashboardViewStyleLeftText2}>
                      <Text style={styles.textDashboardNumber}>{'\t \t \t'}{this.state.getCountPOD}</Text>
                      <Text style={styles.textDashboard}>{'\t \t \t'}POD</Text>
                    </View>
                  </View>
                {/* </TouchableOpacity> */}
              </View>

              <View style={styles.dashboardViewStyle2Hidden}>
                {/* <View style={styles.dashboardViewStyleLeft2}>
                  <View style={styles.dashboardViewStyleLeftIcon2}>
                    <Icon type="MaterialCommunityIcons" name='steering' style={{color: 'green'}}/>
                  </View>
                  <View style={styles.dashboardViewStyleLeftText2}>
                  <Text style={styles.textDashboard}>1 {'\n'} Jumlah Pesanan</Text>
                  </View>
                </View> */}
              </View>
          </View>

          </View> //tutupnya si perfomance transporter
          }

{/* search filter (bisanih) */}
                {/* <View style={{
                      flex: 1,
                      backgroundColor: '#fff',
                      justifyContent: 'flex-start'
                }}>
                <SearchInput 
                  onChangeText={(term) => { this.searchUpdated(term) }} 
                  style={{padding: 10,
                    borderColor: '#CCC',
                    borderWidth: 1}}
                  placeholder="Type a message to search"
                  />
                <ScrollView>
                  {filtered.map(value => {
                    return (
                      <TouchableOpacity onPress={()=>alert(value.id)} key={value.id} 
                      style={{borderBottomWidth: 0.5,
                        borderColor: 'rgba(0,0,0,0.3)',
                        padding: 10}}>
                        <View>
                          <Text>{value.id}</Text>
                          <Text style={{color: 'rgba(0,0,0,0.5)'}}>{value.id_trip}</Text>
                        </View>
                      </TouchableOpacity>
                    )
                  })}
                </ScrollView>
              </View> */}




          {/* Ini modal Aktif trip dan Armada */}
          <Modal
            animationType="slide"
            style={{backgroundColor:"white"}}
            visible={this.state.modalVisible}
            onRequestClose={this.closeModal}
            // style={styles.modal}
            >
              <View style={styles.modal}>
                <TouchableOpacity style={styles.tombolClose2} onPress={this.closeModal}>
                    <Text style={styles.textclose}>Tutup</Text>
                  </TouchableOpacity>
                <Text style={{width:"100%", textAlign:"center", fontSize:20, fontWeight:"bold"}}>
                  FILTER TRIP
                </Text>
                <View style = {[styles.lineStyle,{margin:5}]} />
                <View style={{flexDirection: 'row'}}>
                  <Text style={{width: '100%', textAlign:"center", color:"#7d8d8c", fontSize:12, fontWeight:'bold'}}>
                    Search Filter
                  </Text>
                  {/* <Text style={{width: '50%', textAlign:"center"}}>
                    Plat Nomor
                  </Text> */}
                </View>
                {/* di style bawah ini, ada flexDirection row yg dihapus agar bisa 100% */}
                <View style={{justifyContent: 'center', margin: 5}}> 
                  {/* Text Input buat Search Shipper */}
                  <SearchInput 
                  onChangeText={(term) => { this.searchUpdated(term) }} 
                  style={{
                    padding: 10,
                    borderColor: '#CCC',
                    borderWidth: 2,
                    borderRadius: 10,
                    width: '100%',

                  }}
                  placeholder="Search"
                  inputFocus={true}
                  />
                  {/* search drop down OLD */}
                  {/* <SearchableDropdown
                    onTextChange={text => console.log(text)}
                    //On text change listner on the searchable input
                    onItemSelect={(item) => this.searchTrip(1,item)}
                    //onItemSelect called after the selection from the dropdown
                    containerStyle={{ padding: 5 , width:"50%",height:"100%"}}
                    //suggestion container style
                    textInputStyle={{
                      //inserted text style
                      padding: 3,
                      borderWidth: 1,
                      borderColor: '#ccc',
                      backgroundColor: '#FAF7F6',
                      borderRadius:10,
                      textAlign:"center"
                    }}
                    itemStyle={{
                      //single dropdown item style
                      padding: 10,
                      marginTop: 2,
                      backgroundColor: '#FAF9F8',
                      borderColor: '#bbb',
                      borderWidth: 1
                    }}
                    itemTextStyle={{
                      //text style of a single dropdown item
                      color: '#222'
                    }}
                    itemsContainerStyle={{
                      //items container style you can pass maxHeight
                      //to restrict the items dropdown hieght
                      maxHeight: '75%',
                    }}
                    items={this.state.dataMasterShipper}
                    //mapping of item array
                    placeholder="Pilih Shipper"
                    //place holder for the search input
                    resetValue={false}
                    //reset textInput Value with true and false state
                    underlineColorAndroid="transparent"
                    //To remove the underline from the android input
                  /> */}

                  {/* Searchable buat search Plat Nomor */}
                  {/* <SearchableDropdown
                    onTextChange={text => console.log(text)}
                    //On text change listner on the searchable input
                    onItemSelect={item => this.searchTrip(2,item)}
                    //onItemSelect called after the selection from the dropdown
                    containerStyle={{ padding: 5 , width:"50%",height:"100%"}}
                    //suggestion container style
                    textInputStyle={{
                      //inserted text style
                      padding: 3,
                      borderWidth: 1,
                      borderColor: '#ccc',
                      backgroundColor: '#FAF7F6',
                      borderRadius:10,
                      textAlign:"center"
                    }}
                    itemStyle={{
                      //single dropdown item style
                      padding: 10,
                      marginTop: 2,
                      backgroundColor: '#FAF9F8',
                      borderColor: '#bbb',
                      borderWidth: 1
                    }}
                    itemTextStyle={{
                      //text style of a single dropdown item
                      color: '#222',
                    }}
                    itemsContainerStyle={{
                      //items container style you can pass maxHeight
                      //to restrict the items dropdown hieght
                      maxHeight: '75%',
                    }}
                    items={this.state.dataMasterKendaraan}
                    //mapping of item array
                    placeholder="Pilih Plat"
                    //place holder for the search input
                    resetValue={false}
                    //reset textInput Value with true and false state
                    underlineColorAndroid="transparent"
                    //To remove the underline from the android input
                  /> */}
                </View>

                {/* <Text style={{width:"50%", textAlign:"center"}}>
                  Rute Trip
                </Text> */}
                {/* <View style={{flexDirection: 'row'}}>
                  <SearchableDropdown
                      onTextChange={text => console.log(text)}
                      //On text change listner on the searchable input
                      onItemSelect={item => this.searchTrip(3,item)}
                      //onItemSelect called after the selection from the dropdown
                      containerStyle={{ padding: 5 , width:"50%",height:"100%"}}
                      //suggestion container style
                      textInputStyle={{
                        //inserted text style
                        padding: 3,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        backgroundColor: '#FAF7F6',
                        borderRadius:10,
                        textAlign:"center"
                      }}
                      itemStyle={{
                        //single dropdown item style
                        padding: 10,
                        marginTop: 2,
                        backgroundColor: '#FAF9F8',
                        borderColor: '#bbb',
                        borderWidth: 1
                      }}
                      itemTextStyle={{
                        //text style of a single dropdown item
                        color: '#222'
                      }}
                      itemsContainerStyle={{
                        //items container style you can pass maxHeight
                        //to restrict the items dropdown hieght
                        maxHeight: '65%',
                      }}
                      items={this.state.dataMasterKota}
                      //mapping of item array
                      placeholder="Asal Trip"
                      //place holder for the search input
                      resetValue={false}
                      //reset textInput Value with true and false state
                      underlineColorAndroid="transparent"
                      //To remove the underline from the android input
                    />

                    <SearchableDropdown
                      onTextChange={text => console.log(text)}
                      //On text change listner on the searchable input
                      onItemSelect={item => this.searchTrip(4,item)}
                      //onItemSelect called after the selection from the dropdown
                      containerStyle={{ padding: 5 , width:"50%",height:"100%"}}
                      //suggestion container style
                      textInputStyle={{
                        //inserted text style
                        padding: 3,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        backgroundColor: '#FAF7F6',
                        borderRadius:10,
                        textAlign:"center"
                      }}
                      itemStyle={{
                        //single dropdown item style
                        padding: 10,
                        marginTop: 2,
                        backgroundColor: '#FAF9F8',
                        borderColor: '#bbb',
                        borderWidth: 1
                      }}
                      itemTextStyle={{
                        //text style of a single dropdown item
                        color: '#222',
                      }}
                      itemsContainerStyle={{
                        //items container style you can pass maxHeight
                        //to restrict the items dropdown hieght
                        maxHeight: '65%',
                      }}
                      items={this.state.dataMasterKota}
                      //mapping of item array
                      placeholder="Tujuan Trip"
                      //place holder for the search input
                      resetValue={false}
                      //reset textInput Value with true and false state
                      underlineColorAndroid="transparent"
                      //To remove the underline from the android input
                    />
                  </View> */}


                    {/* contoh dual style */}
                  <View style = {[styles.lineStyle,{margin:8}]} />


                  {/* Modal baru */}
                  {
                  this.state.displayModal=='Active'?

                  <ScrollView>
                  {filteredActive.map(value => {
                    return (
                      <Card>
                              <TouchableOpacity onPress={()=>this.itemSelected(JSON.stringify(value))}>
                                <CardItem >
                                  <Body >
                                    <Text style={[styles.listTripSize,{width:"100%", backgroundColor:"#008c45", color:"white", textAlign:"center",borderRadius:4, marginBottom:10}]}>
                                      {value.id_trip}
                                    </Text>
                                    <View style={[styles.flexGrid,{marginBottom:5}]}>
                                      <Text style={styles.mediumFontSize}>
                                        {value.nama_shipper}
                                      </Text>
                                      <Text style={styles.mediumFontSize}>
                                        {value.jenis_kendaraan.substring(0,25)}
                                      </Text>
                                    </View>
                                    <View style={[styles.flexGrid,{marginBottom:5}]}>
                                      <Text style={styles.superMediumFontSize}>
                                        {value.kota_asal}
                                      </Text>
                                      <Text style={styles.superMediumFontSize}>
                                        {value.kota_tujuan}
                                      </Text>
                                    </View>
                                    <View style={styles.flexGrid}>
                                      <Text style={styles.detailTripFontSize}>
                                        {value.tanggal_pengiriman.split('T')[0] +" "+ value.jam_pengiriman}
                                      </Text>
                                      <Text style={styles.detailTripFontSize}>
                                        {value.tanggal_sampai.split('T')[0]+" "+ value.jam_sampai}
                                      </Text>
                                    </View>
                                  </Body>
                                </CardItem>
                              </TouchableOpacity>
                            </Card>
                    )
                  })}
                  </ScrollView>

                  :
                  <ScrollView>
                  {filteredArmada.map(value => {
                    return (
                      <TouchableOpacity onPress={()=>this.itemSelected(JSON.stringify(value))} key={value.id} 
                      style={{borderBottomWidth: 0.5,
                        borderColor: 'rgba(0,0,0,0.3)',
                        padding: 10}}>
                        <View>
                          <Text>{value.id}</Text>
                          <Text style={{color: 'rgba(0,0,0,0.5)'}}>{value.id_trip}</Text>
                        </View>
                      </TouchableOpacity>
                    )
                  })}
                  </ScrollView>
                
                }

                
                
                  {/* ScrollView Old */}
                  {/* <ScrollView>
                  {filteredActive.map(value => {
                    return (
                      <TouchableOpacity onPress={()=>this.itemSelected(JSON.stringify(value))} key={value.id} 
                      style={{borderBottomWidth: 0.5,
                        borderColor: 'rgba(0,0,0,0.3)',
                        padding: 10}}>
                        <View>
                          <Text>{value.id}</Text>
                          <Text style={{color: 'rgba(0,0,0,0.5)'}}>{value.id_trip}</Text>
                        </View>
                      </TouchableOpacity>
                    )
                  })}


                    {
                      this.state.displayModal=='Active'?
                      
                      // Isi dari Modal Trip Aktif
                      
                      <FlatList
                        data={this.state.activeTripArr}
                        style={{marginBottom:10}}
                        renderItem={({ item: value }) => {
                          return (
                            <Card>
                              <TouchableOpacity onPress={()=>this.itemSelected(JSON.stringify(value))}>
                                <CardItem >
                                  <Body >
                                    <Text style={[styles.listTripSize,{width:"100%", backgroundColor:"#008c45", color:"white", textAlign:"center",borderRadius:4, marginBottom:10}]}>
                                      {value.id_trip}
                                    </Text>
                                    <View style={[styles.flexGrid,{marginBottom:5}]}>
                                      <Text style={styles.mediumFontSize}>
                                        {value.nama_shipper}
                                      </Text>
                                      <Text style={styles.mediumFontSize}>
                                        {value.jenis_kendaraan.substring(0,25)}
                                      </Text>
                                    </View>
                                    <View style={[styles.flexGrid,{marginBottom:5}]}>
                                      <Text style={styles.superMediumFontSize}>
                                        {value.kota_asal}
                                      </Text>
                                      <Text style={styles.superMediumFontSize}>
                                        {value.kota_tujuan}
                                      </Text>
                                    </View>
                                    <View style={styles.flexGrid}>
                                      <Text style={styles.detailTripFontSize}>
                                        {value.tanggal_pengiriman.split('T')[0] +" "+ value.jam_pengiriman}
                                      </Text>
                                      <Text style={styles.detailTripFontSize}>
                                        {value.tanggal_sampai.split('T')[0]+" "+ value.jam_sampai}
                                      </Text>
                                    </View>
                                  </Body>
                                </CardItem>
                              </TouchableOpacity>
                            </Card>
                          );
                      }}
                      keyExtractor={(item, index) => index.toString()}
                    />
                      :
                      
                      // Armada
                      <FlatList
                        data={this.state.armadaTripArr}
                        style={{marginBottom:10}}
                        renderItem={({ item: value }) => {
                          return (
                            <Card >
                              <TouchableOpacity onPress={()=>this.itemSelected(JSON.stringify(value))}>
                                <CardItem >
                                  <Body >
                                    <Text style={[styles.listTripSize,{width:"100%", backgroundColor:"#008c45", color:"white", textAlign:"center",borderRadius:4, marginBottom:10}]}>
                                      {value.id_trip}
                                    </Text>
                                    <View style={[styles.flexGrid,{marginBottom:5}]}>
                                      <Text style={styles.mediumFontSize}>
                                        {value.nama_shipper}
                                      </Text>
                                      <Text style={styles.mediumFontSize}>
                                        {value.jenis_kendaraan.substring(0,25)}
                                      </Text>
                                    </View>
                                    <View style={[styles.flexGrid,{marginBottom:5}]}>
                                      <Text style={styles.superMediumFontSize}>
                                        {value.kota_asal}
                                      </Text>
                                      <Text style={styles.superMediumFontSize}>
                                        {value.kota_tujuan}
                                      </Text>
                                    </View>
                                    <View style={styles.flexGrid}>
                                      <Text style={styles.detailTripFontSize}>
                                        {value.tanggal_pengiriman.split('T')[0] +" "+ value.jam_pengiriman}
                                      </Text>
                                      <Text style={styles.detailTripFontSize}>
                                        {value.tanggal_sampai.split('T')[0]+" "+ value.jam_sampai}
                                      </Text>
                                    </View>
                                  </Body>
                                </CardItem>
                              </TouchableOpacity>
                            </Card>
                          );
                      }}
                      keyExtractor={(item, index) => index.toString()}
                    />
                    }
                    </ScrollView> */}
                  
                </View>
          </Modal>

          {/* Modal detail Order */}
          <Modal
            animationType="slide"
            style={{backgroundColor:"white"}}
            visible={this.state.modalDetailOrderVisible}
            onRequestClose={this.closeModal}
            // style={styles.modal}
            >
              <View style={styles.modal}>
                <View style={{flexDirection:"row"}}>
                  <Text style={{flex:2, marginLeft:10, fontSize:22, color:"#008c45", fontWeight:"bold"}}>
                    Detail Order
                  </Text>
                  <TouchableOpacity style={[styles.tombolClose2,{flex:1, width:"50%"}]} onPress={this.closeModal}>
                    <Text style={styles.textclose}>Tutup</Text>
                </TouchableOpacity>
                </View>

                <View style = {[styles.lineStyle,{marginBottom:10,marginTop:10}]} />
                <View style={{flexDirection:"row"}}>
                  <View style={{flex:1,marginLeft:10}}>
                    <Text style={{fontWeight:"bold", fontSize:15}}>
                      Order
                    </Text>
                    <Text style={{fontSize:12}}>
                      {this.state.selectedOrder.id_order}
                    </Text>
                  </View>
                  <View style={{flex:1}}>
                    <Text style={{fontWeight:"bold", textAlign:"center", fontSize:15}}>
                      Status
                    </Text>
                    <Text style={{textAlign:"center", fontSize:12}}>
                    {this.state.selectedOrder.status_detail}
                    </Text>
                  </View>
                  <View style={{flex:1,marginRight:10}}>
                    <Text style={{fontWeight:"bold", textAlign:"right", fontSize:15}}>
                      Pickup Date
                    </Text>
                    <Text style={{textAlign:"right", fontSize:12}}>
                    {this.state.selectedOrder.jadwal_penjemputan.split('T')[0]}
                    </Text>
                  </View>
                </View>
                <View style = {[styles.lineStyle,{marginBottom:15,marginTop:10}]} />
                <View style={{backgroundColor:"#008c45",width:"100%", borderRadius:10}}>
                  <View style={{flexDirection:"row", margin:7, backgroundColor:"white",justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={{uri:this.state.selectedOrder.foto_logo}} style={{flex:1, marginTop:7,marginBottom:20, width:80, height:50, resizeMode:"contain"}}></Image>
                    <View style={{flex:3, padding:10}}>
                      <Text style={{fontWeight:"bold", fontSize:15}}>
                        Shipper
                      </Text>
                      <Text style={{fontSize:12, marginBottom:8}}>
                        {this.state.selectedOrder.nama_shipper}
                      </Text>

                      <Text style={{fontWeight:"bold", fontSize:15}}>
                        Asal Pengiriman
                      </Text>
                      <Text style={{fontSize:12, marginBottom:8}}>
                      {this.state.selectedOrder.asal_perusahaan}
                      </Text>

                      <Text style={{fontWeight:"bold", fontSize:15}}>
                        Tujuan Pengiriman
                      </Text>
                      <Text style={{fontSize:12, marginBottom:8}}>
                      {this.state.selectedOrder.tujuan_perusahaan}
                      </Text>

                      <Text style={{fontWeight:"bold", fontSize:15}}>
                        Target Sampai
                      </Text>
                      <Text style={{fontSize:12, marginBottom:8}}>
                      {(this.state.selectedOrder.jadwal_sampai.replace('T',' ')).substring(0,16)}
                      </Text>

                      <Text style={{fontWeight:"bold", fontSize:15}}>
                        Berat / Dimensi / Kuantitas
                      </Text>
                      <Text style={{fontSize:12, marginBottom:7}}>
                        {
                          this.state.arrDetailOrder.map((value,index)=>{
                            return(
                              <Text style={{fontSize:12, marginBottom:7}}>
                                {value.berat}KG / {value.dimensi}CBM / {value.qty} Unit
                              </Text>
                            )
                          })
                        }
                      </Text>
                    </View>
                  </View>
                </View>
                <ScrollView style={{width:"100%", padding:10}}>
                    <Timeline
                      data={this.state.timelineData}
                      circleSize={20}
                      circleColor='rgb(0,140,69)'
                      lineColor='rgb(0,140,69)'
                      timeContainerStyle={{minWidth:52, marginTop: -5}}
                      timeStyle={{marginTop:5,textAlign: 'center', backgroundColor:'#ff6a61', color:'white', padding:5, borderRadius:13}}
                      descriptionStyle={{color:'gray'}}
                      options={{
                        style:{paddingTop:5}
                      }}
                      innerCircle={'dot'}
                    />
                  </ScrollView>
            </View>
          </Modal>


          {/* Modal Dashboard */}
          <Modal
            animationType="slide"
            style={{backgroundColor:"white"}}
            visible={this.state.modalDashboardVisible}
            onRequestClose={this.closeModalDashboard}
            // style={styles.modal}
            >
              <View style={styles.modal}>
                <TouchableOpacity style={styles.tombolClose2} onPress={this.closeModalDashboard}>
                    <Text style={styles.textclose}>Tutup</Text>
                  </TouchableOpacity>
                <Text style={{width:"100%", textAlign:"center", fontSize:20, fontWeight:"bold"}}>
                  {/* FILTER TRIP  */}
                  {this.state.judulDashboard}
                </Text>
                <View style = {[styles.lineStyle,{margin:8}]} />
                <View style={{flexDirection: 'row'}}>
                  <Text style={{width: '50%', textAlign:"center"}}>
                    Shipper
                  </Text>
                  <Text style={{width: '50%', textAlign:"center"}}>
                    Plat Nomor
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  {/* Text Input buat Search Shipper */}
                  <SearchableDropdown
                    onTextChange={text => console.log(text)}
                    //On text change listner on the searchable input
                    onItemSelect={(item) => this.searchTrip(1,item)}
                    //onItemSelect called after the selection from the dropdown
                    containerStyle={{ padding: 5 , width:"50%",height:"100%"}}
                    //suggestion container style
                    textInputStyle={{
                      //inserted text style
                      padding: 3,
                      borderWidth: 1,
                      borderColor: '#ccc',
                      backgroundColor: '#FAF7F6',
                      borderRadius:10,
                      textAlign:"center"
                    }}
                    itemStyle={{
                      //single dropdown item style
                      padding: 10,
                      marginTop: 2,
                      backgroundColor: '#FAF9F8',
                      borderColor: '#bbb',
                      borderWidth: 1
                    }}
                    itemTextStyle={{
                      //text style of a single dropdown item
                      color: '#222'
                    }}
                    itemsContainerStyle={{
                      //items container style you can pass maxHeight
                      //to restrict the items dropdown hieght
                      maxHeight: '75%',
                    }}
                    items={this.state.dataMasterShipper}
                    //mapping of item array
                    placeholder="Pilih Shipper"
                    //place holder for the search input
                    resetValue={false}
                    //reset textInput Value with true and false state
                    underlineColorAndroid="transparent"
                    //To remove the underline from the android input
                  />

                  {/* Text input buat search Plat Nomor */}
                  <SearchableDropdown
                    onTextChange={text => console.log(text)}
                    //On text change listner on the searchable input
                    onItemSelect={item => this.searchTrip(2,item)}
                    //onItemSelect called after the selection from the dropdown
                    containerStyle={{ padding: 5 , width:"50%",height:"100%"}}
                    //suggestion container style
                    textInputStyle={{
                      //inserted text style
                      padding: 3,
                      borderWidth: 1,
                      borderColor: '#ccc',
                      backgroundColor: '#FAF7F6',
                      borderRadius:10,
                      textAlign:"center"
                    }}
                    itemStyle={{
                      //single dropdown item style
                      padding: 10,
                      marginTop: 2,
                      backgroundColor: '#FAF9F8',
                      borderColor: '#bbb',
                      borderWidth: 1
                    }}
                    itemTextStyle={{
                      //text style of a single dropdown item
                      color: '#222',
                    }}
                    itemsContainerStyle={{
                      //items container style you can pass maxHeight
                      //to restrict the items dropdown hieght
                      maxHeight: '75%',
                    }}
                    items={this.state.dataMasterKendaraan}
                    //mapping of item array
                    placeholder="Pilih Plat"
                    //place holder for the search input
                    resetValue={false}
                    //reset textInput Value with true and false state
                    underlineColorAndroid="transparent"
                    //To remove the underline from the android input
                  />
                </View>

                <Text style={{width:"50%", textAlign:"center"}}>
                  Rute Trip
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <SearchableDropdown
                      onTextChange={text => console.log(text)}
                      //On text change listner on the searchable input
                      onItemSelect={item => this.searchTrip(3,item)}
                      //onItemSelect called after the selection from the dropdown
                      containerStyle={{ padding: 5 , width:"50%",height:"100%"}}
                      //suggestion container style
                      textInputStyle={{
                        //inserted text style
                        padding: 3,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        backgroundColor: '#FAF7F6',
                        borderRadius:10,
                        textAlign:"center"
                      }}
                      itemStyle={{
                        //single dropdown item style
                        padding: 10,
                        marginTop: 2,
                        backgroundColor: '#FAF9F8',
                        borderColor: '#bbb',
                        borderWidth: 1
                      }}
                      itemTextStyle={{
                        //text style of a single dropdown item
                        color: '#222'
                      }}
                      itemsContainerStyle={{
                        //items container style you can pass maxHeight
                        //to restrict the items dropdown hieght
                        maxHeight: '65%',
                      }}
                      items={this.state.dataMasterKota}
                      //mapping of item array
                      placeholder="Asal Trip"
                      //place holder for the search input
                      resetValue={false}
                      //reset textInput Value with true and false state
                      underlineColorAndroid="transparent"
                      //To remove the underline from the android input
                    />

                    <SearchableDropdown
                      onTextChange={text => console.log(text)}
                      //On text change listner on the searchable input
                      onItemSelect={item => this.searchTrip(4,item)}
                      //onItemSelect called after the selection from the dropdown
                      containerStyle={{ padding: 5 , width:"50%",height:"100%"}}
                      //suggestion container style
                      textInputStyle={{
                        //inserted text style
                        padding: 3,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        backgroundColor: '#FAF7F6',
                        borderRadius:10,
                        textAlign:"center"
                      }}
                      itemStyle={{
                        //single dropdown item style
                        padding: 10,
                        marginTop: 2,
                        backgroundColor: '#FAF9F8',
                        borderColor: '#bbb',
                        borderWidth: 1
                      }}
                      itemTextStyle={{
                        //text style of a single dropdown item
                        color: '#222',
                      }}
                      itemsContainerStyle={{
                        //items container style you can pass maxHeight
                        //to restrict the items dropdown hieght
                        maxHeight: '65%',
                      }}
                      items={this.state.dataMasterKota}
                      //mapping of item array
                      placeholder="Tujuan Trip"
                      //place holder for the search input
                      resetValue={false}
                      //reset textInput Value with true and false state
                      underlineColorAndroid="transparent"
                      //To remove the underline from the android input
                    />
                  </View>



                  <View style = {[styles.lineStyle,{margin:8}]} />
                    <ScrollView>

                      
                      {/* Dashboard */}
                      <FlatList
                        data={this.state.activeTripArr}
                        style={{marginBottom:10}}
                        renderItem={({ item: value }) => {
                          return (
                            <Card>
                              <TouchableOpacity onPress={()=>this.itemSelected(JSON.stringify(value))}>
                                <CardItem >
                                  <Body >
                                    <Text style={[styles.listTripSize,{width:"100%", backgroundColor:"#008c45", color:"white", textAlign:"center",borderRadius:4, marginBottom:10}]}>
                                      {value.id_trip}
                                    </Text>
                                    <View style={[styles.flexGrid,{marginBottom:5}]}>
                                      <Text style={styles.mediumFontSize}>
                                        {value.nama_shipper}
                                      </Text>
                                      <Text style={styles.mediumFontSize}>
                                        {value.jenis_kendaraan.substring(0,25)}
                                      </Text>
                                    </View>
                                    <View style={[styles.flexGrid,{marginBottom:5}]}>
                                      <Text style={styles.superMediumFontSize}>
                                        {value.kota_asal}
                                      </Text>
                                      <Text style={styles.superMediumFontSize}>
                                        {value.kota_tujuan}
                                      </Text>
                                    </View>
                                    <View style={styles.flexGrid}>
                                      <Text style={styles.detailTripFontSize}>
                                        {value.tanggal_pengiriman.split('T')[0] +" "+ value.jam_pengiriman}
                                      </Text>
                                      <Text style={styles.detailTripFontSize}>
                                        {value.tanggal_sampai.split('T')[0]+" "+ value.jam_sampai}
                                      </Text>
                                    </View>
                                  </Body>
                                </CardItem>
                              </TouchableOpacity>
                            </Card>
                          );
                      }}
                      keyExtractor={(item, index) => index.toString()}
                    />
                    </ScrollView>
                  
                </View>
          </Modal>






        </Content>
      </Container>
    );
  }
}

export default HomeView;
