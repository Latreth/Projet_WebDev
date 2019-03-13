const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

var text=["a","b","c","d","e","f","g","h"];
var nbr=["1","2","3","4","5","6","7","8"];
ctx.font = "20px Georgia";

for (i=0;i<8;i++){
  for(j=0;j<8;j++){
    if (i%2==0) {
      if (j%2==0){
        ctx.fillStyle='white';
        ctx.fillRect(i*40,j*40,40,40);
      }
      else {
        ctx.fillStyle = 'black';
        ctx.fillRect(i*40,j*40,40,40);
      }
    }
    else {
      if (j%2==0){
        ctx.fillStyle = 'black';
        ctx.fillRect(i*40,j*40,40,40);
      }
      else {
        ctx.fillStyle='white';
        ctx.fillRect(i*40,j*40,40,40);
      }
    }
    if (j==7){
      ctx.strokeText(text[i],(i+0.5)*40,(j+1.5)*40);
    }
    if(i==7){
      ctx.strokeText(nbr[j],(i+1.2)*40,(j+0.7)*40);
    }
  }
}
ctx.strokeRect(0,0,320,320);
