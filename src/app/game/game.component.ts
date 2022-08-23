import { Component, OnChanges, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { EditPlayerComponent } from '../edit-player/edit-player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  game!: Game;
  gameId: string;

  constructor(private route: ActivatedRoute, private firestore: AngularFirestore, public dialog: MatDialog) { }

  /**
   * This function, called at the start of the game, calls the function "newGame()" and connects all the variables of the "game" class to 
   * the firestore.
   */
  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      this.firestore.collection('games').doc(this.gameId).valueChanges().subscribe((game: any) => {
        this.game.currentPlayer = game.currentPlayer;
        this.game.playerImages = game.playerImages;
        this.game.playedCards = game.playedCards;
        this.game.players = game.players;
        this.game.stack = game.stack;
        this.game.pickCardAnimation = game.pickCardAnimation;
        this.game.currentCard = game.currentCard;
      });
    });
  }

  /**
   * This function, called at the start of the game, connects the "game" class to this component.
   */
  newGame() {
    this.game = new Game;
  }

  /**
   * This function, called each time the player clicks on the stack of cards, removes a card from the stack, updates the variables 
   * "pickCardAnimation" and "currentPlayer" and adds the card the player has clicked on to the array "playedCards". It also calls the 
   * "saveGame()" function to save the changes the player makes and the "displayStackAgain()" function.
   */
  takeCard() {
    if (!this.game.pickCardAnimation && this.game.players.length > 0) {
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;
      this.saveGame();
    }
    if (this.game.players.length > 0) {
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.saveGame();
    }
    if (this.game.players.length == 0) {
      alert('Add at least one player to start the game.');
    }
    setTimeout(() => {
      if (this.game.players.length > 0) {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.displayStackAgain();
        this.saveGame();
      }
    }, 1000);
  }

  /**
   * This function, only called when there are no cards left in the stack, resets the variables of the "game" class and adds 52 cards 
   * back to the stack so that the game can be played again.
   */
  displayStackAgain() {
    if (this.game.playedCards.length == 52) {
      alert('Congratulations, you have completed the game. If you want to play again, click on the "okay" button in this alert');
      this.game.players = [];
      this.game.playerImages = [];
      this.game.stack = [];
      this.game.playedCards = [];
      this.game.currentPlayer = 0;
      this.game.pickCardAnimation = false;
      this.game.currentCard = '';
      for (let i = 1; i < 14; i++) {
        this.game.stack.push('spade_' + i);
        this.game.stack.push('hearts_' + i);
        this.game.stack.push('clubs_' + i);
        this.game.stack.push('diamonds_' + i);
      }
    }
  }

  /**
   * This function, called when the player clicks on any player's name or avatar, opens a dialogue box with different images from which 
   * the player can choose to have as avatar. Clicking on any of these images will change the player's profile picture to that image. 
   * If, on the contrary, the "Delete player" button is clicked, both the picture and the player's name will be removed from the "player" 
   * and "playerImages" arrays and, of course, from the screen. Finally the function "saveGame()" is called to save the changes.
   * @param playerId - This is the id of the player and the picture that are about to be removed or edited (although only the picture
   * can be edited).
   */
  editPlayer(playerId: number) {
    const dialogRef = this.dialog.open(EditPlayerComponent);
    dialogRef.afterClosed().subscribe((change: string) => {
      if (change) {
        if (change == 'DELETE') {
          this.game.players.splice(playerId, 1);
          this.game.playerImages.splice(playerId, 1);
        } else {
          this.game.playerImages[playerId] = change;
        }
        this.saveGame();
      }
    });
  }

  /**
   * This function, called when the player clicks on the "+" button, opens a dialogue box with an input to be filled in by the player. 
   * When the player fills in the field with a name and clicks on "Ok" the name is added to the array "players" and appears on the screen. 
   * If the name is longer than 11 characters it is not added to the array and therefore will not appear on the screen. Finally the function
   * "saveGame()" is called to save the changes.
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0 && name.length < 12) {
        this.game.players.push(name);
        this.game.playerImages.push('young-man.png');
        this.saveGame();
      }
      if (name.length > 11) {
        alert("We are sorry, but the player's name cannot be longer than 11 characters.");
      }
    });
  }

  /**
   * This function, called every time a change is made to the web site, saves the change.
   */
  saveGame() {
    this.firestore.collection('games').doc(this.gameId).update(this.game.toJson());
  }
  
}


