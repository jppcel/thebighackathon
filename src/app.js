(function(){
  var video = document.querySelector('video')
  var canvas = document.querySelector('canvas')
  var ctx = canvas.getContext('2d')
  var image = document.querySelector('img')
  var width = 1280, height = 720

  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);

  var takeImage = function(){
    ctx.drawImage(video, 0, 0, width, height);
    image.src = canvas.toDataURL('image/png');
    // console.log("Tirou foto", canvas.toDataURL('image/jpg'));
    sendImage(canvas.toDataURL('image/jpeg'))
  }

  var sendImage = function(image){

    $.ajax({
      type: "POST",
      url: 'https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize',
      data: JSON.stringify({"url": "http://www.marcandangel.com/images/9-not-need-happy.jpg"}),
      success: function(result){
        console.log("Deu certo", result[0].scores);
      },
      headers: {
        'Ocp-Apim-Subscription-Key': '8a6b4adcde9f4bae98be707d36d14bc2',
        'Content-Type': 'application/json'

      }
    });

  }

  navigator
    .mediaDevices
    .getUserMedia({video:  { width: width, height: height}, audio: false})
    .then(function(localMediaStream) {
      video.src = window.URL.createObjectURL(localMediaStream);
      setInterval(function(){
        takeImage();
      }, 10000);
    })
    .catch(function(error){
      console.log("Error: ", error)
    });

})()
;
