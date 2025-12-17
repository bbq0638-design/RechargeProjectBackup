import React from 'react';
import {View, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';

function LoadingAnimation({size = 120, style}) {
  return (
    <View style={[styles.container, style]}>
      <LottieView
        source={require('../../assets/animations/ElectricityLoading.json')}
        autoPlay
        loop
        style={{width: size, height: size}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingAnimation;
