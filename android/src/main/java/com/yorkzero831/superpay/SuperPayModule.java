package com.yorkzero831.superpay;

import androidx.annotation.NonNull;

import com.alipay.sdk.app.PayTask;
import com.alipay.sdk.app.EnvUtils;
import com.facebook.react.bridge.*;
import com.facebook.react.module.annotations.ReactModule;
import com.tencent.mm.opensdk.modelpay.PayReq;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import java.util.Map;
import java.util.Objects;

@ReactModule(name = SuperPayModule.NAME)
public class SuperPayModule extends ReactContextBaseJavaModule {
  public static final String NAME = "SuperPay";
  public static String WX_APPID = "";


  public SuperPayModule(ReactApplicationContext reactContext) {

    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }


  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  public void multiply(double a, double b, Promise promise) {
    promise.resolve(a * b);
  }

  @ReactMethod
  public void setAlipaySandbox(Boolean isSandbox) {
    if(isSandbox){
      EnvUtils.setEnv(EnvUtils.EnvEnum.SANDBOX);
    }else {
      EnvUtils.setEnv(EnvUtils.EnvEnum.ONLINE);
    }
  }

  @ReactMethod
  public void alipay(final String orderInfo, final Callback promise) {
    Runnable payRunnable = new Runnable() {
      @Override
      public void run() {
        PayTask alipay = new PayTask(getCurrentActivity());
        Map<String, String> result = alipay.payV2(orderInfo, true);
        WritableMap map = Arguments.createMap();
        map.putString("memo", result.get("memo"));
        map.putString("result", result.get("result"));
        map.putString("resultStatus", result.get("resultStatus"));
        promise.invoke(map);
      }
    };
    // 必须异步调用
    Thread payThread = new Thread(payRunnable);
    payThread.start();
  }

  @ReactMethod
  public void setWxId(String id, String universalLink) {
    WX_APPID = id;
  }

  @ReactMethod
  public void wxPay(ReadableMap params, final Callback callback) {
    IWXAPI api = WXAPIFactory.createWXAPI(Objects.requireNonNull(getCurrentActivity()), WX_APPID);
    //data  根据服务器返回的json数据创建的实体类对象
    PayReq req = new PayReq();
    req.appId = WX_APPID;
    req.partnerId = params.getString("partnerId");
    req.prepayId = params.getString("prepayId");
    req.packageValue = params.getString("packageValue");
    req.nonceStr = params.getString("nonceStr");
    req.timeStamp = params.getString("timeStamp");
    req.sign = params.getString("sign");
    api.registerApp(WX_APPID);
    XWXPayEntryActivity.callback = new WXPayCallBack() {
      @Override
      public void callBack(WritableMap result) {
        callback.invoke(result);
      }
    };
    //发起请求
    api.sendReq(req);
  }
}
