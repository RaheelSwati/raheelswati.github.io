(function(){
  "use strict";
  function googleExit(){
    if(window.ExitApi&&typeof window.ExitApi.exit==="function"){window.ExitApi.exit();return true;}
    if(window.google&&typeof window.google.exit==="function"){window.google.exit();return true;}
    return false;
  }
  function tiktokExit(){
    var sdk=window.TikTokPlayableSDK||window.PlayableSDK;
    if(sdk&&typeof sdk.openAppStore==="function"){sdk.openAppStore();return true;}
    if(sdk&&typeof sdk.openStore==="function"){sdk.openStore();return true;}
    return false;
  }
  window.PlayableNetwork={
    install:function(){
      var cfg=window.PLAYABLE_CONFIG||{};
      var handled=cfg.network==="tiktok"?tiktokExit():googleExit();
      if(!handled&&cfg.storeUrl&&cfg.storeUrl.indexOf("__")!==0){window.open(cfg.storeUrl,"_blank","noopener");}
    },
    track:function(name){
      window.parent&&window.parent!==window&&window.parent.postMessage({type:"coastal-golf-playable",event:name},"*");
    }
  };
})();
