import Venusian from './Venusian';

export default class Ship {
  crew: Venusian[];

  daughters: Ship[];

  serialNum: number;

  static currentID = 1;

  constructor(passedCrew: Venusian[], passedDaughters: Ship[]) {
    Ship.currentID += 1;     // Guarantees unique ID
    this.serialNum = Ship.currentID;
    this.crew = [];

    for (let i = 0; i < passedCrew.length; i += 1) {
      this.crew[i] = passedCrew[i];
    }

    this.daughters = [];

    for (let i = 0; i < passedDaughters.length; i += 1) {
      this.daughters[i] = passedDaughters[i];
    }

  }

  // Public Methods
  getCrew() {
    return this.crew;
  }

  getDaughters() {
    return this.daughters;
  }

  getSerialNumber() {
    return this.serialNum;
  }

  hasWaldo() {
    for (let i = 0; i < this.crew.length; i += 1) {
      if (this.crew[i].getName() === 'Waldo') {
        return true;
      }
    }
    return false;
  }

  totalWaldos() {
    let count = 0;

    // Iterate over the first ship in the fleet
    for (let i = 0; i < this.crew.length; i += 1) {
      if (this.crew[i].getName() === 'Waldo') {
        count += 1;
      }
    }

    // Iterate over the daughter ships
    for (let j = 0; j < this.daughters.length; j += 1) {
      for (let k = 0; k < this.daughters[j].crew.length; k += 1) {
        if (this.daughters[j].crew[k].getName() === 'Waldo') {
          count += 1;
        }
      }
    }

    return count;
  }

  removeWaldos() {
    for (let i = 0; i < this.crew.length; i += 1) {
      if (this.crew[i].getName() === 'Waldo') {
        // Remove Waldo!
        this.crew.splice(i, 1);
      }
    }
  }

  removeDeepWaldos() {
    // First call removeWaldos to get rid of the Waldos in the current ship
    this.removeWaldos();

    // Iterate over the daughter ships, and get rid of those Waldos
    for (let j = 0; j < this.daughters.length; j += 1) {
      for (let k = 0; k < this.daughters[j].crew.length; k += 1) {
        this.daughters[j].removeWaldos();
      }
    }
  }

  fleetHasDuplicates() {
    const arrayID = [];

    // Check first ship of the fleet, store its ID into arrayID
    arrayID.push(this.getSerialNumber());

    // Iterate over the daughter ships, store new IDs into arrayID, return true once an ID is already in the array
    for (let j = 0; j < this.daughters.length; j += 1) {
      if (arrayID.indexOf(this.daughters[j].getSerialNumber()) > 0) {
        return true;
      }
            
      arrayID.push(this.daughters[j].getSerialNumber());
            
    }

    // If it exits the for loop, there were no duplicates!
    return false;
  }

}
