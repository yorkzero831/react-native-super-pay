import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-super-pay' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const SuperPay = NativeModules.SuperPay
  ? NativeModules.SuperPay
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function multiply(a: number, b: number): Promise<number> {
  return SuperPay.multiply(a, b);
}

export default class SuperPayStatic {
  /**
   * 支付宝Android端支付
   * @param orderInfo   订单号
   * @param callback    支付宝回调结果  详情见 https://docs.open.alipay.com/204/105301
   */
  static alipay(orderInfo: string, callback: (res: any) => void) {
    NativeModules.SuperPay.alipay(orderInfo, callback);
  }

  /**
   * 设置微信APPID
   * @param id
   * @param universalLink
   */
  static setWxId(id: string, universalLink: string) {
    NativeModules.SuperPay.setWxId(id, universalLink);
  }

  /**
   * 设置支付宝跳转Scheme
   * @param scheme
   */
  static setAlipayScheme(scheme: string) {
    if (Platform.OS === 'ios') NativeModules.SuperPay.setAlipayScheme(scheme);
  }

  /**
   * 设置支付宝沙箱环境，仅Android
   * @param isSandBox
   */
  static setAlipaySandbox(isSandBox: boolean) {
    if (Platform.OS === 'android')
      NativeModules.SuperPay.setAlipaySandbox(isSandBox);
  }

  /**
   * 微信支付
   * 传入参数示例
   * {
      partnerId:data.partnerId,
      prepayId: data.prepayId,
      packageValue: data.data.packageValue,
      nonceStr: data.data.nonceStr,
      timeStamp: data.data.timeStamp,
      sign: data.data.sign,
     }
   *
   *
   * @param params  参数
   * @param callBack 回调结果码 0:支付成功,
   *                          -1:原因：支付错误,可能的原因：签名错误、未注册APPID、项目设置APPID不正确、注册的APPID与设置的不匹配、其他异常等
   *                          -2: 原因 用户取消,无需处理。发生场景：用户不支付了，点击取消，返回APP
   */
  static wxPay(params: object, callBack: (res: any) => void) {
    NativeModules.SuperPay.wxPay(params, callBack);
  }
}
