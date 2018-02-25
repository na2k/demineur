const demineur = (function demineur(){
  "use strict";
  const insererLigne = function insererLigne(){
    var ligne = document.createElement("tr");
    const cible = document.getElementById("game");
    return cible.appendChild(ligne);
  };
  var nbMines = 0;
  var nbMinesATrouver = 0;
  var lignesTotal = 0;
  var colonnesTotal = 0;
  var gameover = false; //booléen qui bloque la partie en cas de défaite
  var win = false; // bloque la partie en cas de victoire
  var timer;
  const insererColonne = function insererColonne(nLigne, i, j, level) {
    var colonne = document.createElement("td");
    var cellRow = i;
    var cellCol = j;
    colonne.style.width = "30px";
    colonne.style.height = "30px";
    nLigne.appendChild(colonne);
    colonne.classList.add("cell_"+i+"_"+j); //créer des classes permettant d'identifier chaque cellule
    colonne.classList.add("hidden");// classe pour cellules pas encore ouvertes
    colonne.classList.add("noflag");// classe pour cellules sans drapeau
    function placerMine(lvl){ // placer des mines
      var a = Math.random();
      //probabilité que chaque case contienne une mine
      if(lvl==1) var b = 0.10;
      if(lvl==2) var b = 0.13;
      if(lvl==3) var b = 0.16;
      if(lvl==4) var b = 0.19;
      if(lvl==5) var b = 0.22;
      if(lvl==6) var b = 0.25;
      if(lvl==7) var b = 0.28;
      if(lvl==8) var b = 0.31;
      if(lvl==9) var b = 0.34;
      if(lvl==10) var b = 0.37;
      if (a <= b){
        colonne.classList.add("mine");
        nbMines++;
        nbMinesATrouver++;
      }
    }
    placerMine(level);

    function nombreCases(){ //combien de cases autour de la case sélectionnée contiennent des mines
      colonne.innerHTML = "0";
      console.log(i);
      console.log(j);
      var nbMinesAutour = 0; //nombre total de mines autour de la case sélectionnée
      //HAUT GAUCHE
      if(i>=1 && j>=1){
        var hautGauche = document.querySelector(".cell_"+(i-1)+"_"+(j-1));
        if(hautGauche.classList.contains("mine")){
          nbMinesAutour++;
        }
      }
      //HAUT
      if(i>=1){
        var haut = document.querySelector(".cell_"+(i-1)+"_"+j);
        if(haut.classList.contains("mine")){
          nbMinesAutour++;
        }
      }
      //HAUT DROITE
      if(i>=1 && j<colonnesTotal){
        var hautDroite = document.querySelector(".cell_"+(i-1)+"_"+(j+1));
        if(hautDroite.classList.contains("mine")){
          nbMinesAutour++;
        }
      }

      //DROITE
      if(j<colonnesTotal){
        var droite = document.querySelector(".cell_"+i+"_"+(j+1));
        if(droite.classList.contains("mine")){
          nbMinesAutour++;
        }
      }
      //BAS DROITE
      if(i<lignesTotal && j<colonnesTotal){
        var basDroite = document.querySelector(".cell_"+(i+1)+"_"+(j+1));
        if(basDroite.classList.contains("mine")){
          nbMinesAutour++;
        }
      }
      //BAS
      if(i<lignesTotal){
        var bas = document.querySelector(".cell_"+(i+1)+"_"+j);
        if(bas.classList.contains("mine")){
          nbMinesAutour++;
        }
      }
      //BAS GAUCHE
      if(i<lignesTotal && j>=1){
        var basGauche = document.querySelector(".cell_"+(i+1)+"_"+(j-1));
        if(basGauche.classList.contains("mine")){
          nbMinesAutour++;
        }
      }
      //GAUCHE
      if(j>=1){
        var gauche = document.querySelector(".cell_"+i+"_"+(j-1));
        if(gauche.classList.contains("mine")){
          nbMinesAutour++;
        }
      }
      if(nbMinesAutour==0){
        colonne.innerHTML="";


      }
      else{
        colonne.innerHTML=nbMinesAutour;
        if(nbMinesAutour==1){
          colonne.style.color="#0000ff";
        }
        if(nbMinesAutour==2){
          colonne.style.color="#008000";
        }
        if(nbMinesAutour==3){
          colonne.style.color="#ff0000";
        }
        if(nbMinesAutour==4){
          colonne.style.color="#000080";
        }
        if(nbMinesAutour==5){
          colonne.style.color="#800000";
        }
        if(nbMinesAutour==6){
          colonne.style.color="#008888";
        }
        if(nbMinesAutour==7){
          colonne.style.color="#000000";
        }
        if(nbMinesAutour==8){
          colonne.style.color="#808080";
        }
      }
    }
    document.getElementById("nombreMines").innerHTML="<img src=\"img/mine.png\" alt=\"mines\"> = "+nbMinesATrouver+" / "+nbMines;

    colonne.oncontextmenu = function (event) { //placer des drapeaux avec le clique droit
      if(gameover == false && win == false)
      {
        if(colonne.classList.contains("hidden")){ //placer le drapeau
          if(colonne.classList.contains("noflag") && colonne.classList.contains("hidden")){
            nbMinesATrouver--;
          }
          else{
            nbMinesATrouver++;
          }
          colonne.classList.toggle("noflag");
          gagnerPartie();
        }
        else{
          //rien
        }

        document.getElementById("nombreMines").innerHTML="<img src=\"img/mine.png\" alt=\"mines\"> = "+nbMinesATrouver+" / "+nbMines;
      }
      if(gameover == true){

      }
      if(win == true){

      }
      return false
    }

    colonne.addEventListener("click", function clickCell(){ // quand on clique sur une cellule
      if(gameover == false && win == false){
        openCell();
      }
      if(gameover == true){

      }
      if(win == true){

      }
    });

    function finDePartie(){ // si partie terminée vérifier les drapeaux mal placés
      for(var i = 0; i <= lignesTotal; i++){
        for(var j = 0; j <= colonnesTotal; j++){
          colonne = document.querySelector(".cell_"+i+"_"+j);
          if(colonne.classList.contains("hidden")){
            if(colonne.classList.contains("noflag")){ //si pas de drapeau
              //afficher toutes les mines
              if(colonne.classList.contains("mine")){
                colonne.classList.remove("hidden");
                colonne.classList.add("show");
                colonne.classList.add("finDuGame");
              }
            }
            else{ //si il y a un drapeau
              if(colonne.classList.contains("mine")){
                //rien
              }
              else{
                console.log("mauvais drapeau case "+i+", "+j);
                colonne.classList.add("mauvaisDrapeau");
              }
            }
          }
        }
      }
    }

    function gagnerPartie(){ //vérifier si le joueur a gagné
      var nbCasesTotal = (lignesTotal+1)*(colonnesTotal+1);
      var tmp = colonne;
      console.log(nbCasesTotal);
      var nbCasesCompletees = 0;
      for(var i = 0; i <= lignesTotal; i++){
        for(var j = 0; j <= colonnesTotal; j++){
          colonne = document.querySelector(".cell_"+i+"_"+j);
          if(colonne.classList.contains("mine")){
            if(colonne.classList.contains("noflag")){
              //rien
            }
            else{
              nbCasesCompletees++;
            }
          }
          else{
            if(colonne.classList.contains("noflag")){
              if(colonne.classList.contains("hidden")){
                //rien
              }
              if(colonne.classList.contains("show")){
                nbCasesCompletees++;
              }
            }
          }
        }
      }
      console.log(nbCasesCompletees);
      if(nbCasesCompletees == nbCasesTotal){
        win=true;
        clearInterval(timer);
        document.getElementById("nombreMines").innerHTML="<img src=\"img/mine.png\" alt=\"mines\"> = Vous avez gagné";
        document.getElementById("game").style.border="10px solid lime";
        document.getElementById("nombreMines").style.background="lime";
        document.getElementById("nombreMines").style.color="black";
        document.getElementById("chronometre").style.background="lime";
        document.getElementById("chronometre").style.color="black";
      }
      colonne = tmp;
    }

    function openCell(){ //ouvrir une cellule
      if(colonne.classList.contains("hidden") && colonne.classList.contains("noflag")){
        console.log("case "+i+", "+j);
        colonne.classList.remove("hidden");
        colonne.classList.add("show");
        if (colonne.classList.contains("mine")){ //si on clique sur une mine
          gameover = true;
          clearInterval(timer);
          document.getElementById("chrono").innerHTML="";
          document.getElementById("game").style.border="10px solid red";
          document.getElementById("nombreMines").style.background="red";
          document.getElementById("nombreMines").style.color="white";
          document.getElementById("chronometre").style.background="red";
          document.getElementById("chronometre").style.color="white";
          finDePartie();
          document.getElementById("nombreMines").innerHTML="<img src=\"img/mine.png\" alt=\"mines\"> = Vous avez perdu";
        }
        else{
          var compteur = 0;
          nombreCases();
          gagnerPartie();
        }
      }
    };

  };

  var hour = 0;
  var min = 0;
  var sec = 0;
  min = "0"+min;
  hour = "0"+hour;
  function chronometre(){
    sec++;
    if (sec < 10) {
      sec = "0"+sec;
    }

    if (sec > 59){
      sec = 0;
      sec = "0"+sec;
      min++;
      if (min < 10) {
        min = "0"+min;
      }
    }
    if (min > 59){
      min = 0;
      min = "0"+min;
      hour++;
      if (hour < 10) {
        hour = "0"+hour;
      }
    }

    document.getElementById("chrono").innerHTML = hour+":"+min+":"+sec;

  }

  const resetMatrice = function resetMatrice() {
    document.getElementById("game").innerHTML="";
  };



  const dessinerMatrice = function dessinerMatrice(lignes, colonnes, niveau) { //dessine la grille
    gameover = false;
    win=false;
    clearInterval(timer);
    hour = 0;
    min = 0;
    sec = 0;
    min = "0"+min;
    hour = "0"+hour;
    timer = window.setInterval(chronometre, 1000);
    document.getElementById("nombreMines").style.background="blue";
    document.getElementById("nombreMines").style.color="white";
    document.getElementById("chronometre").style.background="blue";
    document.getElementById("chronometre").style.color="white";
    document.getElementById("game").style.border="10px solid blue";
    var nbLignes = document.getElementById("nb_lignes");
    var nbColonnes = document.getElementById("nb_colonnes");
    var nbLevel = document.getElementById("nb_level");

    nbLignes.oninput = function modifierLignes() {
      resetMatrice();
      dessinerMatrice(nbLignes.value, nbColonnes.value, nbLevel.value);
      document.getElementById("nLigne").innerHTML = nbLignes.value;
    };

    nbColonnes.oninput = function modifierColonnes() {
      resetMatrice();
      dessinerMatrice(nbLignes.value, nbColonnes.value, nbLevel.value);
      document.getElementById("nColonne").innerHTML = nbColonnes.value;
    };

    nbLevel.oninput = function modifierLevel(){
      resetMatrice();
      dessinerMatrice(nbLignes.value, nbColonnes.value, nbLevel.value);
      if (nbLevel.value==1) document.getElementById("nLevel").innerHTML = "<img src=\"img/stars1.png\" width=\"250px\" height=\"25px\" alt=\"1\">";
      if (nbLevel.value==2) document.getElementById("nLevel").innerHTML = "<img src=\"img/stars2.png\" width=\"250px\" height=\"25px\" alt=\"2\">";
      if (nbLevel.value==3) document.getElementById("nLevel").innerHTML = "<img src=\"img/stars3.png\" width=\"250px\" height=\"25px\" alt=\"3\">";
      if (nbLevel.value==4) document.getElementById("nLevel").innerHTML = "<img src=\"img/stars4.png\" width=\"250px\" height=\"25px\" alt=\"4\">";
      if (nbLevel.value==5) document.getElementById("nLevel").innerHTML = "<img src=\"img/stars5.png\" width=\"250px\" height=\"25px\" alt=\"5\">";
      if (nbLevel.value==6) document.getElementById("nLevel").innerHTML = "<img src=\"img/stars6.png\" width=\"250px\" height=\"25px\" alt=\"6\">";
      if (nbLevel.value==7) document.getElementById("nLevel").innerHTML = "<img src=\"img/stars7.png\" width=\"250px\" height=\"25px\" alt=\"7\">";
      if (nbLevel.value==8) document.getElementById("nLevel").innerHTML = "<img src=\"img/stars8.png\" width=\"250px\" height=\"25px\" alt=\"8\">";
      if (nbLevel.value==9) document.getElementById("nLevel").innerHTML = "<img src=\"img/stars9.png\" width=\"250px\" height=\"25px\" alt=\"9\">";
      if (nbLevel.value==10) document.getElementById("nLevel").innerHTML = "<img src=\"img/stars10.png\" width=\"250px\" height=\"25px\" alt=\"10\">";
    };

    nbMines=0;
    nbMinesATrouver = 0;
    //boucles for imbriquées pour insérer lignes et colonnes
    lignesTotal = lignes-1;
    colonnesTotal = colonnes-1;
    for (var i = 0; i < lignes; i++) {
      let nouvelleLigne = insererLigne();
      for (var j = 0; j < colonnes; j++) {
        insererColonne(nouvelleLigne, i, j, nbLevel.value);
      }
    }
  };




  return dessinerMatrice;


}());

window.addEventListener("DOMContentLoaded", function init() {
  demineur();
});
