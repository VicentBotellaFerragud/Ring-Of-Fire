import { Component, OnDestroy, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { EditPlayerComponent } from '../edit-player/edit-player.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

  game: Game = new Game();

  gameId: string;

  destroy = new Subject();

  constructor(private route: ActivatedRoute, private firestore: AngularFirestore, public dialog: MatDialog) { }

  /**
   * Gets the correponding game from the firestore database and assigns all its properties to the local variable game, which of course is 
   * of the same type (Game).
   */
  ngOnInit(): void {

    this.route.params.subscribe((params) => {

      //The route id is retrieved so that it can be used to get the desired game collection (the route id is also the game id).
      this.gameId = params['id'];

      this.firestore.collection('games').doc(this.gameId).valueChanges().pipe(takeUntil(this.destroy)).subscribe((game: Game) => {

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
   * Removes a card from the stack, updates the pickCardAnimation and currentPlayer variables and pushes the card the player has clicked on 
   * into the playedCards array. It also calls the saveGame and displayStackAgain functions.
   */
  takeCard() {

    //If the player clicks on a card without having added one player at least...
    if (this.game.players.length === 0) {

      //An alert is displayed.
      alert('Add at least one player to start the game.');

    }

    //If the card animation is not running and there is at least one player...
    if (!this.game.pickCardAnimation && this.game.players.length > 0) {

      this.game.currentCard = this.game.stack.pop();

      //The card animation is triggered.
      this.game.pickCardAnimation = true; 

      //The next player becomes the currentPlayer.
      this.game.currentPlayer++; 

      //When currentPlayer is going to exceed the number of players (- 1) this makes sure that the currentPlayer variable is assigned again 
      //to the first player.
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length; 

      //The changes are saved in the firestore database.
      this.saveGame();

    }

    //After one second...
    setTimeout(() => {

      //And also only if there is at least one player...
      if (this.game.players.length > 0) {

        //The clicked card is pushed into the playedCards array.
        this.game.playedCards.push(this.game.currentCard); 

        //The card animation is ended.
        this.game.pickCardAnimation = false; 

        //The displayStackAgain function is called in case the stack becomes empty.
        this.displayStackAgain(); 

        //The changes are saved in the firestore database.
        this.saveGame(); 

      }

    }, 1000);

  }

  /**
   * Displays an alert, resets all game properties and fills the card stack again... But only if the card stack is empty (meaning the 
   * playedCards array has reached a length of 52).
   */
  displayStackAgain() {

    if (this.game.playedCards.length === 52) {

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
   * Opens the EditPlayerComponent and, when the player closes it, it assigns to the clicked player the by-the-player-clicked picture.
   * @param playerId - This is the passed-in id (the id of the clicked player).
   */
  editPlayer(playerId: number) {

    //Opens the EditPlayerComponent.
    const dialogRef = this.dialog.open(EditPlayerComponent);

    //And when it closes...
    dialogRef.afterClosed().subscribe((action: string) => {

      //If the player has performed an action (meaning the player has either clicked the "delete" button or any picture within the 
      //EditPlayerComponent)...
      if (action) {

        //And this action was to click the "delete" button...
        if (action === 'DELETE') {

          //The player and his/her picture are removed from the players and playerImages arrays respectively.
          this.game.players.splice(playerId, 1);
          this.game.playerImages.splice(playerId, 1);

        //And this action was to click any of the pictures...
        } else {

          //The clicked picture becomes the new player avatar.
          this.game.playerImages[playerId] = action;

        }

        //The changes are saved in the firestore database.
        this.saveGame();

      }

    });

  }

  /**
   * Opens the DialogAddPlayerComponent and, when the player closes it, it adds a new player and a new picture to the players and
   * playerImages arrays respectively (but only if the player has entered a valid name -a name between 1 and 11 characters-).
   */
  openDialog(): void {

    //Opens the DialogAddPlayerComponent.
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    //And when it closes...
    dialogRef.afterClosed().subscribe((name: string) => {

      //If the by-the-player-entered name has more than 11 characters...
      if (name && name.length > 11) {

        //An alert is displayed.
        alert("We are sorry, but the player's name cannot be longer than 11 characters.");

      }

      //If the by-the-player-entered name has between 1 and 11 characters...
      if (name && name.length > 0 && name.length < 12) {

        //A new player and a new picture are pushed into the players and playerImages arrays respectively.
        this.game.players.push(name);
        this.game.playerImages.push('young-man.png');

        //The changes are saved in the firestore database.
        this.saveGame();

      }

    });

  }

  /**
   * Saves the changes in the firestore database.
   */
  saveGame() {

    this.firestore.collection('games').doc(this.gameId).update(this.game.toJson());

  }

  /**
   * Sets the local variable "destroy" to "true" so that all observables in the component are unsubscribed when this is "destroyed".
   */
  ngOnDestroy(): void {

    this.destroy.next(true);

  }

}