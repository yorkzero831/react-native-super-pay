import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { multiply } from 'react-native-super-pay';
import SuperPayStatic from 'react-native-super-pay'

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();

  React.useEffect(() => {
    multiply(3, 7).then((e) => {
      setResult(e);
      console.log('RESULT:', e)
      SuperPayStatic.setAlipayScheme('bbbb')
      SuperPayStatic.setWxId('a', 'aaaa')
      SuperPayStatic.wxPay({}, (e) => {console.log('aaaaaaa', e)})
      console.log('SuperPayStatic.setWxId called')
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
