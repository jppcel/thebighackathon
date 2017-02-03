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

  var makeblob = function (dataURL) {
      var BASE64_MARKER = ';base64,';
      if (dataURL.indexOf(BASE64_MARKER) == -1) {
          var parts = dataURL.split(',');
          var contentType = parts[0].split(':')[1];
          var raw = decodeURIComponent(parts[1]);
          return new Blob([raw], { type: contentType });
      }
      var parts = dataURL.split(BASE64_MARKER);
      var contentType = parts[0].split(':')[1];
      var raw = window.atob(parts[1]);
      var rawLength = raw.length;

      var uInt8Array = new Uint8Array(rawLength);

      for (var i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
      }

      return new Blob([uInt8Array], { type: contentType });
  }

  var sendImage = function(image){
    var imageOctet = makeblob(image);
    $.ajax({
      type: "POST",
      processData: false,
      url: 'https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize',
      // data: JSON.stringify({"url": "http://www.marcandangel.com/images/9-not-need-happy.jpg"}),
      data: imageOctet,
      success: function(result){
        saveDb(result);
      },
      headers: {
        'Ocp-Apim-Subscription-Key': '8a6b4adcde9f4bae98be707d36d14bc2',
        'Content-Type': 'application/octet-stream'

      }
    });

  }


  var saveDb = function(alunos){
    alunos = alunos.reduce(function(current, aluno, index){
        current.push({
          aluno: 'ID'+ index,
          data: new Date(),
          anger: aluno.scores.anger,
          contempt: aluno.scores.contempt,
          disgust: aluno.scores.disgust,
          fear: aluno.scores.fear,
          happiness: aluno.scores.happiness,
          neutral: aluno.scores.neutral,
          sadness: aluno.scores.sadness,
          surprise: aluno.scores.surprise,
        })
        return current;
    }, [])

    console.log(alunos);

    $.ajax({
      type: "POST",
      url: 'https://api.mlab.com/api/1/databases/thebighackathon/collections/alunos?apiKey=iXLuxajzftf_48QqNCa1j-EA6ywBBfMc',
      data: JSON.stringify(alunos),
      success: function(result){
        console.log("Deu certo", result);

      },
      headers: {
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
