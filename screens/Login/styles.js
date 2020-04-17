import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container : {
    backgroundColor:'#F8F8F8',
    flex: 1,
    alignItems:'center',
    justifyContent :'center',
    paddingHorizontal: 10
  },

  loginForm : {
    // flexGrow: 4,
    justifyContent:'center',
    alignItems: 'center',
  },
  inputBox: {
    width:300,
    backgroundColor:'rgba(255, 255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal:16,
    fontSize:16,
    color:'#ffffff',
    marginVertical: 10
  },
  button: {
    width:'100%',
    backgroundColor:'#008D45',
     borderRadius: 10,
      marginVertical: 10,
      paddingVertical: 10,
      paddingHorizontal: 70
  },
  buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'#ffffff',
    textAlign:'center'
  },
  signTitle: {
    color: '#1e2427',
    fontFamily: 'Gadugi',
    fontSize: 21,
    fontWeight: 'bold',
    textAlign:'center'
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0
  },
  ImageStyle: {
    alignItems: 'center',
    height: 20,
    width: 20,
    resizeMode: 'contain'
  },
  red:{
    backgroundColor: 'red'
  },
  row:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center'
  },
  text:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textbox:{
    flex: 2,
    borderBottomWidth: 1,
    borderBottomColor: 'black'
  },
  modalcontainer:{
    backgroundColor: '#fff',
    paddingVertical: 20,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    borderColor: '#008c45',
    borderWidth: 1,
    borderRadius: 5
  }
});

export default styles;
