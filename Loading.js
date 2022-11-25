import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

const Loading = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.viewContainer}>
        {/* <LottieView
            source={require('./97443-loading-gray.json')}
          style={styles.lottieContainer}
          autoPlay
          loop
        /> */}
        <Text style={styles.header}>분석중입니다. 잠시만 기다려 주세요.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    // backgroundColor: 'yellow',
  },
  header: {
    // backgroundColor: 'red',
    color: 'black',
    fontSize: 21,
    fontWeight: '700',
    marginTop: 30,
    marginBottom: 20,
  },
  viewContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  lottieContainer: {
    width: 70,
    // backgroundColor: '#000',
  },
});
export default Loading;
