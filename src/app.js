(function(){
  var video = document.querySelector('video')
  var canvas = document.querySelector('canvas')
  var ctx = canvas.getContext('2d')
  var image = document.querySelector('img')
  var width = 1280, height = 720

  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);

  var takePhoto = function(){
    ctx.drawImage(video, 0, 0, width, height);
    image.src = canvas.toDataURL('image/png');
  }

  navigator
    .mediaDevices
    .getUserMedia({video:  { width: width, height: height}, audio: false})
    .then(function(localMediaStream) {
      video.src = window.URL.createObjectURL(localMediaStream);
      setInterval(function(){
        takePhoto();
      }, 10000);
    })
    .catch(function(error){
      console.log("Error: ", error)
    });

})()
