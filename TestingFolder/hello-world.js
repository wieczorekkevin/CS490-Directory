"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Venusian = /** @class */ (function () {
    function Venusian(name) {
        this.name = name;
        this.VSN = Venusian.currentID++; //Guarantees unique ID
    }
    //Public Methods
    Venusian.prototype.getName = function () {
        return this.name;
    };
    Venusian.prototype.getVsn = function () {
        return this.VSN;
    };
    Venusian.currentID = 1;
    return Venusian;
}());
var Ship = /** @class */ (function () {
    function Ship(passedCrew, passedDaughters) {
        this.serialNum = Ship.currentID++; //Guarantees unique ID
        this.crew = [];
        for (var i = 0; i < passedCrew.length; i++) {
            this.crew[i] = passedCrew[i];
        }
        this.daughters = [];
        for (var i = 0; i < passedDaughters.length; i++) {
            this.daughters[i] = passedDaughters[i];
        }
    }
    //Public Methods
    Ship.prototype.getCrew = function () {
        return this.crew;
    };
    Ship.prototype.getDaughters = function () {
        return this.daughters;
    };
    Ship.prototype.getSerialNumber = function () {
        return this.serialNum;
    };
    Ship.prototype.hasWaldo = function () {
        for (var i = 0; i < this.crew.length; i++) {
            if (this.crew[i].getName() == "Waldo") {
                return true;
            }
        }
        return false;
    };
    Ship.prototype.totalWaldos = function () {
        var count = 0;
        //Iterate over the first ship in the fleet
        for (var i = 0; i < this.crew.length; i++) {
            if (this.crew[i].getName() == "Waldo") {
                count += 1;
            }
        }
        //Iterate over the daughter ships
        for (var j = 0; j < this.daughters.length; j++) {
            for (var k = 0; k < this.daughters[j].crew.length; k++) {
                if (this.daughters[j].crew[k].getName() == "Waldo") {
                    count += 1;
                }
            }
        }
        return count;
    };
    Ship.prototype.removeWaldos = function () {
        for (var i = 0; i < this.crew.length; i++) {
            if (this.crew[i].getName() == "Waldo") {
                //Remove Waldo!
                this.crew.splice(i, 1);
            }
        }
    };
    Ship.prototype.removeDeepWaldos = function () {
        //First call removeWaldos to get rid of the Waldos in the current ship
        this.removeWaldos();
        //Iterate over the daughter ships, and get rid of those Waldos
        for (var j = 0; j < this.daughters.length; j++) {
            for (var k = 0; k < this.daughters[j].crew.length; k++) {
                this.daughters[j].removeWaldos();
            }
        }
    };
    Ship.prototype.fleetHasDuplicates = function () {
        var arrayID;
        arrayID = [];
        //Check first ship of the fleet, store its ID into arrayID
        arrayID.push(this.getSerialNumber());
        //Iterate over the daughter ships, store new IDs into arrayID, return true once an ID is already in the array
        for (var j = 0; j < this.daughters.length; j++) {
            if (arrayID.indexOf(this.daughters[j].getSerialNumber()) > 0) {
                return true;
            }
            else {
                arrayID.push(this.daughters[j].getSerialNumber());
            }
        }
        //If it exits the for loop, there were no duplicates!
        return false;
    };
    Ship.currentID = 1;
    return Ship;
}());
console.log('Hello, World!');
var greeting;
greeting = function (name) {
    return "Hi ".concat(name);
};
var maude = new Venusian('Maude');
var harold = new Venusian('Harold');
var Waldo1 = new Venusian('Waldo');
var Waldo2 = new Venusian('Waldo');
var ship1 = new Ship([], []);
var ship2 = new Ship([maude, harold, Waldo1, Waldo2], []);
var ship3 = new Ship([maude, harold], []);
var ship4 = new Ship([harold, Waldo1], [ship1, ship2]);
var ship5 = new Ship([], [ship2, ship4, ship3]);
console.log(ship4.getCrew());
console.log(ship4.getDaughters());
console.log(ship4.getSerialNumber());
console.log(ship4.hasWaldo());
console.log(ship4.totalWaldos());
console.log("Removing Waldos from Ship 4...");
ship4.removeWaldos();
console.log(ship4.hasWaldo());
console.log(ship4.getCrew());
console.log(ship4.fleetHasDuplicates());
