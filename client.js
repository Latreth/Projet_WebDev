
var pseudo = /*localStorage.pseudo ||*/prompt('Quel est votre pseudo ?');
localStorage.pseudo = pseudo;
document.title = pseudo + ' - ' + document.title;

// Connexion au serveur
const IP = "207.154.242.88";
var ws = new WebSocket('ws://' + IP + ':80');

var clientID = "";
var playerID;
var roomID = 1;
ws.onmessage = (msg) => {
	let data = JSON.parse(msg.data);
	data = JSON.parse(data.msg);
	console.log(data);
	if(data.type == "_id"){
		clientID = data.clientID;
		sendCmd(JSON.stringify({type: "nouveau_joueur", pseudo: pseudo, room: roomID}));
	}
	else if(data.type == "chat_message"){
		insereMessage(data.pseudo, data.message);
	}
	else if(data.type == "nouveau_joueur"){
		$('#zone_chat').append('<p><em>' + data.pseudo + ' a rejoint la partie</em></p>');
	}
	else if(data.type == "sortie_joueur"){
		$('#zone_chat').append('<p><em>' + data.pseudo + ' a quitté la partie</em></p>');
	}
	else if(data.type == "autorisation"){
		playerID = data.player;
		console.log('ID du joueur : ' + playerID);
		for(let i = 1; i <= 8; ++i){
			$('#tiles').append('<div id = "line_' + i + '"></div>');
			for(let j = 1; j <= 8; ++j){
				$('#line_' + i).append('<div class = "tile" id = "tile_' + i + '_' + j + '" onclick = "selectTile(' + i + ', ' + j + ');"></div>');
			}
		}
	}
}

function sendCmd(str){
	str = clientID + " " + str;
	let pack = {};
	pack.cmd = str;
	let data = JSON.stringify(pack);
	ws.send(data);
}

// Lorsqu'on envoie le formulaire, on transmet le message et on l'affiche sur la page
$('#formulaire_chat').submit(function() {
	var message = $('#message').val();
	sendCmd(JSON.stringify({type: "chat_message", pseudo: pseudo, message: message, room: roomID})); // Transmet le message aux autres
	$('#message').val('').focus(); // Vide la zone de Chat et remet le focus dessus
	return false; // Permet de bloquer l'envoi "classique" du formulaire
});
// Ajoute un message dans la page
function insereMessage(pseudo, message) {
	$('#zone_chat').append('<p><strong>' + pseudo + '</strong> ' + message + '</p>');
}

window.addEventListener('beforeunload', () => {
	sendCmd(JSON.stringify({type: "sortie_joueur", pseudo: pseudo, room: roomID}));
});

function selectTile(i, j){
	console.log(select(j-1, i-1));
}