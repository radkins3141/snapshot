ManageCamera.getVideoSources(function(videoSources){
  var manageSettings =  ManageCamera.manageSettings;
  var videoSource = videoSources[0];
  var wh = {h: 240, w: 320}
  var constraints = videoSource ?  {mandatory: {maxWidth: wh['w'], maxHeight: wh['h']}, optional: [{sourceId: videoSource.id}]} : {mandatory: {maxWidth: wh['w'], maxHeight: wh['h']}}
  Webcam.set({
    width: wh['w'],
    height: wh['h'],
    dest_width: wh['w'],
    dest_height: wh['h'],
    image_format: 'jpeg',
    jpeg_quality: 90,
    constraints: constraints
  });
  Webcam.attach('#live_camera');
  ManageCamera.genCameraSelector(videoSources);
  manageSettings.initSettings();
  var interval = manageSettings.getSnapshotInterval() * 1000;
  setInterval(ManageCamera.takeSnapshot, interval);
  var debugMode = manageSettings.getSnapshotDebugMode();
  debugMode && manageSettings.activateDebugMode({checked: true});
});
