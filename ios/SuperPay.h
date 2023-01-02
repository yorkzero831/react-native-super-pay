
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNSuperPaySpec.h"

@interface SuperPay : NSObject <NativeSuperPaySpec>
#else
#import <React/RCTBridgeModule.h>

@interface SuperPay : NSObject <RCTBridgeModule>
#endif

@end
