$(document).ready(function(){

const charactersArray = [
	{
		name: 'rama',
		healthPoints: 160,
		attackPower: 10,
		counterAttackPower: 20
	},

	{
		name: 'ravana',
		healthPoints: 130,
		attackPower: 15,
		counterAttackPower: 10
	},

	{
		name: 'kumbakarna',
		healthPoints: 180,
		attackPower: 7,
		counterAttackPower: 5
	},

	{
		name:'atikaya',
		healthPoints: 112,
		attackPower: 10,
		counterAttackPower: 3
	}

];

/*--- Warrior Object---*/

var warrior = {
	name : '',//test
	healthPoints : 0,
	attackPower  : 0,
	isDefeated : false,
	
	// object to store the current defender
	currentDefender:{},

	updateWarrior : function(warriorObj){
		//get the relevant values from the pass warrior object
		this.name = warriorObj.name;//test
		this.healthPoints = warriorObj.healthPoints;
		this.attackPower = warriorObj.attackPower;	
	},

	//warrior knows who the enemy is?
	setDefender: function(defenderObj){
		this.currentDefender = defenderObj;
	},

	//create attack method which calls the current defenders attacked method
	//based on the return value, decrement the health points and updates attack 
	//points

	launchAttack : function(){		
		// let defenderCounterAttackPower = this.currentDefender.defendAttack(this.attackPower);

		let defenderCounterAttackPower = defender.defendAttack(this.attackPower);

		this.healthPoints -= defenderCounterAttackPower; //decrement healthpoints
		this.attackPower += this.attackPower; //double attackpower 4,8, 12, 16 etc

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

	//create attacked() method that passes the number of attack points
	//which decrements the defenders health point.This returns the 
	//counter attack points back to the calling method

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

	currentWarrior : {},
	currentDefender : {},
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

	checkGameStatus : function(){

		let whoDefeated = "";

		if(warrior.isWarriorDefeated()){
			return "warrior";
			//game over
			//reset game
		}else if(warrior.isDefenderDefeated()){
			this.defeatedDefendersCount++;

			$("#" + defender.name).hide('slow');
			defender.reset();

			return "defender";
			//get next defender
			//continue attack	

		}
	},

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
		this.currentWarrior = {};
		this.currentDefender = {};	
		$('#btn-reset').hide();
		warrior.reset();
		defender.reset();
	}

	// event method that gets called when user presses the attack button
	// inturn calls the warrior.attack. Keep calling the warrior attack()
	// until the defender is defeated. If the warrior is defated, reset game
	// if the defender is defeated, wait until the next defender is chosen 
	// If all the defenders are defeated,then end game.

}

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
	}else{	
		$(this).css("border", "5px solid #FF0000");
		$(this).appendTo('#div-defender');
		$('#btn-attack').removeAttr('disabled');

		$(charactersArray).filter(function(){
			if(characterChosen === this.name){
				gameReferee.loadCurrentDefender(this);
			}
		});			
	}
});

$("#btn-attack").on('click', function(){
	sound('attack');

	gameReferee.warriorAttack();

	let warriorName = warrior.name;
	let defenderName = defender.name;


	$("#fig-" + (warriorName)).html(warrior.healthPoints);
	$("#fig-" + (defender.name)).html(defender.healthPoints);

	updateStatus("You attacked " + defenderName + " with " + warrior.attackPower + " warrior power!! " + 
		defender.name + " attacked you back with " + defender.counterAttackPower + " defender power!!", "red");
	
	let defeated = gameReferee.checkGameStatus();

	if(defeated === "warrior"){
		$('#btn-attack').attr('disabled', 'disabled');
		$("#status-attack").html();
		gameReferee.resetGame();

	}else if (defeated === "defender"){
		$('#btn-attack').attr('disabled', 'disabled');
		defender.reset();

		if(gameReferee.defeatedDefendersCount < 3)
		{
			updateStatus('You defeated ' + defenderName + '!' + 'Pick another Defender!', 'green' );
				sound('win');	
		}else{
			updateStatus('VICTORY!! You ' + warriorName + ' defeateded all Enemies!', 'green');
			sound('victory');
			$('#btn-reset').show();
		}		
	}

});

$("#btn-reset").on('click', function(){
	location.reload(); //quick-fix only!! Have to find a better way

});

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
'url("assets/images/Ramayana-bg14.jpg")'
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

/****end of backgrounds*****/

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


});