// Tarefa 4 - MEF Kestone Kapers
//Estados possíveis
const PARADO =0;
const SUBINDO =1;
const DESCENDO =2;
//Estado inicial
let estadoElevador = PARADO;

//Estados do personagem
const ANDANDO = 0;
const NO_ELEVADOR = 1;

let estadoPersonagem = ANDANDO;

// Locais do elevador nos pavimentos
// 0 = Pavimento 1
// 1 = Pavimento 2 
// 2 = Pavimento 3 
let pavimentos = [350,250,150];
let pavimentoElevador = 0;
let pavimentoPersonagem = 0;


// posição do personagem
let xPersonagem = 80;
let yPersonagem;

// posição do elevador
let xElevador = 210;
let yElevador;

// Tempo do elevador
let tempoElevador = 0;

function setup(){
  createCanvas(500,400);
  yPersonagem = pavimentos[pavimentoPersonagem] - 30;
  yElevador = pavimentos[pavimentoElevador] - 60;
}

function draw(){
  background(220);

  desenharCenario();
  atualizarElevador();
  movimentarPersonagem();
  desenharElevador();
  desenharPersonagem();
}

//Cenário

function desenharCenario(){

  // Céu
  background(135, 206, 235);

  // Prédio ao fundo
  fill(190, 190, 190);
  noStroke();
  rect(20, 40, 460, 310);

  // Janelas do prédio
  fill(100, 150, 180);

  for(let x = 40; x < 470; x += 50){
    for(let y = 60; y < 130; y += 35){
      rect(x, y, 25, 20);
    }
  }

  // Faixa decorativa do prédio
  fill(150, 150, 150);
  rect(20, 135, 460, 15);

  // Espaços entre os pavimentos
  fill(175, 175, 175);
  rect(20, 150, 460, 100);
  rect(20, 250, 460, 100);

  // Pavimento 1
  fill(70, 70, 70);
  rect(20, 350, 460, 50);

  // Linhas dos pavimentos
  stroke(0);
  strokeWeight(3);

  line(20, 350, 480, 350);
  line(20, 250, 480, 250);
  line(20, 150, 480, 150);

  // Faixas coloridas nas bordas dos pavimentos
  stroke(255, 200, 0);
  strokeWeight(6);

  line(20, 347, 480, 347);
  line(20, 247, 480, 247);
  line(20, 147, 480, 147);



  // Colunas laterais
  fill(120, 120, 120);

  rect(0, 100, 20, 300);
  rect(480, 100, 20, 300);

  // Pequenas luzes nas laterais
  fill(255, 220, 80);

  ellipse(10, 170, 8, 8);
  ellipse(490, 170, 8, 8);

  ellipse(10, 270, 8, 8);
  ellipse(490, 270, 8, 8);

  ellipse(10, 370, 8, 8);
  ellipse(490, 370, 8, 8);
}



//Atualização do Elevador (mesma lógica da gangorra da atividade 3)
function atualizarElevador(){
  tempoElevador++;
  //Elevador parado
  if(estadoElevador ===PARADO){
    //tempo de espera
    if(tempoElevador >120){
      //se estiver no 1, vai pro 2
      if(pavimentoElevador === 0){
        estadoElevador = SUBINDO;
      }
        //se estiver no 2, verificar de onde veio
      else if(pavimentoElevador === 1){
        if(proximoMovimento === SUBINDO){
          //Se o proximo movimento for para cima
          estadoElevador = SUBINDO;
        }
          //Se o proximo movimento for para baixo
        else{
          estadoElevador = DESCENDO;
        }
      }
      //Se estiver no 3, ele desce pro 2
      else if(pavimentoElevador === 2){
        estadoElevador = DESCENDO;
      }
      tempoElevador = 0;
    }
  }
  //Elevador subindo
  if(estadoElevador === SUBINDO){
    yElevador -=2;

    //Chegou ao proximo pavimento
    if(yElevador <= pavimentos[pavimentoElevador+1]-60){
      yElevador = pavimentos[pavimentoElevador +1] -60;
      pavimentoElevador++;
      estadoElevador = PARADO;
      tempoElevador =0;

      //quando chega ao pavimento 2, vindo do 1, o proximo movimento é subir pro 3
      if(pavimentoElevador ===1){
        proximoMovimento =SUBINDO;
      }
    }
  }
  //Elevador descendo
  if(estadoElevador === DESCENDO){
    yElevador +=2;

    //Chegou ao proximo pavimento
    if(
      yElevador >=
      pavimentos[pavimentoElevador -1] -60
    ) {

      yElevador =
        pavimentos[pavimentoElevador-1]-60;

      pavimentoElevador--;
      estadoElevador =PARADO;
      tempoElevador = 0;

      //Quando chega do 2 vindo do 3, o proximo movimento é descer pro 1
      if(pavimentoElevador ===1 ){
        proximoMovimento = DESCENDO;
      }
    }
  }

  //Personagem no elevador
  if(estadoPersonagem === NO_ELEVADOR){
    xPersonagem = xElevador +25;

    yPersonagem = yElevador +30;
    pavimentoPersonagem = pavimentoElevador;
  }
}
//Proximo movimento do elevador
let proximoMovimento = SUBINDO;


function desenharElevador(){
  fill(150);
  stroke(0);

  rect(
    xElevador,
    yElevador,
    80,
    60
  );

  fill(230);
  rect(
    xElevador+15,
    yElevador+10,
    50,
    40
  );

  fill(0);
  noStroke();
}

function desenharPersonagem(){
  fill(255,0,0);

  noStroke();

  rect(
    xPersonagem,
    yPersonagem,
    30,
    30
  );
}

function movimentarPersonagem(){
  //Andar apenas fora do Elevador
  if(estadoPersonagem === ANDANDO){
    if(keyIsDown(LEFT_ARROW)){
      xPersonagem -=3;
    }
    if(keyIsDown(RIGHT_ARROW)){
      xPersonagem +=3;
    }

    //Impede o personagem de sair da tela
    xPersonagem = constrain(xPersonagem,20,width-50);
  }
}

function keyPressed(){
  if(estadoPersonagem === ANDANDO){

    if(key === "e" || key === "E"){
      if(colidiuComElevador()){
        estadoPersonagem = NO_ELEVADOR;
        xPersonagem = xElevador +25;
        yPersonagem = yElevador +30;
      }
    }
  }

  else if(estadoPersonagem === NO_ELEVADOR){
    if(key === "e" || key === "E"){
      estadoPersonagem = ANDANDO;

      xPersonagem = xElevador +90;
      yPersonagem = pavimentos[pavimentoElevador] -30;
    }
  }
}

function colidiuComElevador(){
  return(
    xPersonagem +30 > xElevador &&

    xPersonagem <xElevador +80 &&

    yPersonagem +30 > yElevador &&

    yPersonagem <
    yElevador +60
  );
}