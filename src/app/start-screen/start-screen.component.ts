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

  showContent: boolean = false;

  displayBtn: boolean;
  
  destroy = new Subject();

  constructor(private firestore: AngularFirestore, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {

    this.firestore.collection('games').valueChanges().pipe(takeUntil(this.destroy)).subscribe((games: any) => {

      !games || games.length === 0 ? this.displayBtn = false : this.displayBtn = true;

      this.showContent = true;

    });

  }

  /**
   * Creates a new game in the firestore database and navigates the player to it.
   */
  newGame() {

    let game = new Game();

    this.firestore.collection('games').add(game.toJson()).then((gameInfo: any) => {

      this.router.navigateByUrl('/game/' + gameInfo.id);

      this.showContent = false;

    });

  }

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