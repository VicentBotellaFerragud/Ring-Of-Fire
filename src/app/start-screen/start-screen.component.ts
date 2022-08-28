import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogJoinGameComponent } from '../dialog-join-game/dialog-join-game.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit, OnDestroy {

  showContent: boolean;

  redirectingUser: boolean = false;

  displayBtn: boolean;

  destroy = new Subject();

  constructor(private firestore: AngularFirestore, private router: Router, public dialog: MatDialog) { }

  /**
   * Gets all the games from the firestore database and sets the displayBtn variable to "true" or "false" depending on whether there's
   * already one game (at least) in the firestore database or not.
   */
  ngOnInit(): void {

    this.firestore.collection('games').valueChanges().pipe(takeUntil(this.destroy)).subscribe((games: any) => {

      !games || games.length === 0 || this.redirectingUser ? this.displayBtn = false : this.displayBtn = true;

      //The content is displayed once all games have been retrieved from the firestore database.
      this.showContent = true;

    });

  }

  /**
   * Creates a new game in the firestore database and navigates the player to it.
   */
  newGame() {

    //This variable is set to "true" so that the "Or join a game" button is not displayed during the milliseconds that the game takes to 
    //redirect the player to his/her new game. If this variable wasn't set to true, this button would be displayed for a brief moment,
    //because it is displayed if there's a game (or more) in the firestore database and, after the player has clicked the "Start game" 
    //button, a new game is created in the firestore database).
    this.redirectingUser = true;

    let game = new Game();

    this.firestore.collection('games').add(game.toJson()).then((gameInfo: any) => {

      this.router.navigateByUrl('/game/' + gameInfo.id);

    });

  }

  /**
   * Opens the DialogJoinGameComponent.
   */
  joinGame() {

    this.dialog.open(DialogJoinGameComponent);

  }

  /**
   * Sets the local variable "destroy" to "true" so that all observables in the component are unsubscribed when this is "destroyed".
   */
  ngOnDestroy(): void {

    this.destroy.next(true);

  }

}