
var pseudo = /*localStorage.pseudo ||*/prompt('Quel est votre pseudo ?');
var ar = new Array();
var mine = 2;
var gi = 0 ;
var gj = 0;
var pi=0;
var pj=0;
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
		mine = 2;
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
				$('#line_' + i).append('<div class = "tile" id = "tile_' + i + '_' + j + '" onclick = "if (verif_mouv(' + i + ', ' + j + ')){echecs(' + i + ', ' + j + ');promotion(' + i + ', ' + j + ');deselectTile(' + i + ', ' + j + ');}else{deselectTile(' + i + ', ' + j + ');selectTile(' + i + ', ' + j + ');}"></div>');
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
	if (grid[j-1][i-1]!=false) {
		ar = select(j-1,i-1);
		console.log(ar);
		gi = i;
		gj = j;
		for (var l = 0; l < ar.length; l++) {
			var x = ar[l][0];
			var y = ar[l][1];
			var dx = ar[l][2];
			var dy = ar[l][3];
			var a = x+dx+1;
			var b = y+dy+1;
			document.getElementById("tile_" + b + '_' + a ).style.backgroundColor = "#ede60099";
		}
	}
	else {
		console.log(i,j);
	}
}

function deselectTile(i,j) {
	for (var l = 0; l < ar.length; l++) {
		var x = ar[l][0];
		var y = ar[l][1];
		var dx = ar[l][2];
		var dy = ar[l][3];
		var a = x+dx+1;
		var b = y+dy+1;
		document.getElementById("tile_" + b + '_' + a ).style.backgroundColor = "#fff0";
	}
}

function verif_mouv(i,j) {
	if (document.getElementById("tile_" + i + '_' + j ).style.backgroundColor=="rgba(237, 230, 0, 0.6)") {
		move(gj-1,gi-1,j-gj,i-gi);
		return true;
	}
	return false;
}

function echecs(i,j){
	var ar = select(j-1,i-1);
	for (var l = 0; l < ar.length; l++) {
		var x = ar[l][0];
		var y = ar[l][1];
		var dx = ar[l][2];
		var dy = ar[l][3];
		var a = x+dx+1;
		var b = y+dy+1;
		console.log(b,a);
		if (grid[a-1][b-1].type == 'roi' && grid[j-1][i-1].type != 'pion' && grid[a-1][b-1].player == 1){
			alert('Vous êtes en échec'); // Le faire afficher sur le bon joueur
		}
	}
}

function promotion(i,j){ //Pour faire une promotion de pion si un pion touche la ligne de 0 ou 7
	if (j==8 && grid[j-1][i-1].type == 'pion') {
		document.getElementById('promotion').style.visibility = 'visible';
		pi=i;
		pj=j;
	}
	if(j==1 && grid[j-1][i-1].type == 'pion'){
		document.getElementById('promotion').style.visibility = 'visible';
		pi=i;
		pj=j;
	}
}

function achanger_tour(){
	document.getElementById('promotion').style.visibility = 'hidden';
	grid[pj-1][pi-1] = {type : "tour", player:2};
	undraw((pi-1)*40,(pj-1)*40);
    draw((pi)*40,(pj)*40,'Images/pions/tour_2.png');
}

function achanger_fou(){
	document.getElementById('promotion').style.visibility = 'hidden';
	grid[pj-1][pi-1] = {type : "fou", player:2};
	undraw((pi-1)*40,(pj-1)*40);
    draw((pi)*40,(pj)*40,'Images/pions/fou_2.png');
}

function achanger_cheval(){
	document.getElementById('promotion').style.visibility = 'hidden';
	grid[pj-1][pi-1] = {type : "cheval", player:2};
	undraw((pi-1)*40,(pj-1)*40);
    draw((pi)*40,(pj)*40,'Images/pions/cheval_2.png');
}

function achanger_reine(){
	document.getElementById('promotion').style.visibility = 'hidden';
	grid[pj-1][pi-1] = {type : "reine", player:2};
	undraw((pi-1)*40,(pj-1)*40);
    draw((pi)*40,(pj)*40,'Images/pions/reine_2.png');
}