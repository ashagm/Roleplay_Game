$(document).ready(function(){

const charactersArray = [
	{
		name: 'rama',
		healthPoints: 180,
		attackPower: 6,
		counterAttackPower: 10
	},

	{
		name: 'ravana',
		healthPoints: 150,
		attackPower: 4,
		counterAttackPower: 8
	},

	{
		name: 'kumbakarna',
		healthPoints: 100,
		attackPower: 3,
		counterAttackPower: 9
	},

	{
		name:'atikaya',
		healthPoints: 80,
		attackPower: 2,
		counterAttackPower: 6
	}

];

/*--- Warrior Object---*/

var warrior = {
	name : '',//test
	healthPoints : 0,
	attackPower  : 0,
	baseAttackPower : 0,
	isDefeated : false,
	
	// object to store the current defender
	currentDefender:{},

	updateWarrior : function(warriorObj){
		//get the relevant values from the pass warrior object
		this.name = warriorObj.name;//test
		this.healthPoints = warriorObj.healthPoints;
		this.baseAttackPower = warriorObj.attackPower;
		this.attackPower = this.baseAttackPower;	
	},

	//warrior knows who the enemy is?
	setDefender: function(defenderObj){
		this.currentDefender = defenderObj;
	},

	launchAttack : function(){		
		// let defenderCounterAttackPower = this.currentDefender.defendAttack(this.attackPower);
		console.log("Your attack power is now = ", this.attackPower);

		let defenderCounterAttackPower = defender.defendAttack(this.attackPower);

		this.healthPoints -= defenderCounterAttackPower; //decrement healthpoints
		this.attackPower += this.baseAttackPower; //double attackpower 4,8, 12, 16 etc
		
		if(this.healthPoints <= 0){
			this.isDefeated = true;
		}

	},

	isWarriorDefeated: function(){
		return this.isDefeated;
	},

	isDefenderDefeated: function(){
		// return this.currentDefender.isDefeated;
		return defender.isDefeated();
	},

	reset: function(){
		name = "";
		healthPoints = 0;
		attackPower = 0;
		isDefeated = false;
	}
}

/*--- Defender Object---*/

var defender = {
	name: '', //test
	healthPoints : 0,
	counterAttackPower : 0,
	isDefenderDefeated : false,

	updateDefender : function(defenderObj){
		//get the relevant values from the pass warrior object
		this.name = defenderObj.name;//test
		this.healthPoints = defenderObj.healthPoints;
		this.counterAttackPower = defenderObj.counterAttackPower;	
	},

	defendAttack : function(attackPoints){
		//decrement health points
		this.healthPoints -= attackPoints;

		if(this.healthPoints <= 0){
			this.isDefenderDefeated = true;
		}

		return this.counterAttackPower;
	},

	isDefeated : function(){
		return this.isDefenderDefeated;
	},

	reset: function(){
		this.name = '';//test
		this.healthPoints = 0;
		this.counterAttackPower = 0;
		this.isDefenderDefeated = false;
	}
}

/*--- Referee Object---*/

var gameReferee = {
	isWarriorChosen : false,
	isDefenderChosen : false,

	currentWarrior : {}, //todo-how to use these?
	currentDefender : {}, //todo- how to use these?

	defeatedDefendersCount : 0,

	//method to set the current warrior
	loadCurrentWarrior : function(chosenWarrior){
		this.isWarriorChosen = true;
		this.currentWarrior = chosenWarrior;
		// this.currentWarrior.updateWarrior(chosenWarrior);
		warrior.updateWarrior(chosenWarrior);
	},

	//method to set the current defender in the warrior object
	loadCurrentDefender : function(chosenDefender){
		this.isDefenderChosen = true;
		this.currentDefender = chosenDefender;
		defender.updateDefender(chosenDefender);
		warrior.setDefender(chosenDefender);
	},

	//keep checking for the status of warrior and defender
	checkGameStatus : function(){

		if(warrior.isWarriorDefeated()){
			$("#" + warrior.name).hide('slow');
			this.isWarriorChosen = false;
			this.isDefenderChosen = false;
			return "warrior";

		}else if(warrior.isDefenderDefeated()){
			this.defeatedDefendersCount++;

			$("#" + defender.name).hide('slow');
			this.isDefenderChosen = false;
			defender.reset();

			return "defender";

		}
	},

	//launch attack
	warriorAttack: function(){
		// this.currentWarrior.launchAttack(); //todo: why not working?
		warrior.launchAttack();
	},

	initGame : function(){
		this.resetGame();

		$.each(charactersArray, function( i, val ) {
  			$( "#fig-" + (val.name)).html(val.healthPoints);
		});		
	},

	resetGame : function(){
		this.isWarriorChosen = false;
		this.isDefenderChosen = false;
		this.currentWarrior = {}; //todo
		this.currentDefender = {};	//todo	
		warrior.reset();
		defender.reset();
	}

}

//when the warrior or defender are chosen

$('.char-image').on('click', function(){
	sound('select');

	let characterChosen = $(this).data("name");

	if(!gameReferee.isWarriorChosen){
		$(this).css("border", "5px solid #00FF00");
		$(this).appendTo('#div-warrior');

		$(charactersArray).filter(function(){
			if(characterChosen === this.name){
				gameReferee.loadCurrentWarrior(this);
			}
		});		
	}else if(!gameReferee.isDefenderChosen){	
		$(this).css("border", "5px solid #FF0000");
		$(this).appendTo('#div-defender');
		$('#btn-attack').removeAttr('disabled');

		$(charactersArray).filter(function(){
			if(characterChosen === this.name){
				gameReferee.loadCurrentDefender(this);
			}
		});			
	}else{
		alert("The game is on...wait.")
	}
});

$("#btn-attack").on('click', function(){
	sound('attack');

	gameReferee.warriorAttack();

	let warriorName = warrior.name;
	let defenderName = defender.name;


	$("#fig-" + (warriorName)).html(warrior.healthPoints);
	$("#fig-" + (defender.name)).html(defender.healthPoints);

	updateStatus("You attacked " + defenderName + " with " + warrior.attackPower + " warrior power!! " + "<br>"
		+ defender.name + " attacked you back with " + defender.counterAttackPower + " defender power!!", "white");
	
	let defeated = gameReferee.checkGameStatus();

	if(defeated === "warrior"){
		$('#btn-attack').attr('disabled', 'disabled');
		updateStatus('You got defeated by ' + defenderName + '!', 'red' );
		sound('win');
		$('#btn-reset').show();
		gameReferee.resetGame();

	}else if (defeated === "defender"){
		$('#btn-attack').attr('disabled', 'disabled');
		defender.reset();

		if(gameReferee.defeatedDefendersCount < (charactersArray.length - 1))
		{
			updateStatus('You defeated ' + defenderName + '!' + ' Pick another Defender!', 'yellow' );
			sound('win');	
		}else{
			updateStatus('VICTORY!! You ' + warriorName + ' defeateded all your opponents!!', '#006400');
			sound('victory');
			$('#btn-reset').show();
		}		
	}

});

//restart game
$("#btn-reset").on('click', function(){
	location.reload(); //quick-fix only!! Have to find a better way
});

//start game
gameReferee.initGame();

function updateStatus(status, color){
	$("#status-attack").html(status);
	$("#status-attack").css("color", color);
}

/******backgrounds slideshow ******/ //stackoverflow to the rescue!! 

$(function() {
var body = $('body');
var backgrounds = new Array(
'url("assets/images/Ramayana-bg.jpg")',
'url("assets/images/Ramayana-bg2.jpg")',
'url("assets/images/Ramayana-bg3.jpg")',
'url("assets/images/Ramayana-bg4.jpg")',
'url("assets/images/Ramayana-bg5.jpg")',
'url("assets/images/Ramayana-bg6.jpg")',
'url("assets/images/Ramayana-bg7.jpg")',
'url("assets/images/Ramayana-bg8.jpg")',
'url("assets/images/Ramayana-bg9.jpg")',
'url("assets/images/Ramayana-bg10.jpg")',
'url("assets/images/Ramayana-bg11.jpg")',
'url("assets/images/Ramayana-bg14.jpg")',
'url("assets/images/Ramayana-bg15.jpg")',
'url("assets/images/Ramayana-bg16.jpg")'
);

var current = 0;

function nextBackground() {
	body.css(
	'background',
	 backgrounds[current = ++current % backgrounds.length]
	);

	body.css('background-size',  'cover');

	setTimeout(nextBackground, 5000);
}

setTimeout(nextBackground, 10000);
body.css('background', backgrounds[0]);
body.css('background-size',  'cover');

});

/****sounds******/

function sound(str){
    var audio = document.createElement("audio");
    if(str ==="attack"){
    	audio.src = "assets/sounds/attack.wav";
	}else if(str === "select"){
		audio.src = "assets/sounds/select.wav";
	}else if(str === "win"){
		audio.src = "assets/sounds/win.wav";
	}else if(str === "victory"){
		audio.src = "assets/sounds/victory.wav";
	}
    audio.play();   
}

$('#btn-bg-sound').on('click', function(){
	console.log('clicked');
	var source = "assets/sounds/war.mp3";

	if($('#sound').attr('src') === source){
		$('#sound').attr('src', " ");
	}else{
		$('#sound').attr('src', source)
	}

});


});