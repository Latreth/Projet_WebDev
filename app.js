var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'); // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)

// Chargement de la page Jeu.html
app.get('/', function (req, res){
  res.sendfile(__dirname + '/Jeu.html');
});

io.on('connection', function (socket, pseudo){
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('nouveau_client', function(pseudo){
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('nouveau_client', pseudo);
    });

    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (data) {
        data = JSON.stringify(data);
        console.log(data.type + ' - ' + data.message);
        var type = data.type;
        if(type == "chat_message") socket.broadcast.emit('message', {type: "chat_message", pseudo: socket.pseudo, message: data.message});
        if(type == "action") socket.emit('message', {type: "action", pseudo: socket.pseudo, message: data.message});
    }); 
});

server.listen(8080);
