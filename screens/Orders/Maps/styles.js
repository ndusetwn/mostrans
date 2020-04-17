import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  members: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 10
  },
  member: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 20,
    height: 30,
    marginTop: 10,
  },
  memberName: {
    marginHorizontal: 10,
    fontSize: 14
  },
  avatar: {
    height: 30,
    width: 30,
    borderRadius: 15,
  }
});

export default styles;
