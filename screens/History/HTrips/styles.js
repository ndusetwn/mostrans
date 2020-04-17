import { StyleSheet } from 'react-native';

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
  buttonFilter:{
    alignSelf: 'flex-end',
    borderRadius: 20,
    margin: 10
  }
});

export default styles;
