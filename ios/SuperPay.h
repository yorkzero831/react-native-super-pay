
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNSuperPaySpec.h"

@interface SuperPay : NSObject <NativeSuperPaySpec>
#else
#import <React/RCTBridgeModule.h>
#import "WXApi.h"
@interface SuperPay : NSObject <RCTBridgeModule,WXApiDelegate>
#endif

@end
