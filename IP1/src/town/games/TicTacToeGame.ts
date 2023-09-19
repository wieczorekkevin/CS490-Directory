import InvalidParametersError, {
  MOVE_NOT_YOUR_TURN_MESSAGE,
  GAME_NOT_IN_PROGRESS_MESSAGE,
  PLAYER_ALREADY_IN_GAME_MESSAGE,
  GAME_FULL_MESSAGE,
  PLAYER_NOT_IN_GAME_MESSAGE,
  BOARD_POSITION_NOT_EMPTY_MESSAGE,
} from '../../lib/InvalidParametersError';
import Player from '../../lib/Player';
import { GameMove, PlayerID, TicTacToeGameState, TicTacToeMove } from '../../types/CoveyTownSocket';
import Game from './Game';

/**
 * A TicTacToeGame is a Game that implements the rules of Tic Tac Toe.
 * @see https://en.wikipedia.org/wiki/Tic-tac-toe
 */
export default class TicTacToeGame extends Game<TicTacToeGameState, TicTacToeMove> {
  public constructor() {
    super({
      moves: [],
      status: 'WAITING_TO_START',
    });
  }

  /*
   * Applies a player's move to the game.
   * Uses the player's ID to determine which game piece they are using (ignores move.gamePiece)
   * Validates the move before applying it. If the move is invalid, throws an InvalidParametersError with
   * the error message specified below.
   * A move is invalid if:
   *    - The move is on a space that is already occupied (use BOARD_POSITION_NOT_EMPTY_MESSAGE)
   *    - The move is not the player's turn (MOVE_NOT_YOUR_TURN_MESSAGE)
   *    - The game is not in progress (GAME_NOT_IN_PROGRESS_MESSAGE)
   *
   * If the move is valid, applies the move to the game and updates the game state.
   *
   * If the move ends the game, updates the game's state.
   * If the move results in a tie, updates the game's state to set the status to OVER and sets winner to undefined.
   * If the move results in a win, updates the game's state to set the status to OVER and sets the winner to the player who made the move.
   * A player wins if they have 3 in a row (horizontally, vertically, or diagonally).
   *
   * @param move The move to apply to the game
   * @throws InvalidParametersError if the move is invalid (with specific message noted above)
   */
  public applyMove(move: GameMove<TicTacToeMove>): void {
    let expectedPlayerID: PlayerID | undefined;

    if (move.move.gamePiece === 'X') {
      expectedPlayerID = this.state.x;
    } else if (move.move.gamePiece === 'O') {
      expectedPlayerID = this.state.o;
    }

    if (this.state.status !== 'IN_PROGRESS') {
      throw new InvalidParametersError(GAME_NOT_IN_PROGRESS_MESSAGE);
    } else if (move.playerID !== expectedPlayerID) {
      throw new InvalidParametersError(MOVE_NOT_YOUR_TURN_MESSAGE);
    }

    let newSetOfMoves: TicTacToeMove[] = [];
    if (this.state.moves.length === 0) {
      newSetOfMoves.push(move.move);
    } else {
      for (let i = 0; i < this.state.moves.length; i += 1) {
        if ((move.move.col === this.state.moves[i].col) && (move.move.row === this.state.moves[i].row)) {
          throw new InvalidParametersError(BOARD_POSITION_NOT_EMPTY_MESSAGE);
        }
        else {
          newSetOfMoves.push(this.state.moves[i]);
        }
      }
      newSetOfMoves.push(move.move);
      
    }
    this.state.moves = newSetOfMoves;
  }

  /**
   * Adds a player to the game.
   * Updates the game's state to reflect the new player.
   * If the game is now full (has two players), updates the game's state to set the status to IN_PROGRESS.
   *
   * @param player The player to join the game
   * @throws InvalidParametersError if the player is already in the game (PLAYER_ALREADY_IN_GAME_MESSAGE)
   *  or the game is full (GAME_FULL_MESSAGE)
   */
  public _join(player: Player): void {
    if (player.id === this.state.x || player.id === this.state.o) {
      throw new InvalidParametersError(PLAYER_ALREADY_IN_GAME_MESSAGE);
    } else if (this.state.x !== undefined && this.state.o !== undefined) {
      throw new InvalidParametersError(GAME_FULL_MESSAGE);
    } else {
      if (this.state.x === undefined) {
        this.state.x = player.id;
      } else if (this.state.o === undefined) {
        this.state.o = player.id;
      }
      this._players.push(player);
      if (this.state.x !== undefined && this.state.o !== undefined) {
        this.state.status = 'IN_PROGRESS';
      } else {
        this.state.status = 'WAITING_TO_START';
      }
    }
  }

  /**
   * Removes a player from the game.
   * Updates the game's state to reflect the player leaving.
   * If the game has two players in it at the time of call to this method,
   *   updates the game's status to OVER and sets the winner to the other player.
   * If the game does not yet have two players in it at the time of call to this method,
   *   updates the game's status to WAITING_TO_START.
   *
   * @param player The player to remove from the game
   * @throws InvalidParametersError if the player is not in the game (PLAYER_NOT_IN_GAME_MESSAGE)
   */
  protected _leave(player: Player): void {
    const index = this._players.indexOf(player);

    if (this.state.x !== player.id && this.state.o !== player.id) {
      throw new InvalidParametersError(PLAYER_NOT_IN_GAME_MESSAGE);
    } else if (this.state.status === 'IN_PROGRESS') {
      if (this.state.x === player.id) {
        this.state.winner = this.state.o;
      } else if (this.state.o === player.id) {
        this.state.winner = this.state.x;
      }
      this._players.splice(index, 1);
      this.state.status = 'OVER';
    } else {
      this._players.splice(index, 1);
      this.state.status = 'WAITING_TO_START';
    }
  }
}
