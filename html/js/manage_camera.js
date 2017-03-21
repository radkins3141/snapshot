var ManageCamera = (function () {
  var videoLabels = [];
  var getCookie = function(name) {
      var cleanCookie = decodeURIComponent(document.cookie),
          nibbles = cleanCookie.split(';');
      for(var i = 0; i <nibbles.length; i++) {
          var crumbs = nibbles[i].split('=');
          if (crumbs[0].trim() == name) { return crumbs[1].trim(); }
      }
      return "";
  };
  var format_date = function() {
    var m = new Date();
    return m.getUTCFullYear() + "_" +
        ("0" + (m.getUTCMonth()+1)).slice(-2) + "_" +
        ("0" + m.getUTCDate()).slice(-2) + "_" +
        ("0" + m.getUTCHours()).slice(-2) + ":" +
        ("0" + m.getUTCMinutes()).slice(-2) + ":" +
        ("0" + m.getUTCSeconds()).slice(-2);
  };
  return {
    genCameraSelector: function(videoSources) {
      console.log("----> genCameraSelector");
      console.log("----> in genCameraSelector, videoSources: "+videoSources);
      var cameraSelector = document.getElementById("camera_selector");
      videoSources.forEach(function(device) {
        videoLabels.push("<option value='" + device.id + "'>"+(device.label || "camera" + (videoLabels.length + 1)) + "</option>");
      });
      cameraSelector.innerHTML = videoLabels.join("\n");
    },
    getVideoSources: function(cb) {
      console.log("----> getVideoSources");
      var videoSources = [];
      var enumerateCams;
      if (typeof(navigator.mediaDevices) == "object" && typeof(navigator.mediaDevices.enumerateDevices) == "function") {
        // fetch new-style promise
        enumerateCams = navigator.mediaDevices.enumerateDevices.call(navigator.mediaDevices);
      } else if (typeof(MediaStreamTrack) == "function") {
        // encapsulate old-style API in new-style promise
        enumerateCams = new Promise(function(resolve, reject) {
          MediaStreamTrack.getSources(function(devices) {
            resolve(devices);
        })});
      } else {
        throw "Cannot find media device enumerator";
      }
      enumerateCams.then(function(devices) {
        devices.forEach(function(d){
          console.log(d)
          if (d.kind.match(/^video/)) {
            videoSources.push({id: (d.deviceId || d.id), label: d.label || "camera" + (videoSources.length + 1)});
          }
        })
        cb(videoSources);
      });
    },
    attachCamera: function(id) {
      console.log("----> attachCamera, id: "+id);
      Webcam.reset();
      var wh = {h: 240, w: 320}
      Webcam.set({
        width: wh['w'],
        height: wh['h'],
        dest_width: wh['w'],
        dest_height: wh['h'],
        image_format: 'jpeg',
        jpeg_quality: 90,
        constraints: {mandatory: {maxWidth: wh['w'], maxHeight: wh['h']}, optional: [{sourceId: id}]}
      });
      Webcam.attach('#live_camera');
    },
    takeSnapshot: function() {
      console.log("----> takeSnapshot");
      var upload_name = "phonecam_"+format_date();
      Webcam.set("upload_name", upload_name);
      Webcam.snap(function(data_uri) {
        document.getElementById('results').innerHTML = 
          '<h2>Your image: '+upload_name+'</h2>' + 
          '<img src="'+data_uri+'"/>';
        Webcam.upload(data_uri, '/upload', function(code, text) {
          upload_response = "code: " + code + ", text: " + text;
          document.getElementById('upload_response').innerHTML = upload_response; 
        });
      });
    },
    manageSettings: {
      initSnapshotInterval: function() {
        console.log("----> manageSettings.initSnapshotInterval");
        var cookie = getCookie("snapshot_interval");
        if (cookie == "") {
          cookie = "3600";
          document.cookie = "snapshot_interval="+cookie+"; path=/";
        }
        var interval_element = document.getElementById("snapshot_interval");
        interval_element.value = cookie;
      },
      setSnapshotInterval: function() {
        console.log("----> manageSettings.setSnapshotInterval");
        var interval_element = document.getElementById("snapshot_interval");
        var isnapshot_interval = parseInt(interval_element.value, 10); // ensure its a number
        document.cookie = "snapshot_interval="+isnapshot_interval+"; path=/";
      },
      getSnapshotInterval: function() {
        console.log("----> manageSettings.getSnapshotInterval");
        var cookie = getCookie("snapshot_interval");
        var isnapshot_interval = parseInt(cookie, 10);
        return isnapshot_interval;
      },
      initSnapshotDebugMode: function() {
        console.log("----> manageSettings.initSnapshotDebugMode");
        var cookie = getCookie("snapshot_debug_mode");
        var debug_mode_element = document.getElementById("snapshot_debug_mode");
        debug_mode_element.checked = cookie == "true";
      },
      setSnapshotDebugMode: function(debug_mode_element) {
        console.log("----> manageSettings.setSnapshotDebugMode");
        document.cookie = "snapshot_debug_mode="+debug_mode_element.checked+"; path=/";
      },
      getSnapshotDebugMode: function() {
        console.log("----> manageSettings.getSnapshotDebugMode");
        var cookie = getCookie("snapshot_debug_mode");
        return cookie == "true";
      },
      initSettings: function() {
        console.log("----> manageSettings.initSettings");
        ManageCamera.manageSettings.initSnapshotInterval();
        ManageCamera.manageSettings.initSnapshotDebugMode();
      },
      clearSettings: function() {
        console.log("----> manageSettings.clearSettings");
        document.cookie = "snapshot_interval=; path=/";
        document.cookie = "snapshot_debug_mode=; path=/";
      },
      activateDebugMode: function(chkbx) {
        console.log("----> manageSettings.activateDebugMode");
        var take_snapshot_form = document.getElementById("take_snapshot_form"),
            results = document.getElementById("results"),
            live_camera = document.getElementById("live_camera");
        var display_state = chkbx.checked ? "display:block" : "display:none";
        take_snapshot_form.style = display_state;
        results.style = display_state;
        live_camera.style = display_state;
        ManageCamera.manageSettings.setSnapshotDebugMode(chkbx);
      }
    }
  }
})();

