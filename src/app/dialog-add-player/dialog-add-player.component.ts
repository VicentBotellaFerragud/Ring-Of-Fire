import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-add-player',
  templateUrl: './dialog-add-player.component.html',
  styleUrls: ['./dialog-add-player.component.scss']
})
export class DialogAddPlayerComponent implements OnInit {

  name: string = '';

  constructor(public dialogRef: MatDialogRef<DialogAddPlayerComponent>) {}

  ngOnInit(): void { }

  /**
   * Closes the dialogue box when the player clicks the "No Thanks" button.
   */
  onNoClick(): void {

    this.dialogRef.close();

  }
  
}