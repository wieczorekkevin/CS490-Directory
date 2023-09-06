export{};

class Venusian {
    name: string;
    VSN: number;
    static currentID: number = 1;
    
    constructor(name:string) {
        this.name = name;
        this.VSN = Venusian.currentID++;
    }

    //Public Methods
    getName() {
        return this.name;
    }

    getVsn() {
        return this.VSN;
    }
} 

console.log('Hello, World!');

let greeting: (name: string) => string;

greeting = function (name: string) {
    return `Hi ${name}`;
}

const testVenusian = new Venusian('Kevin');
console.log(greeting(testVenusian.name));
console.log('Hello ' + testVenusian.name + ', your VSN is: ' + testVenusian.VSN);

console.log(testVenusian.getName() + ' ' + testVenusian.getVsn());

