# RolePlay_Game

RPG game with HTML5, CSS3, Bootstrap4, Javascript, Jquery


* When the game starts, the player will choose a character by clicking on a character picture. The player will fight as that character for the rest of the game.

* The player must then defeat all of the remaining fighters. 

* Once the player selects a warrior, that enemy is moved to a `warrior area`.

* The player chooses a defending opponement by clicking on a character picture.

* Once the player selects an opponent, that enemy is moved to a `defender area`.

* The player will now be able to click the `attack` button.
* Whenever the player clicks `attack`, their character damages the defender. The opponent will lose `HP` (health points). These points are displayed at the bottom of the defender's picture. 
* The opponent character will instantly counter the attack. When that happens, the player's character will lose some of their `HP`. These points are shown at the bottom of the player character's picture.

* The player will keep hitting the attack button in an effort to defeat their opponent.

* When the defender's `HP` is reduced to zero or below, he gets removed from the `defender area`. The player character can now choose a new defender.

* The player wins the game by defeating all defenders. The player loses the game the game if their character's `HP` falls to zero or below.


##### More about the game

* Each character in the game has 3 attributes: `Health Points`, `Attack Power` and `Counter Attack Power`.

* Each time the player attacks, their character's Attack Power increases by its base Attack Power. 
  * For example, if the base Attack Power is 6, each attack will increase the Attack Power by 6 (12, 18, 24, 30 and so on).
* The defender enemy character only has `Counter Attack Power`. 

* Unlike the player's `Attack Points`, `Counter Attack Power` never changes.

* The `Health Points`, `Attack Power` and `Counter Attack Power` of each character differs.

* No characters in the game can heal or recover Health Points. 

* A winning player must pick their characters wisely by first fighting an enemy with low `Counter Attack Power`. This will allow them to grind `Attack Power` and to take on enemies before they lose all of their `Health Points`. 

* You should be able to win and lose the game no matter what character you choose. The challenge should come from picking the right enemies, not choosing the strongest player.
