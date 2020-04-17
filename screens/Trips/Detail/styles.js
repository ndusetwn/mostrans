import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
  	flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    backgroundColor: 'white',
    padding: 22,
    borderRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  }, 
  cardPadding:{
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 0,
    paddingBottom: 0
  }, 
  cardPaddingHeader:{
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10
  }
});

export default styles;