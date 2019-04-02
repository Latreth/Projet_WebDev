const websocket = require('ws');
const ent = require('ent'); // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)

var ws = new websocket.Server({port: 80});
console.log("RUNNING ON PORT 80");

var client = {};
var rooms = {};
var users = {};

ws.on('connection', (socket, req) => {
	let id = Random.Char(16);
	client[id] = {};
	let _client = client[id];
	_client.socket = socket;
	_client.ip = req.connection.remoteAddress;
	console.log('CONNECTION FROM ' + _client.ip.substring(7) + " AS " + id);
	client[id].socket.send(JSON.stringify({msg: JSON.stringify({type: "_id", clientID: id})}));
	socket.on('message', (data) => {
		try{
			console.log(data);
			data = JSON.parse(data);
			let clientID = data.cmd.split(' ')[0];
			let cmd = JSON.parse(data.cmd.substring(clientID.length).trim());
			let type = cmd.type;
			if(type == "chat_message"){
				for(let c in rooms[cmd.room]){
					if(c != "playercount") log(rooms[cmd.room][c].ID, JSON.stringify({type: "chat_message", pseudo: cmd.pseudo, message: cmd.message}));
				}
			}
			if(type == "nouveau_joueur"){
				if(!rooms[cmd.room]) rooms[cmd.room] = {playercount: 0};
				let color = 1;
				if(rooms[cmd.room].playercount == 1) color = 2;
				rooms[cmd.room][cmd.pseudo] = {ID: clientID, couleur: color};
				++rooms[cmd.room].playercount;
				users[clientID] = [cmd.room, cmd.pseudo];
				for(let c in rooms[cmd.room]){
					if(c != "playercount") log(rooms[cmd.room][c].ID, JSON.stringify({type: "nouveau_joueur", pseudo: cmd.pseudo}));
				}
				log(clientID, JSON.stringify({type: "autorisation", player: color}));
			}
			if(type == "sortie_joueur"){
				--rooms[cmd.room].playercount;
				delete rooms[cmd.room][cmd.pseudo];
				for(let c in rooms[cmd.room]){
					if(c != "playercount") log(rooms[cmd.room][c].ID, JSON.stringify({type: "sortie_joueur", pseudo: cmd.pseudo}));
				}
			}
			if(type == "nouveau_salon"){
				rooms[cmd.room] = {playercount: 0};
				log(clientID, JSON.stringify({type: "nouveau_salon", pseudo: cmd.pseudo}));
			}
			if(type == "move"){
				for(let c in rooms[cmd.room]){
					if(c != "playercount") log(rooms[cmd.room][c].ID, JSON.stringify({type: "action", x: cmd.x, y: cmd.y, dx: cmd.dx, dy: cmd.dy, player: cmd.player, texte: cmd.texte}));
				}
			}
			if(type == "undomove"){
				for(let c in rooms[cmd.room]){
					if(c!= "playercount") log(rooms[cmd.room][c].ID,JSON.stringify({type:  "undoaction",x:cmd.x,y:cmd.y,dx:cmd.dx,dy:cmd.dy,pion:cmd.pion,lastimage:cmd.lastimage,player:cmd.player}));
				}
			}
			if(type == "promotion"){
				for(let c in rooms[cmd.room]){
					if(c!="playercount") log(rooms[cmd.room][c].ID,JSON.stringify({type: "promotion", pj:cmd.pj, pi:cmd.pi, a:cmd.a, player:cmd.player, piece : cmd.piece}));
				}
			}
			if(type == "mat"){
				for(let c in rooms[cmd.room]){
					if(c!="playercount") log(rooms[cmd.room][c].ID,JSON.stringify({type: "mat", player:cmd.player}));
				}
			}
			if(type == "changecolor"){
				let k = true;
				for(let c in rooms[cmd.room]){
					if(rooms[cmd.room] == cmd.color) k = false;
				}
				if(k){
					rooms[cmd.room][cmd.pseudo].couleur = cmd.color;
					for(let c in rooms[cmd.room]){
						if(c != "playercount") log(rooms[cmd.room][c].ID, JSON.stringify({type: "changecolor", player: cmd.player, color: cmd.couleur}));
					}
				}
				else log(clientID, JSON.stringify({type: "error", message: "pas possible"}));
			}
		}
		catch(e){
			console.log(e);
			return socket.close();
		}
	});
	socket.on('close', () => {
		delete client[id];
		for(let r in rooms){
			for(let p in rooms[r]){
				if(p != "playercount" && rooms[r][p].ID == id && rooms[r][p].couleur <= 4){
					for(let c in rooms[r]){
						if(c != "playercount") log(rooms[cmd.room][c].ID, JSON.stringify({type: "endgame", player: p}));
					}
					delete rooms[r];
					break;
				}
			}
		}
	});
});

var Random = {
	Char: function(length){
		if (length === undefined) length = 1;
		let str = "";
		let letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9'];
		for(let i = 0; i < length; ++i) str += letters[this.Int(0, letters.length - 1)];
		return str
	},
	Int: function(min, max){
		if(min > max) throw "Error : min is more than max";
		return Math.floor(Math.random()*(max - min + 1)) + min;
	},
};

function log(id, str){
	let pack = {};
	pack.msg = str;
	let data = JSON.stringify(pack);
	return broadcast(id, data);
}

function broadcast(id, msg){
	if(id == "all"){
		for(let i in client){
			let _socket = client[i].socket;
			_socket.send(msg);
		}
	}
	else{
		let _socket = client[id].socket;
		_socket.send(msg);
	}
}