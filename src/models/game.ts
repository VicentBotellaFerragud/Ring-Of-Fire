export class Game {

    public players: string[] = [];
    public playerImages: string[] = [];
    public stack: string[] = [];
    public playedCards: string[] = [];
    public currentPlayer: number = 0;
    public pickCardAnimation = false;
    public currentCard: string = '';

    constructor() {

        //Fills the stack.
        for (let i = 1; i < 14; i++) {

            this.stack.push('spade_' + i);
            this.stack.push('hearts_' + i);
            this.stack.push('clubs_' + i);
            this.stack.push('diamonds_' + i);

        }

        //Randomly shuffles the stack.
        shuffle(this.stack);

    }

    //Returns the game class in json format.
    public toJson() {

        return {

            players: this.players,
            playerImages: this.playerImages,
            stack: this.stack,
            playedCards: this.playedCards,
            currentPlayer: this.currentPlayer,
            pickCardAnimation: this.pickCardAnimation,
            currentCard: this.currentCard,

        };

    }

}

/**
 * Randomly shuffles the cards in the stack.
 * @param array - This is the passed-in array (the array whose elements are going to be randomly sorted).
 * @returns - the passed-in array with the same elements but in a different order.
 */
function shuffle(array: string[]) {

    let currentIndex = array.length;
    let randomIndex: number;

    while (currentIndex !== 0) {

        //Gets a random number for the randomIndex variable.
        randomIndex = Math.floor(Math.random() * currentIndex);

        //Decreases by one the currentIndex variable.
        currentIndex--;

        //Swaps elements. The element with index "currentIndex" replaces the element with index "randomIndex" and the element with index 
        //"randomIndex" replaces the element with index "currentIndex" (in the passed-in array).
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];

    }

    return array;

}