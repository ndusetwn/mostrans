import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container:{
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      backgroundColor: '#D1EDF111'
    },
    logo:{
      height: 200,
      width: 200
    },
    background:{
      backgroundColor: 'red',
      position: 'absolute',
      bottom: 0,
      height: 200,
      flexDirection: 'row'
    },
    spinner:{
      marginTop: -50
    },
  });
  
export default styles;