var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname+'/public'));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.get('/', function(req,res){
  res.sendFile(__dirname+'/index.html');
});
app.get('/painel/', function(req,res){
  res.sendFile(__dirname+'/painel/index.html');
});
app.get('/painel/alunos', function(req,res){
  res.sendFile(__dirname+'/painel/alunos.html');
});
app.get('/painel/alunos/view/1', function(req,res){
  res.sendFile(__dirname+'/painel/historicoAluno.html');
});
