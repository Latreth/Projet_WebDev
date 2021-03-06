//var grid = initGrille();
var lastimage=false;
var retour ;

var grid = new Array();
grid = [[
			{type: 'tour', player: 1},
			{type: 'cheval', player: 1},
			{type: 'fou', player: 1},
			{type: 'reine', player: 1},
			{type: 'roi', player: 1},
			{type: 'fou', player: 1},
			{type: 'cheval', player: 1},
			{type: 'tour', player: 1}
		],[
			{type: 'pion', player: 1},
			{type: 'pion', player: 1},
			{type: 'pion', player: 1},
			{type: 'pion', player: 1},
			{type: 'pion', player: 1},
			{type: 'pion', player: 1},
			{type: 'pion', player: 1},
			{type: 'pion', player: 1}
		],[false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false],
		[
			{type: 'pion', player: 2},
			{type: 'pion', player: 2},
			{type: 'pion', player: 2},
			{type: 'pion', player: 2},
			{type: 'pion', player: 2},
			{type: 'pion', player: 2},
			{type: 'pion', player: 2},
			{type: 'pion', player: 2}
		],[
			{type: 'tour', player: 2},
			{type: 'cheval', player: 2},
			{type: 'fou', player: 2},
			{type: 'reine', player: 2},
			{type: 'roi', player: 2},
			{type: 'fou', player: 2},
			{type: 'cheval', player: 2},
			{type: 'tour', player: 2}
		]]

function select(x, y){
	let G = grid;
	if(!G[x][y]) return;
	let type = G[x][y].type;
	let p = G[x][y].player;
	let moves = [];
	if(type == 'pion'){
		if(p == 1){
			if (x+1 <8){if(!G[x+1][y]) moves.push('+0+1');}
			if(x == 1 && !G[x+2][y] && !G[x+1][y]) moves.push('+0+2'); 
		}
		else{
			if (x-1 >0){if(!G[x-1][y]) moves.push('+0-1');}
			if(x == 6 && !G[x-2][y] && ! G[x-1][y]) moves.push('+0-2'); 
		}
		if (x+1 <8 && y+1 <8) {if(!!G[x+1] && !!G[x+1][y+1] && G[x+1][y+1].player != 1 && G[x+1][y+1].player != p) moves.push('+1+1');}
		if (x-1>=0 && y+1 <8) {if(!!G[x-1] && !!G[x-1][y+1] && G[x-1][y+1].player != 2 && G[x-1][y+1].player != p) moves.push('+1-1');}
		if (x+1 <8 && y-1 >=0) {if(!!G[x+1] && !!G[x+1][y-1] && G[x+1][y-1].player != 1 && G[x+1][y-1].player != p) moves.push('-1+1');}
		if (x-1 >=0 && y-1 >=0) {if(!!G[x-1] && !!G[x-1][y-1] && G[x-1][y-1].player != 2 && G[x-1][y-1].player != p) moves.push('-1-1');}
	}
	if(type == 'tour' || type == "reine"){
		for(let i = 1; i <= 8; ++i){
			if (y+i >7) break;
			if(!G[x][y+i]) moves.push('+' + i + '+0');
			if(!!G[x][y+i] && G[x][y+i].player == p){
				break;
			}
			if(!!G[x][y+i] && G[x][y+i].player != p){
				moves.push('+' + i + '+0');
				break;
			}
		}
		for(let i = 1; i <= 8; ++i){
			if (y-i < 0) break;
			if(!G[x][y-i]) moves.push('-' + i + '+0');
			if(!!G[x][y-i] && G[x][y-i].player == p){
				break;
			}
			if(!!G[x][y-i] && G[x][y-i].player != p){
				moves.push('-' + i + '+0');
				break;
			}
		}
		for(let i = 1; i <= 8; ++i){
			if (x+i>7) break;
			if(!!G[x+i] && !G[x+i][y]) moves.push('+0+' + i);
			if(!!G[x+i] && !!G[x+i][y] && G[x+i][y].player == p){
				break;
			}
			if(!!G[x+i] && !!G[x+i][y] && G[x+i][y].player != p){
				moves.push('+0+' + i);
				break;
			}
		}
		for(let i = 1; i <= 8; ++i){
			if (x-i <0) break;
			if(!!G[x-i] && !G[x-i][y]) moves.push('+0-' + i);
			if(!!G[x-i] && !!G[x-i][y] && G[x-i][y].player == p){
				break;
			}
			if(!!G[x-i] && !!G[x-i][y] && G[x-i][y].player != p){
				moves.push('+0-' + i);
				break;
			}
		}
	}
	if(type == 'fou' || type == "reine"){
		for(let i = 1; i <= 8; ++i){
			if (x+i > 7 || y+i >7) break;
			if(!!G[x+i] && !G[x+i][y+i]) moves.push('+' + i + '+' + i);
			if(!!G[x+i] && !!G[x+i][y+i] && G[x+i][y+i].player == p){
				break;
			}
			if(!!G[x+i] && !!G[x+i][y+i] && G[x+i][y+i].player != p){
				moves.push('+' + i + '+' + i);
				break;
			}
		}
		for(let i = 1; i <= 8; ++i){
			if (x-i<0 || y+i >7) break;
			if(!!G[x-i] && !G[x-i][y+i]) moves.push('+' + i + '-' + i);
			if(!!G[x-i] && !!G[x-i][y+i] && G[x-i][y+i].player == p){
				break;
			}
			if(!!G[x-i] && !!G[x-i][y+i] && G[x-i][y+i].player != p){
				moves.push('+' + i + '-' + i);
				break;
			}
		}
		for(let i = 1; i <= 8; ++i){
			if (x+i >7 || y-i < 0 ) break;
			if(!!G[x+i] && !G[x+i][y-i]) moves.push('-' + i + '+' + i);
			if(!!G[x+i] && !!G[x+i][y-i] && G[x+i][y-i].player == p){
				break;
			}
			if(!!G[x+i] && !!G[x+i][y-i] && G[x+i][y-i].player != p){
				moves.push('-' + i + '+' + i);
				break;
			}
		}
		for(let i = 1; i <= 8; ++i){
			if (x-i <0 || y-i <0) break;
			if(!!G[x-i] && !G[x-i][y-i]) moves.push('-' + i + '-' + i);
			if(!!G[x-i] && !!G[x-i][y-i] && G[x-i][y-i].player == p){
				break;
			}
			if(!!G[x-i] && !!G[x-i][y-i] && G[x-i][y-i].player != p){
				moves.push('-' + i + '-' + i);
				break;
			}
		}
	}
	if(type == 'cheval'){
		if (x+1<8&&y+2<8) {if(!!G[x+1] && (!G[x+1][y+2] || !!G[x+1][y+2] && G[x+1][y+2].player != p)) moves.push('+2+1');}
		if (y-2 >=0&&x+1<8) {if(!!G[x+1] && (!G[x+1][y-2] || !!G[x+1][y-2] && G[x+1][y-2].player != p)) moves.push('-2+1');}
		if (x-1 >= 0&&y+2<8) {if(!!G[x-1] && (!G[x-1][y+2] || !!G[x-1][y+2] && G[x-1][y+2].player != p)) moves.push('+2-1');}
		if (y-2 >= 0 && x-1>=0) {if(!!G[x-1] && (!G[x-1][y-2] || !!G[x-1][y-2] && G[x-1][y-2].player != p)) moves.push('-2-1');}
		if (x+2<8 && y+1<8) {if(!!G[x+2] && (!G[x+2][y+1] || !!G[x+2][y+1] && G[x+2][y+1].player != p)) moves.push('+1+2');}
		if (x-2 >=0 && y+1<8){if(!!G[x-2] && (!G[x-2][y+1] || !!G[x-2][y+1] && G[x-2][y+1].player != p)) moves.push('+1-2');}
		if (y-1>=0 && x+2<8){if(!!G[x+2] && (!G[x+2][y-1] || !!G[x+2][y-1] && G[x+2][y-1].player != p)) moves.push('-1+2');}
		if (x-2>=0 && y-1>=0) {if(!!G[x-2] && (!G[x-2][y-1] || !!G[x-2][y-1] && G[x-2][y-1].player != p)) moves.push('-1-2');} //J'ai intervertit tous les couples
	}
	if(type == "roi"){//rejouter la contrainte de déplacement vis à vis du roi adverse
		if(!!G[x+1] && (!G[x+1][y] || !!G[x+1][y] && G[x+1][y].player != p)) moves.push('+0+1');
		if(!!G[x-1] && (!G[x-1][y] || !!G[x-1][y] && G[x-1][y].player != p)) moves.push('+0-1');
		if(!G[x][y+1] || !!G[x][y+1] && G[x][y+1].player != p) moves.push('+1+0');
		if(!G[x][y-1] || !!G[x][y-1] && G[x][y-1].player != p) moves.push('-1+0');
		if(!!G[x+1] && (!G[x+1][y+1] || !!G[x+1][y+1] && G[x+1][y+1].player != p)) moves.push('+1+1');
		if(!!G[x-1] && (!G[x-1][y+1] || !!G[x-1][y+1] && G[x-1][y+1].player != p)) moves.push('+1-1');
		if(!!G[x+1] && (!G[x+1][y-1] || !!G[x+1][y-1] && G[x+1][y-1].player != p)) moves.push('-1+1');
		if(!!G[x-1] && (!G[x-1][y-1] || !!G[x-1][y-1] && G[x-1][y-1].player != p)) moves.push('-1-1');
	}
	return restrict(moves, x, y);
}

function restrict(L, x, y){
	let D = [];
	L.forEach((d) => {
		let dx = parseInt(d[3]);
		if(d[2] == '-') dx = -dx;
		let dy = parseInt(d[1]);
		if(d[0] == '-') dy = -dy;
		D.push([x, y, dx, dy]);
	});
	return D;
}

/*function move3(x,y,dx,dy){
	retour = grid[x+dx][y+dy];
	grid[x+dx].splice(y+dy,1,grid[x][y]);
	grid[x][y]=false;
	console.log(grid[x+dx][y+dy]);
	console.log(retour);
	console.log(grid);
	console.log(x+dx,y+dy);
	console.log(grid[x+dx][y+dy]);
}*/

function move(x, y, dx, dy,id){
	if (playerID == noir) {		
		tour+=1;
		document.getElementById('zonetext').textContent+=" "+tour+".";
	}
	if (grid[x][y].player == playerID) {
		/*console.log(x);
		console.log(dx);
		console.log(x+dx);*/
		var a = y+dy;
		var b = x+dx;
		if(id!=playerID) {
		deplacement(x, y, dx*40, dy*40);
		grid[b].splice(a,1,grid[x][y]);
		//grid[x+dx][y+dy]={type:' ',player:0};
		//grid[b][a] = grid[x][y];
		/*for (var i = 0; i <8; i++) {
		}*/
		grid[x][y] = false;}
		else{
			console.log(montexte);
			sendCmd(JSON.stringify({type: 'move', x: x, y: y, dx: dx, dy: dy, room: roomID, player:playerID, texte:montexte}));
			deplacement(x, y, dx*40, dy*40);
			grid[b].splice(a,1,grid[x][y]);
			//grid[x+dx][y+dy]={type:' ',player:0};
			//grid[b][a] = grid[x][y];
			/*for (var i = 0; i <8; i++) {
			}*/
			grid[x][y] = false;
		}
		montour=false;
	}
}

function move2(x,y,dx,dy,id){
	/*console.log(x);
	console.log(dx);
	console.log(x+dx);*/
	var a = y+dy;
	var b = x+dx;
	if(id!=playerID) {
	deplacement(x, y, dx*40, dy*40);
	grid[b].splice(a,1,grid[x][y]);
	//grid[x+dx][y+dy]={type:' ',player:0};
	//grid[b][a] = grid[x][y];
	/*for (var i = 0; i <8; i++) {
	}*/
	grid[x][y] = false;}
	else{
		console.log(montexte);
		sendCmd(JSON.stringify({type: 'move', x: x, y: y, dx: dx, dy: dy, room: roomID, player:playerID, texte:montexte}));
		deplacement(x, y, dx*40, dy*40);
		grid[b].splice(a,1,grid[x][y]);
		//grid[x+dx][y+dy]={type:' ',player:0};
		//grid[b][a] = grid[x][y];
		/*for (var i = 0; i <8; i++) {
		}*/
		grid[x][y] = false;
	}
	if (playerID==blanc){
		tour+=1;
		document.getElementById('zonetext').textContent+=" "+tour+".";
	}
}

function undowmove(x,y,dx,dy,pion,elm,id){
	sendCmd(JSON.stringify({type: 'undomove', x: x, y: y, dx: dx, dy: dy,pion:pion, room: roomID, player:playerID, lastimage:lastimage,texte:montexte,elm:elm}));
	montour=true;
	undowdeplacement(x,y,dx*40,dy*40,pion);
	grid[x][y] = grid[x+dx][y+dy];
	if (lastimage){
		grid[x+dx][y+dy]={type:lastimage.type,player:lastimage.player};
		lastimage=false;
	}
	else{
		grid[x+dx][y+dy]=false;
	}/*
	if (grid[x][y].player == playerID) {
		if(id!=playerID){
			montour=true;
			undowdeplacement(x,y,dx*40,dy*40,pion);
			grid[x][y] = grid[x+dx][y+dy];
			if (lastimage){
				grid[x+dx][y+dy]={type:lastimage.type,player:lastimage.player};
				lastimage=false;
			}
			else{
				grid[x+dx][y+dy]=false;
			}
		}
		else {
			sendCmd(JSON.stringify({type: 'undomove', x: x, y: y, dx: dx, dy: dy,pion:pion, room: roomID, player:playerID, texte:montexte}));
			montour=true;
			undowdeplacement(x,y,dx*40,dy*40,pion);
			grid[x][y] = grid[x+dx][y+dy];
			if (lastimage){
				grid[x+dx][y+dy]={type:lastimage.type,player:lastimage.player};
				lastimage=false;
			}
			else{
				grid[x+dx][y+dy]=false;
			}
		}
	}*/
}

function undowmove2(x,y,dx,dy,pion,id,lastimage2){
	if (id!=playerID) {
			console.log("je suis la");
			console.log(lastimage2);
			montour=true;
			undowdeplacement2(x,y,dx*40,dy*40,pion,lastimage2);
			grid[x][y] = grid[x+dx][y+dy];
			if (lastimage2){
				grid[x+dx][y+dy]={type:lastimage2.type,player:lastimage2.player};
				lastimage=false;
			}
			else{
				grid[x+dx][y+dy]=false;
			}
	}
	else {
		sendCmd(JSON.stringify({type: 'undomove', x: x, y: y, dx: dx, dy: dy,pion:pion, room: roomID, player:playerID, texte:montexte}));
		montour=true;
		undowdeplacement(x,y,dx*40,dy*40,pion);
		grid[x][y] = grid[x+dx][y+dy];
		if (lastimage2){
			grid[x+dx][y+dy]={type:lastimage2.type,player:lastimage2.player};
			lastimage=false;
		}
		else{
			grid[x+dx][y+dy]=false;
		}

	}
}

var ctx2 = document.getElementById('pieces').getContext('2d');
var ctx3 = document.getElementById('pieces_prise').getContext('2d');
ctx3.font ="20px Georgia";
ctx3.strokeText("Pièces Prises :",0,20);
ctx3.x = 0;
ctx3.y = 40;
function draw(x,y,url){
	var image = new Image();
	image.addEventListener('load',function(){
		var less= image.height;
		ctx2.drawImage(image,x-32,y-less-4);
	},false);
	image.src = url;
	image.load;
}
function undraw(x,y){
	ctx2.clearRect(x,y,40,40);
}
function deplacement(x,y,deltax,deltay){ //deltax et deltay compris entre -8 et 8 pour le déplacement
	undraw(y*40,x*40);
	if (grid[x+deltax/40][y+deltay/40]!=false&&grid[x+deltax/40][y+deltay/40].player != playerID){
		var image = new Image();
		image.src = 'Images/pions/'+grid[x+deltax/40][y+deltay/40].type+'_'+grid[x+deltax/40][y+deltay/40].player+'.png';
		lastimage = {url:'Images/pions/'+grid[x+deltax/40][y+deltay/40].type+'_'+grid[x+deltax/40][y+deltay/40].player+'.png',type : grid[x+deltax/40][y+deltay/40].type,player : grid[x+deltax/40][y+deltay/40].player};
		ctx3.drawImage(image,ctx3.x,ctx3.y); //afficher en dessous de l'échiquier la pièce mangée
		ctx3.x +=40;
	}
	undraw(y*40+deltay,x*40+deltax);
	draw(y*40+deltay+40,x*40+deltax+40,'Images/pions/'+grid[x][y].type+'_'+grid[x][y].player+'.png');
}

function undowdeplacement(x,y,deltax,deltay,piece){
	if (lastimage&& piece.player!=lastimage.player) { //si une pièce avait été prise et qu'elle n'est pas au même joueur
		undraw(y*40+deltay,x*40+deltax);
		draw(y*40+deltay+40,x*40+deltax+40,lastimage.url);
		draw(y*40+40,x*40+40,'Images/pions/'+grid[x+deltax/40][y+deltay/40].type+'_'+grid[x+deltax/40][y+deltay/40].player+'.png');
		ctx3.x -=40;
		ctx3.clearRect(ctx3.x,ctx3.y,40,40);
	}
	else{ //sinon
		undraw(y*40+deltay,x*40+deltax);
		//draw(y*40+deltay,x*40+deltax,lastimage);
		draw(y*40+40,x*40+40,'Images/pions/'+grid[x+deltax/40][y+deltay/40].type+'_'+grid[x+deltax/40][y+deltay/40].player+'.png');
	}
}

function undowdeplacement2(x,y,deltax,deltay,piece,lastimage2){
	if (lastimage2&& piece.player!=lastimage2.player) { //si une pièce avait été prise et qu'elle n'est pas au même joueur
		undraw(y*40+deltay,x*40+deltax);
		draw(y*40+deltay+40,x*40+deltax+40,lastimage2.url);
		draw(y*40+40,x*40+40,'Images/pions/'+grid[x+deltax/40][y+deltay/40].type+'_'+grid[x+deltax/40][y+deltay/40].player+'.png');
		ctx3.x -=40;
		ctx3.clearRect(ctx3.x,ctx3.y,40,40);
	}
	else{ //sinon
		undraw(y*40+deltay,x*40+deltax);
		//draw(y*40+deltay,x*40+deltax,lastimage);
		draw(y*40+40,x*40+40,'Images/pions/'+grid[x+deltax/40][y+deltay/40].type+'_'+grid[x+deltax/40][y+deltay/40].player+'.png');
	}
}
//initialisation du plateau avec toute les pièces
for(i=1;i<9;i++){
	for(j=1;j<9;j++){
		if (grid[i-1][j-1]){
			draw(j*40,i*40,'Images/pions/'+grid[i-1][j-1].type+'_'+grid[i-1][j-1].player+'.png');
		}
	}
}
//initialisation des imgs pour promotion ici
setTimeout(()=>{console.log(playerID,"playerID");var img1 = document.createElement("img");
img1.src = "Images/pions/cheval_"+playerID+".png";
img1.onclick = function() {achanger_cheval(playerID);};
var img2 = document.createElement("img");
img2.src = "Images/pions/tour_"+playerID+".png";
img2.onclick = function () {achanger_tour(playerID);};
var img3 = document.createElement("img");
img3.src = "Images/pions/reine_"+playerID+".png";
img3.onclick = function(){achanger_reine(playerID);};
var img4 = document.createElement("img");
img4.src = "Images/pions/fou_"+playerID+".png";
img4.onclick = function() {achanger_fou(playerID);};
document.getElementById('childrens').appendChild(img1);
document.getElementById('childrens').appendChild(img2);
document.getElementById('childrens').appendChild(img3);
document.getElementById('childrens').appendChild(img4);}, 2000);
/*var img1 = document.createElement("img");
img1.src = "Images/pions/cheval_"+playerID+".png";
img1.onclick = function() {achanger_cheval(playerID);};
var img2 = document.createElement("img");
img2.src = "Images/pions/tour_"+playerID+".png";
img2.onclick = function () {achanger_tour(playerID);};
var img3 = document.createElement("img");
img3.src = "Images/pions/reine_"+playerID+".png";
img3.onclick = function(){achanger_reine(playerID);};
var img4 = document.createElement("img");
img4.src = "Images/pions/fou_"+playerID+".png";
img4.onclick = function() {achanger_fou(playerID);};
document.getElementById('childrens').appendChild(img1);
document.getElementById('childrens').appendChild(img2);
document.getElementById('childrens').appendChild(img3);
document.getElementById('childrens').appendChild(img4);*/

//Reste à faire :
//Le roc
//Faire un timer pour les parties blitz
//Interaction interface lors d'un échec et mat (facile) (faire dabord la variable tour, fonction ez apres)
//IA si le temps le permet
//Implémenter la prise de pion 'en passant'