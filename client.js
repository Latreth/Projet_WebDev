
var pseudo = /*localStorage.pseudo ||*/prompt('Quel est votre pseudo ?');
var ar = new Array();
var lettre = {1:'a',2:'b',3:'c',4:'d',5:'e',6:'f',7:'g',8:'h'};
var tour = 1;
var mine = 2;
var gi = 0 ;
var gj = 0;
var blanc = 1;
var noir = 2;
var enechec = false;
var montexte = "";
var montour = true;
var afaitretour=false;
var pi=0;
var pj=0;
localStorage.pseudo = pseudo;
document.title = pseudo + ' - ' + document.title;
//var filepartie = new ActiveXObject("Scripting.FileSystemObject");
//fileSystem.CreateTextFile("mapartie.txt",true);
//var montexte2=fileSystem.OpenTextFile("mapartie.txt", 2 ,true); 

// Connexion au serveur
const IP = "207.154.242.88";
var ws = new WebSocket('ws://' + IP + ':80');

var clientID = "";
var playerID;
var ennemiID;
var roomID = 3;
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
		if (data.pseudo == "Daniel" || data.pseudo == "daniel"||data.pseudo == "Muller"||data.pseudo=="muller"){
			$('#zone_chat').append('<img src="vingt.gif"> ');
		}
		console.log(data);
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
				$('#line_' + i).append('<div class = "tile" id = "tile_' + i + '_' + j + '" onclick = "if (verif_mouv(' + i + ', ' + j + ')){echecs(' + i + ', ' + j + ');promotion(' + i + ', ' + j + ');deselectTile(' + i + ', ' + j + ');}else{deselectTile(' + i + ', ' + j + ');selectTile(' + i + ', ' + j + ');lastimage=false;}"></div>');
			}
		}
	}
	else if(data.type == "ennemi_ID"){
		ennemiID = data.cid;
	}
	else if(data.type == "promotion"){
		if (data.player != playerID){
			if (data.piece == "tour"){
				achanger_tour2(data.a,data.pj,data.pi,data.player);
			}
			if (data.piece == "reine"){
				achanger_reine2(data.a,data.pj,data.pi,data.player);
			}
			if (data.piece == "fou"){
				achanger_fou2(data.a,data.pj,data.pi,data.player);
			}
			if (data.piece == "cheval"){
				achanger_cheval2(data.a,data.pj,data.pi,data.player);
			}
		}
	}
	else if(data.type == "action"){ 
		if (data.player != playerID){
			document.getElementById('zonetext').textContent += data.texte;
			move2(data.x, data.y, data.dx, data.dy,data.player); 
			estenechecs();
			montour=true;
		}
	}
	else if (data.type == "mat") {
		montour=false;
		if (tour <=5) {
			if (data.player == playerID) {//verifier si win se mets bien sur celui qui gagne
				document.getElementById('hardwin').style.visibility = "visible";
			}
			else{
				document.getElementById('hardloose').style.visibility = 'visible';
			}
		}
		else {
			document.getElementById('end').style.visibility  = 'visible';
		}
		document.getElementById('zonetext').textContent += "mat.";
		document.getElementById('back').style.visibility = 'visible';
	}
	else if(data.type == "undoaction"){
		if(data.player != playerID){
			undowmove2(data.x,data.y,data.dx,data.dy,data.pion,data.player,data.lastimage);
			undowecriturepartie(data.elm);
		}
	}
    else if(data.type == "endgame"){
        $('#zone_chat').append('<p><em>Fin du jeu, ' + data.player + ' ayant quitté la partie</em></p>');
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
		console.log(i,j,"i et j");
		console.log(gi,gj,"gi et gj");
		if (!afaitretour){
			ar = select(j-1,i-1);
		}
		else{
			ar = select(gj-1,gi-1);
		}
		gi = i;
		gj = j;
		for (var l = 0; l < ar.length; l++) {
			var x = ar[l][0];
			var y = ar[l][1];
			var dx = ar[l][2];
			var dy = ar[l][3];
			var a = x+dx+1;
			var b = y+dy+1;
			if (a>=1&&b>=1&&a<=8&&b<=8) {
				document.getElementById("tile_" + b + '_' + a ).style.backgroundColor = "#ede60099";
			}
		}
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
		if(a>=1&&b>=1&&a<=8&&b<=8){
			document.getElementById("tile_" + b + '_' + a ).style.backgroundColor = "";
		}
	}
}


function verif_mouv(i,j) {
	var elm;
	if (montour) {
		if (document.getElementById("tile_" + i + '_' + j ).style.backgroundColor=="rgba(237, 230, 0, 0.6)"&&grid[gj-1][gi-1].type == 'roi'&&akingisnear(i-1,j-1)){//le roi se trouverai en i,j, mais il doit se trouver actuellement en gi gj
			alert('Vous ne pouvez pas avoir votre roi à côté du roi adverse !');
			return false;
		}
		if (document.getElementById("tile_" + i + '_' + j ).style.backgroundColor=="rgba(237, 230, 0, 0.6)"&&enechec==false) {
			if (grid[j-1][i-1]) {//si il y a une prise
				if (grid[gj-1][gi-1].type != 'pion') {
					document.getElementById('zonetext').textContent += " " + grid[gj-1][gi-1].type[0].toUpperCase() + "x" + lettre[i]+j;
					elm=8;
					//montexte2.Write(" " + grid[gj-1][gi-1].type[0].toUpperCase() + "x" + lettre[i]+j);
					montexte = " " + grid[gj-1][gi-1].type[0].toUpperCase() + "x" + lettre[i]+j;
					move(gj-1,gi-1,j-gj,i-gi,playerID);
				}
				else {
					document.getElementById('zonetext').textContent += " x" + lettre[i]+j;
					elm=7;
					//montexte2.Write(" x" + lettre[i]+j);
					montexte = " x" + lettre[i]+j;
					move(gj-1,gi-1,j-gj,i-gi,playerID);				
				}
			}
			else {//si il n'y a pas de prise
				if (grid[gj-1][gi-1].type != 'pion') {
					document.getElementById('zonetext').textContent += " " + grid[gj-1][gi-1].type[0].toUpperCase() + lettre[i]+j;
					elm=7;
					//montexte2.Write(" " + grid[gj-1][gi-1].type[0].toUpperCase() + lettre[i]+j);
					montexte = " " + grid[gj-1][gi-1].type[0].toUpperCase() + lettre[i]+j;
					move(gj-1,gi-1,j-gj,i-gi,playerID);
				}
				else {
					document.getElementById('zonetext').textContent += " " + lettre[i]+j;
					elm=6;
					//montexte2.Write(" " + lettre[i]+j);
					montexte  = " " + lettre[i]+j;
					move(gj-1,gi-1,j-gj,i-gi,playerID);				
				}
			}
			if (!nestplusenechec2()){
				alert('Vous ne pouvez pas faire ce mouvement, cela vous mets en échec !');
				undowmove(gj-1,gi-1,j-gj,i-gi,grid[j-1][i-1],elm);
				undowecriturepartie(elm);
				enechec=false;
				return false
			}
			else{
				return true;
			}
		}
		if (document.getElementById("tile_" + i + '_' + j ).style.backgroundColor=="rgba(237, 230, 0, 0.6)"&&enechec==true) {
			if (grid[j-1][i-1]) {
				if (grid[gj-1][gi-1].type != 'pion') {
					//document.getElementById('zonetext').textContent += " " + grid[gj-1][gi-1].type[0].toUpperCase() + "x" + lettre[i]+j;
					//montexte2.Write(" " + grid[gj-1][gi-1].type[0].toUpperCase() + "x" + lettre[i]+j);
					move(gj-1,gi-1,j-gj,i-gi,playerID);
				}
				else {
					//document.getElementById('zonetext').textContent += " x" + lettre[i]+j;
					//montexte2.Write(" x" + lettre[i]+j);
					move(gj-1,gi-1,j-gj,i-gi,playerID);				
				}
			}
			else {
				if (grid[gj-1][gi-1].type != 'pion') {
					//document.getElementById('zonetext').textContent += " " + grid[gj-1][gi-1].type[0].toUpperCase() + lettre[i]+j;
					//montexte2.Write(" " + grid[gj-1][gi-1].type[0].toUpperCase() + lettre[i]+j);
					move(gj-1,gi-1,j-gj,i-gi,playerID);
				}
				else {
					//document.getElementById('zonetext').textContent += " " + lettre[i]+j;
					//montexte2.Write(" " + lettre[i]+j);
					move(gj-1,gi-1,j-gj,i-gi,playerID);				
				}
				//move3(gj-1,gi-1,j-gj,i-gi);
			}
			tour+=1;
			if (nestplusenechec()) {
				document.getElementById('zonetext').textContent+=" "+tour+".";
				//montexte2.WriteLine(" "+tour+".");
				/*grid[gj-1][gi-1] = grid[j-1][i-1];
				grid[j-1][i-1]=retour;
				enechec=false;
				enfaitretour = false;*/
				return verif_mouv(i,j);
			}
			else {
				/*grid[gj-1][gi-1] = grid[j-1][i-1];
				grid[j-1][i-1]=retour;
				afaitretour = true;
				console.log("passe par la");*/
				undowmove(gj-1,gi-1,j-gj,i-gi,grid[j-1][i-1],0);
				return false;
			}
		}
	}
	return false;
}

function undowecriturepartie(elm){
	document.getElementById('zonetext').textContent = document.getElementById('zonetext').textContent.substr(0,document.getElementById('zonetext').textContent.length-elm);
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
		if (a-1>=0&&b-1>=0&&a-1<8&&b-1<8) {
			if (grid[a-1][b-1].type == 'roi' && grid[j-1][i-1].type != 'pion' && grid[a-1][b-1].player == playerID){
				alert('Vous êtes en échec'); // Le faire afficher sur le bon joueur
				console.log("echecs",grid[j-1][i-1]);
				enechec = true;
				return true;
			}
			if (grid[a-1][b-1].type == 'roi' && grid[j-1][i-1].type == 'pion' && grid[a-1][b-1].player == playerID) {
				if (a != j-1 && b != i) {//pour les blancs
					alert('Vous êtes en échec');//Echec pour le pion
					enechec=true;
					return true;
				}
				if (a-2 != j-1 && b != i) {//pour les noirs
					alert('Vous êtes en échec');//Echec pour le pion
					enechec=true;
					return true;
				}
			}
		}
	}
	return false;
}

function echecs2(i,j){
	var ar = select(j-1,i-1);
	for (var l = 0; l < ar.length; l++) {
		var x = ar[l][0];
		var y = ar[l][1];
		var dx = ar[l][2];
		var dy = ar[l][3];
		var a = x+dx+1;
		var b = y+dy+1;
		if (a-1>=0&&b-1>=0&&a-1<8&&b-1<8) {
			if (grid[a-1][b-1].type == 'roi' && grid[j-1][i-1].type != 'pion' && grid[a-1][b-1].player == playerID){
				//alert('Vous êtes en échec'); // Le faire afficher sur le bon joueur
				enechec = true;
				return true;
			}
			if (grid[a-1][b-1].type == 'roi' && grid[j-1][i-1].type == 'pion' && grid[a-1][b-1].player == playerID) {
				console.log(a,j-1,"puis",b,i-1);
				if (a != j-1 && b != i) {//pour les blancs
					//alert('Vous êtes en échec');//Echec pour le pion
					enechec=true;
					return true;
				}
				if (a-2 != j-1 && b != i) {//pour les noirs
					//alert('Vous êtes en échec');//Echec pour le pion
					enechec=true;
					return true;
				}
			}
		}
	}
	return false;
}

function nestplusenechec () { //Fonction qui verifie l'ensemble des pièces ennemie, pour savoir si il y en a une qui mets le roi en echec // return false si est toujours en echecs.
	for (var i = 1; i <9; i++) {
		for (var j = 1; j < 9; j++) {
			if (grid[j-1][i-1]){
				if(echecs(i,j)){
					console.log(grid[j-1][i-1],"piece qui mets en echec");
					return false;
				}
			}
		}
	}
	enechec=false;
	return true;
}

function estenechecs() {
	for (var i = 1; i <9; i++) {
		for (var j = 1; j < 9; j++) {
			if (grid[j-1][i-1]){
				if(echecs(i,j)){
					return estenmat();
				}
			}
		}
	}
}

function estenmat() {
	for (var i = 1; i <9; i++) {
		for (var j = 1; j < 9; j++) {
			if (grid[j-1][i-1]){
				if(echecs2(i,j)){
					alert("Vous avez perdu, vous êtes mat !");
					sendCmd(JSON.stringify({type: "mat", pseudo: pseudo, room: roomID, player: playerID}));
					return 0;
				}
			}
		}
	}
}

function nestplusenechec2 () { //Fonction qui verifie l'ensemble des pièces ennemie, pour savoir si il y en a une qui mets le roi en echec // return false si est toujours en echecs.
	for (var i = 1; i <9; i++) {
		for (var j = 1; j < 9; j++) {
			if (grid[j-1][i-1]){
				if(echecs2(i,j)){
					return false;
				}
			}
		}
	}
	enechec=false;
	return true;
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

function achanger_tour(a){
	sendCmd(JSON.stringify({type: "promotion", pseudo: pseudo, pj:pj,pi:pi,a:a, room: roomID, player:playerID, piece:"tour"}));
	document.getElementById('promotion').style.visibility = 'hidden';
	grid[pj-1][pi-1] = {type : "tour", player:playerID};
	undraw((pi-1)*40,(pj-1)*40);
    draw((pi)*40,(pj)*40,'Images/pions/tour_'+a+'.png');
}

function achanger_fou(a){
	sendCmd(JSON.stringify({type: "promotion", pseudo: pseudo, pj:pj,pi:pi,a:a, room: roomID, player:playerID, piece : "fou"}));
	document.getElementById('promotion').style.visibility = 'hidden';
	grid[pj-1][pi-1] = {type : "fou", player:playerID};
	undraw((pi-1)*40,(pj-1)*40);
    draw((pi)*40,(pj)*40,'Images/pions/fou_'+a+'.png');
}

function achanger_cheval(a){
	sendCmd(JSON.stringify({type: "promotion", pseudo: pseudo, pj:pj,pi:pi,a:a, room: roomID, player:playerID, piece : "cheval"}));
	document.getElementById('promotion').style.visibility = 'hidden';
	grid[pj-1][pi-1] = {type : "cheval", player:playerID};
	undraw((pi-1)*40,(pj-1)*40);
    draw((pi)*40,(pj)*40,'Images/pions/cheval_'+a+'.png');
}

function achanger_reine(a){
	sendCmd(JSON.stringify({type: "promotion", pseudo: pseudo, pj:pj,pi:pi,a:a, room: roomID, player:playerID, piece : "reine"}));
	document.getElementById('promotion').style.visibility = 'hidden';
	grid[pj-1][pi-1] = {type : "reine", player:playerID};
	undraw((pi-1)*40,(pj-1)*40);
    draw((pi)*40,(pj)*40,'Images/pions/reine_'+a+'.png');
}

function achanger_tour2(a,pj,pi,id){
	document.getElementById('promotion').style.visibility = 'hidden';
	grid[pj-1][pi-1] = {type : "tour", player:id};
	undraw((pi-1)*40,(pj-1)*40);
    draw((pi)*40,(pj)*40,'Images/pions/tour_'+a+'.png');
}

function achanger_fou2(a,pj,pi,id){
	document.getElementById('promotion').style.visibility = 'hidden';
	grid[pj-1][pi-1] = {type : "fou", player:id};
	undraw((pi-1)*40,(pj-1)*40);
    draw((pi)*40,(pj)*40,'Images/pions/fou_'+a+'.png');
}

function achanger_cheval2(a,pj,pi,id){
	document.getElementById('promotion').style.visibility = 'hidden';
	grid[pj-1][pi-1] = {type : "cheval", player:id};
	undraw((pi-1)*40,(pj-1)*40);
    draw((pi)*40,(pj)*40,'Images/pions/cheval_'+a+'.png');
}

function achanger_reine2(a,pj,pi,id){
	document.getElementById('promotion').style.visibility = 'hidden';
	grid[pj-1][pi-1] = {type : "reine", player:id};
	undraw((pi-1)*40,(pj-1)*40);
    draw((pi)*40,(pj)*40,'Images/pions/reine_'+a+'.png');
}



function changement_pion(nouveau){
	if (nouveau==ennemiID) {
		alert("Vous ne pouvez pas prendre la couleur de l'adversaire !")
		return 0
	}
    for (var i = 0; i <8; i++) {
        for (var j=0; j <8; j++) {
            if (grid[i][j].player == playerID) {
                undraw((j+1)*40,(i+1)*40);
                draw((j+1)*40,(i+1)*40,'Images/pions/'+grid[i][j].type+'_'+nouveau+'.png');
                grid[i][j].player = nouveau;
            }
        }
    }
    document.getElementById('promotion').removeChild(document.getElementById('childrens'));
    var div = document.createElement("div");
    var img1 = document.createElement("img");
    img1.src = "Images/pions/cheval_"+nouveau+".png";
    img1.onclick = function() {achanger_cheval(nouveau);};
    var img2 = document.createElement("img");
    img2.src = "Images/pions/tour_"+nouveau+".png";
    img2.onclick = function () {achanger_tour(nouveau);};
    var img3 = document.createElement("img");
    img3.src = "Images/pions/reine_"+nouveau+".png";
    img3.onclick = function(){achanger_reine(nouveau);};
    var img4 = document.createElement("img");
    img4.src = "Images/pions/fou_"+nouveau+".png";
    img4.onclick = function() {achanger_fou(nouveau);};
    div.appendChild(img1);
    div.appendChild(img2);
    div.appendChild(img3);
    div.id = 'childrens';
    div.appendChild(img4);
    document.getElementById('promotion').appendChild(div);
    console.log(document.getElementById('promotion')); 
    playerID = nouveau; //Il faut maintenant le propager
    //sendCmd(JSON.stringify({type: "nouveau_ID", cid : playerID}));
    //sendCmd(JSON.stringify({type: "sortie_joueur", pseudo: pseudo, room: roomID}));
}

function akingisnear(j,i){
	if(i-1>=0&&j-1>=0){if (grid[i-1][j-1].type=='roi'&&grid[i-1][j-1].player != playerID) return true;}
	if (i-1>=0){if (grid[i-1][j].type=='roi'&&grid[i-1][j].player != playerID) return true;}
	if (i-1 >=0 && j +1<8){if (grid[i-1][j+1].type=='roi'&&grid[i-1][j+1].player != playerID) return true;}
	if (j-1>=0){if (grid[i][j-1].type=='roi'&&grid[i][j-1].player != playerID) return true;}
	if (grid[i][j].type=='roi'&&grid[i][j].player != playerID) return true;
	if(j+1<8){if (grid[i][j+1].type=='roi'&&grid[i][j+1].player != playerID) return true;}
	if(i+1<8&&j-1>=0){if (grid[i+1][j-1].type=='roi'&&grid[i+1][j-1].player != playerID) return true;}
	if(i+1<8){if (grid[i+1][j].type=='roi'&&grid[i+1][j].player != playerID) return true;}
	if(i+1<8&&j+1<8){if (grid[i+1][j+1].type=='roi'&&grid[i+1][j+1].player != playerID) return true;}
}