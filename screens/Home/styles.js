import { StyleSheet } from 'react-native';

// sebelumnya elevation: 5
const styles = StyleSheet.create({
  container : {
    backgroundColor:'#f3f3f3',
    flex: 1,
    alignItems:'center',
    justifyContent :'center'
  },
  garisHeader: {
    width: 50,
    height: '80%',
    backgroundColor: 'red',
    transform: [
      {rotate: '45deg'}
    ]
  },

  red:{
    color: 'red'
  },

  dateSetelected:{
    backgroundColor: '#00997A'
  },

  dateBackdrop:{
    elevation: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 20000000000,
    margin: -10
    // marginLeft: -121
  },

  dateContainer:{
    zIndex: 300000000000
  },

  buttonHeader:{
    width:'28%',
    margin:10,
    borderRadius:8,
  },

  lineStyle:{
    borderWidth: 0.5,
    borderColor:'#7d8d8c'
},
dimensionBox:{
  height: 20, 
  width:20
},

fontSmall:{
  fontSize:15
},

fontMedium:{
  fontSize:20
},
modal:{
  backgroundColor: '#ffffff',
  padding: 10,
  borderWidth: 1,
  borderRadius: 5,
  borderColor: '#008c45',
  height:"100%"
},
tombolClose2:{
  width: 100,
  height: 30,
  borderRadius: 5,
  borderWidth: 1,
  borderColor: '#008c45',
  alignSelf: 'flex-end',
  justifyContent: 'center'
},
tombolClose3:{
  height: 30,
  borderRadius: 5,
  borderWidth: 1,
  borderColor: '#008c45',
  justifyContent: 'center',
  alignItems: 'stretch',
  margin: 10,
},
textclose:{
  color: '#008c45',
  fontWeight: 'bold',
  textAlign: 'center',
  fontSize: 15
},
  mapStyle: {
    width: '100%',
    height: 250,
    flex: 1,
    padding:10,
    // margin: 10,

  },
  webview:{
    height: 220
  },
  maxHeightClass:{
    maxHeight:300
  },
  flexGrid:{
    flex: 1,
    flexDirection: 'row'
  },
  TextCustom:{
    width:'100%',
    textAlign:'center'
  },
  listTripSize:{
    fontSize:15
  },

  mediumFontSize:{
    fontSize:14,
    width:"50%"
  },

  superMediumFontSize:{
    fontSize:13,
    width:"50%",
    fontStyle:"italic"
  },

  detailTripFontSize:{
    fontSize:11,
    width:"50%"
  },

  classHeaderDetail:{
    fontSize:20,
    backgroundColor:"#008C45",
    color:"white",
    width:"100%",
    textAlign:"center"
  },

  classBodyInfo:{
    fontSize:15,
    color:"#878787",
    width:"50%",
    paddingTop:7,
    paddingLeft:10,
    marginRight:10,
    borderTopWidth:1,
    borderLeftWidth:1,
    borderRightWidth:1,
    borderColor:"#ddd"
  },

  classBodyData:{
    fontSize:14,
    color:"black",
    width:"50%",
    paddingBottom:7,
    paddingLeft:10,
    marginRight:10,
    borderBottomWidth:1,
    borderLeftWidth:1,
    borderRightWidth:1,
    borderColor:"#ddd"
  },

  viewDetailTrip:{
    flexDirection:"row",
    marginLeft:10,
    marginRight:10
  },
  lottie: {
    width: 100,
    height: 100
  },

  borderStyle:{
    borderRadius:10,
    borderWidth: 0.5,
    borderColor: '#eee'
  },

  viewMarginBottom:{
    marginBottom:15
  },
  dashboardViewStyle:{
    flex: 1, 
    flexDirection: "row", 
    backgroundColor: '#fafafa', 
    margin:10, 
    borderRadius:10, 
    height: 70, 
    shadowColor: "#000",
    shadowOffset: {
	    width: 0,
	    height: 9,
},
  shadowOpacity: 0.48,
  shadowRadius: 11.95,

  elevation: 5, 
  zIndex: 0 
  },

  dashboardViewStyleLeft: {
    flex: 1, 
    flexDirection: 'row'
  },
  dashboardViewStyleLeftIcon:{
    alignItems: 'center', 
    alignSelf: 'center', 
    marginLeft: 15
  },
  dashboardViewStyleLeftText: {
    alignItems: 'center', 
    alignSelf: 'center', 
    marginLeft: 10
  },
  dashboardViewStyleRight: {
    flex: 1, 
    alignItems: 'center', 
    alignSelf: 'center'
  },
  pieChartViewStyle: {
    backgroundColor: '#fafafa', 
    margin:10, 
    borderRadius:10, 
    height: 175, 
    shadowColor: "#000",
    shadowOffset: {
	    width: 0,
	    height: 9,
},
  shadowOpacity: 0.48,
  shadowRadius: 11.95,

  elevation: 5, 
  zIndex: 0
  },

  headerViewStyleKiri:{
    width:'28%',
    // flex: 1, 
    flexDirection: "row", 
    backgroundColor: '#fafafa', 
    margin:10, 
    borderRadius:10,
    //borderWidth: 1.5,
    //borderColor: '#00997A',
    height: 50, 
    shadowColor: "#000",
    shadowOffset: {
	    width: 0,
	    height: 9,
},
  shadowOpacity: 0.48,
  shadowRadius: 11.95,

elevation: 5, 
zIndex: 0
  },


  headerViewStyleKanan:{
    // backgroundColor: "#fff", ini bikin kealingan atau kalo input yg nambrak dgn backdrop akan berantakan
    //hapus flex utk pakai width
    // alignItems: "center",
    // justifyContent: "center",
    // alignSelf:'stretch',
    // alignItems: 'stretch',
    width: '60%',
    // flex: 1,
    flexDirection: 'row',
    margin:10, 
    borderRadius:10,
    height: 50,
    // borderWidth: 2,
    // borderColor: 'black'
//     shadowColor: "#000",
//     shadowOffset: {
// 	    width: 0,
// 	    height: 9,
// },
//   shadowOpacity: 0.48,
//   shadowRadius: 11.95,

// elevation: 5, 
// zIndex: 20
  },

  headerViewStyleGradientDate:{
    // width:'100%',
    // flex: 1, 
    // flexDirection: "row",
    borderRadius: 10,
    height: 50,
    // alignSelf: 'center',
    // alignItems: 'center',
    // backgroundColor: '#00997A', //buat acuan adjus padding aja
    backgroundColor: 'white',
    // padding: 20,
    // paddingLeft: 50,
    // paddingRight: 50,
    width: 220,
    borderWidth: 2,
    borderColor: '#00997A',
    justifyContent: 'center'
  },

  headerViewStyleKiri2:{
    // width:'40%',
    flex: 1, 
    flexDirection: "row", 
    backgroundColor: '#fafafa', 
    margin:10, 
    borderRadius:10,
    //borderWidth: 1.5,
    //borderColor: '#00997A',
    height: 50, 
    shadowColor: "#000",
    shadowOffset: {
	    width: 0,
	    height: 9,
},
  shadowOpacity: 0.48,
  shadowRadius: 11.95,

elevation: 5, 
zIndex: 0
  },

  headerViewStyleGradient:{
    width:'28%',
    flex: 1, 
    flexDirection: "row",
    borderRadius: 10,
    height: 50,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#00997A'
  },

  

  textButtonHeader:{
    width:'100%',
    textAlign:'center',
    //color: '#00997A', warna pastel
    //color: '#7d8d8c', //warna abu"
    //color: 'white',
    // color: '#ADACB5',
    color: '#fafafa', 
    fontSize: 14,
    fontWeight: 'bold'
  },
  lineStyleNew:{
    borderWidth: 1,
    borderColor:'#7d8d8c'
},



  dashboardViewStyle2:{
    flex: 1,
    flexDirection: "row", 
    backgroundColor: '#fafafa', 
    margin:10, 
    borderRadius:10, 
    height: 70,
    width: '50%', 
    shadowColor: "#000",


    shadowOffset: {
      width: 0,
      height: 9,
  },
  shadowOpacity: 0.48,
  shadowRadius: 11.95,

  elevation: 5, 
  zIndex: 0
  },

  dashboardViewStyle2Hidden:{
    flex:1,
    flexDirection: 'row',
    width: '50%',
    height: 70,
    margin: 10
  },

  dashboardViewStyleLeft2: {
    flex: 1, 
    flexDirection: 'row'
  },
  dashboardViewStyleLeftIcon2:{
    alignItems: 'center', 
    alignSelf: 'center', 
    marginLeft: 15
  },
  dashboardViewStyleLeftText2: {
    alignItems: 'center', 
    alignSelf: 'center', 
    marginLeft: 10,
    textAlign: 'center',
    justifyContent: 'center'
  },
  dashboardViewStyleRight2: {
    flex: 1, 
    alignItems: 'center', 
    alignSelf: 'center'
  },

  textDashboard:{
    fontSize: 12,
    textAlign: 'center',
    color: '#7d8d8c'
  },

  textDashboardNumber:{
    fontSize: 16,
    textAlign: 'center',
    color: '#7d8d8c',
    fontWeight: 'bold'
  },




  
  mtdViewStyleKiri:{
    // flex: 1, //Kalo dikasih flex, jadi nya ke grid dibagi 2, gabisa pake width %
    backgroundColor: '#fafafa', 
    margin:10, 
    borderRadius:10, 
    height: 150,
    width: '30%', 
    shadowColor: "#000",
    alignItems:'center', 
    alignSelf: 'center', 
    justifyContent: 'center',

    shadowOffset: {
      width: 0,
      height: 9,
  },
  shadowOpacity: 0.48,
  shadowRadius: 11.95,

  elevation: 5, 
  zIndex: 0
  },

  mtdViewStyleKanan:{
    flex: 1,
    backgroundColor: '#fafafa', 
    margin:10, 
    borderRadius:10, 
    height: 150,
    width: '70%', 
    shadowColor: "#000",


    shadowOffset: {
      width: 0,
      height: 9,
  },
  shadowOpacity: 0.48,
  shadowRadius: 11.95,

  elevation: 5, 
  zIndex: 0
  },

  mtdViewStyleKananPosition:{
    flex: 2, 
    flexDirection: 'row', 
    marginLeft: 10, 
    marginBottom:0,
    marginTop: 5
  },

  mtdViewStyleKananText:{
    fontSize: 12, 
    color: '#7d8d8c'
  },

  mtdViewStyleKananNumber:{
    fontSize: 12, 
    textAlign: 'right', 
    color: '#7d8d8c'
  },
  mtdViewStyleKananProgressBar:{
    margin: 10, 
    marginBottom: 5, 
    marginTop: -10
  },



  circleViewStyle:{
    flex: 1,
    backgroundColor: '#fafafa', 
    margin: 10, 
    borderRadius:10, 
    height: 110,
    width: '50%', 
    shadowColor: "#000",
    alignItems:'center', 
    alignSelf: 'center', 
    justifyContent: 'center',

    shadowOffset: {
    width: 0,
    height: 9,
  },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,

    elevation: 5, 
    zIndex: 0
  },

  textStyleCircle:{
    textAlign: 'center', 
    margin: 10, 
    marginBottom: 20, 
    marginTop: 5, 
    fontSize: 12, 
    color: '#7d8d8c'
  }



});

export default styles;
