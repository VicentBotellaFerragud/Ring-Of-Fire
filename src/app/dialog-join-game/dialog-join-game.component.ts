import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dialog-join-game',
  templateUrl: './dialog-join-game.component.html',
  styleUrls: ['./dialog-join-game.component.scss']
})
export class DialogJoinGameComponent implements OnInit, OnDestroy {

  gameCode: string = '';

  idsCollection: string[] = [];

  destroy = new Subject();

  constructor(public dialogRef: MatDialogRef<DialogJoinGameComponent>, private firestore: AngularFirestore, private router: Router) { }

  ngOnInit(): void { }

  /**
   * Closes the dialogue box when the player clicks the "No Thanks" button.
   */
  onNoClick(): void {

    this.dialogRef.close();

  }

  joinGame() {

    this.firestore.collection('games').valueChanges({ idField: 'customIdName' }).pipe(takeUntil(this.destroy)).subscribe((games: any) => {
      
      games.forEach(game => {
        
        this.idsCollection.push(game.customIdName);

      });

      let index = this.idsCollection.indexOf(this.gameCode);

      index === -1 ? alert('The game you would like to join does not exist') : this.router.navigateByUrl('/game/' + this.gameCode);

      this.dialogRef.close();

    });

  }

  /**
   * Sets the local variable "destroy" to "true" so that all observables in the component are unsubscribed when this is "destroyed".
   */
  ngOnDestroy(): void {

    this.destroy.next(true);

  }

}