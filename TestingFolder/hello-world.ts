export{};

class Venusian {
    name: string;
    VSN: number;
    static currentID: number = 1;
    
    constructor(name:string) {
        this.name = name;
        this.VSN = Venusian.currentID++;    //Guarantees unique ID
    }

    //Public Methods
    getName() {
        return this.name;
    }

    getVsn() {
        return this.VSN;
    }
} 

class Ship {
    crew: Venusian[];
    daughters: Ship[];
    serialNum: number;
    static currentID: number = 1;

    constructor(passedCrew: Venusian[], passedDaughters: Ship[]) {
        this.serialNum = Ship.currentID++;     //Guarantees unique ID
        this.crew = [];

        for (let i = 0; i < passedCrew.length; i++) {
            this.crew[i] = passedCrew[i];
        }

        this.daughters = [];

        for (let i = 0; i < passedDaughters.length; i++) {
            this.daughters[i] = passedDaughters[i];
        }

    }

    //Public Methods
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
        for (let i = 0; i < this.crew.length; i++) {
            if (this.crew[i].getName() == "Waldo") {
                return true;
            }
        }
        return false;
    }

    totalWaldos() {
        let count: number = 0;

        //Iterate over the first ship in the fleet
        for (let i = 0; i < this.crew.length; i++) {
            if (this.crew[i].getName() == "Waldo") {
                count += 1;
            }
        }

        //Iterate over the daughter ships
        for (let j = 0; j < this.daughters.length; j++) {
            for (let k = 0; k < this.daughters[j].crew.length; k++) {
                if (this.daughters[j].crew[k].getName() == "Waldo") {
                    count += 1;
                }
            }
        }

        return count;
    }

}

console.log('Hello, World!');

let greeting: (name: string) => string;

greeting = function (name: string) {
    return `Hi ${name}`;
}

const maude = new Venusian('Maude');
const harold = new Venusian('Harold');
const Waldo1 = new Venusian('Waldo');
const Waldo2 = new Venusian('Waldo');
const ship1 = new Ship([], []);
const ship2 = new Ship([maude, harold, Waldo1, Waldo2], []);
const ship3 = new Ship([maude, harold], []);
const ship4 = new Ship([harold, Waldo1], [ship1, ship2]);
const ship5 = new Ship([], [ship2, ship4, ship3]);

//console.log(maude.getName() + ' ID: ' + maude.getVsn());
//console.log(ship4.getCrew());
console.log(ship4.getDaughters());
console.log(ship4.getSerialNumber());
console.log(ship4.hasWaldo());
console.log(ship4.totalWaldos());
