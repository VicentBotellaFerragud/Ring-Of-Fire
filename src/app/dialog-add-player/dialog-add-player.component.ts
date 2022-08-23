import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-add-player',
  templateUrl: './dialog-add-player.component.html',
  styleUrls: ['./dialog-add-player.component.scss']
})
export class DialogAddPlayerComponent implements OnInit {

  name: string = '';

  constructor(public dialogRef: MatDialogRef<DialogAddPlayerComponent>) {}

  ngOnInit(): void {
  }

  /**
   * This function, called when the player clicks on "No Thanks", closes the dialogue box.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }
  
}
