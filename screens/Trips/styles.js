import { StyleSheet, Platform } from 'react-native';

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
  header : {
    marginLeft: -5,
    marginTop: 5,
    marginBottom: (Platform.OS==='ios') ? -7 : 0,
    lineHeight: 24,
    color: '#5357b6'
},
modalImage: {
    resizeMode: 'contain',
    height: 200
},
bold: {
    fontWeight: '600'
},
negativeMargin: {
    marginBottom: -10
}
});

export default styles;