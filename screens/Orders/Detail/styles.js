import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    alignSelf: 'auto',
    alignContent: 'center',
    justifyContent: 'center',
    margin: 10
  },
  leftRightContainer: {
    alignSelf: 'auto',
    alignContent: 'center',
    justifyContent: 'center'
  },
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  paragraphLeft: {
    fontSize: 14,
    textAlign: 'left'
  },
  paragraphCenter: {
    fontSize: 14,
    textAlign: 'center'
  },
  paragraphRight: {
    fontSize: 14,
    textAlign: 'right'
  },
  list: {
    flex: 1,
    marginTop:20
  }
});

export default styles;
