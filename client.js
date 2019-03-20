var grid = initGrille();

function initGrille(){
	function initLigne(k, p){
		if(k == 1) return [
			{type: 'pion', player: p},
			{type: 'pion', player: p},
			{type: 'pion', player: p},
			{type: 'pion', player: p},
			{type: 'pion', player: p},
			{type: 'pion', player: p},
			{type: 'pion', player: p},
			{type: 'pion', player: p}
		];
		if(k == 2) return [
			{type: 'tour', player: p},
			{type: 'fou', player: p},
			{type: 'cheval', player: p},
			{type: 'reine', player: p},
			{type: 'roi', player: p},
			{type: 'cheval', player: p},
			{type: 'fou', player: p},
			{type: 'tour', player: p}
		];
	}

	let L = [];
	let i = 1;
	while(i <= 8){
		L[i-1] = false;
		++i;
	}
	let G = [];
	i = 1;
	while(i <= 8){
		G[i-1] = L;
		++i;
	}
	G[0] = initLigne(2, 1);
	G[1] = initLigne(1, 1);
	G[6] = initLigne(1, 2);
	G[7] = initLigne(2, 2);
	G[0][3].type = 'roi';
	G[0][4].type = 'reine';
	return G;
}

function select(x, y){

	let G = grid;
	if(!G[x][y]) return;
	let type = G[x][y].type;
	let p = G[x][y].player;
	let moves = [];

	if(type == 'pion'){
		if(p == 1){
			if(!G[x+1][y]) moves.push('+0+1');
			if(x == 1 && !G[x+2][y]) moves.push('+0+2');
		}
		else{
			if(!G[x-1][y]) moves.push('+0-1');
			if(x == 6 && !G[x-2][y]) moves.push('+0-2');
		}
		if(!!G[x+1] && !!G[x+1][y+1] && G[x+1][y+1].player != p) moves.push('+1+1');
		if(!!G[x-1] && !!G[x-1][y+1] && G[x-1][y+1].player != p) moves.push('-1+1');
		if(!!G[x+1] && !!G[x+1][y-1] && G[x+1][y-1].player != p) moves.push('+1-1');
		if(!!G[x-1] && !!G[x-1][y-1] && G[x-1][y-1].player != p) moves.push('-1-1');
	}

	if(type == 'tour' || type == "reine"){
		for(let i = 1; i <= 8; ++i){
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
			if(!!G[x-i] && !G[x-i][y]) moves.push('+0+' + i);
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
			if(!!G[x-i] && !G[x-i][y+i]) moves.push('-' + i + '+' + i);
			if(!!G[x-i] && !!G[x-i][y+i] && G[x-i][y+i].player == p){
				break;
			}
			if(!!G[x-i] && !!G[x-i][y+i] && G[x-i][y+i].player != p){
				moves.push('-' + i + '+' + i);
				break;
			}
		}
		for(let i = 1; i <= 8; ++i){
			if(!!G[x+i] && !G[x+i][y-i]) moves.push('+' + i + '-' + i);
			if(!!G[x+i] && !!G[x+i][y-i] && G[x+i][y-i].player == p){
				break;
			}
			if(!!G[x+i] && !!G[x+i][y-i] && G[x+i][y-i].player != p){
				moves.push('+' + i + '-' + i);
				break;
			}
		}
		for(let i = 1; i <= 8; ++i){
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
		if(!!G[x+1] && (!G[x+1][y+2] || !!G[x+1][y+2] && G[x+1][y+2].player != p)) moves.push('+1+2');
		if(!!G[x-1] && (!G[x-1][y+2] || !!G[x-1][y+2] && G[x-1][y+2].player != p)) moves.push('-1+2');
		if(!!G[x+1] && (!G[x+1][y-2] || !!G[x+1][y-2] && G[x+1][y-2].player != p)) moves.push('+1-2');
		if(!!G[x-1] && (!G[x-1][y-2] || !!G[x-1][y-2] && G[x-1][y-2].player != p)) moves.push('-1-2');
		if(!!G[x+2] && (!G[x+2][y+1] || !!G[x+2][y+1] && G[x+2][y+1].player != p)) moves.push('+2+1');
		if(!!G[x-2] && (!G[x-2][y+1] || !!G[x-2][y+1] && G[x-2][y+1].player != p)) moves.push('-2+1');
		if(!!G[x+2] && (!G[x+2][y-1] || !!G[x+2][y-1] && G[x+2][y-1].player != p)) moves.push('+2-1');
		if(!!G[x-2] && (!G[x-2][y-1] || !!G[x-2][y-1] && G[x-2][y-1].player != p)) moves.push('-2-1');
	}

	if(type == "roi"){
		if(!!G[x+1] && (!G[x+1][y] || !!G[x+1][y] && G[x+1][y].player != p)) moves.push('+1+0');
		if(!!G[x-1] && (!G[x-1][y] || !!G[x-1][y] && G[x-1][y].player != p)) moves.push('-1+0');
		if(!G[x][y+1] || !!G[x][y+1] && G[x][y+1].player != p) moves.push('+0+1');
		if(!G[x][y-1] || !!G[x][y-1] && G[x][y-1].player != p) moves.push('+0-1');
		if(!!G[x+1] && (!G[x+1][y+1] || !!G[x+1][y+1] && G[x+1][y+1].player != p)) moves.push('+1+1');
		if(!!G[x-1] && (!G[x-1][y+1] || !!G[x-1][y+1] && G[x-1][y+1].player != p)) moves.push('-1+1');
		if(!!G[x+1] && (!G[x+1][y-1] || !!G[x+1][y-1] && G[x+1][y-1].player != p)) moves.push('+1-1');
		if(!!G[x-1] && (!G[x-1][y-1] || !!G[x-1][y-1] && G[x-1][y-1].player != p)) moves.push('-1-1');
	}

	return restrict(moves, x, y);
}

function restrict(L, y, x){
	let D = [];
	L.forEach((d) => {
		let dx = parseInt(d[3]);
		if(d[2] == '-') dx = -dx;
		let dy = parseInt(d[1]);
		if(d[0] == '-') dy = -dy;
		if(x+dx >= 0 && x+dx < 8 && y+dy >= 0 && y+dy < 8) D.push([x, y, dx, dy]);
	});
	return D;
}

function move(x, y, dx, dy){
    G[x+dx][y+dy] = G[x][y];
    G[x][y] = false;
    deplacement(y, x, dy, dx);
}
