export default class Venusian {
    name: string;
    VSN: number;
    static uniqueIdentifier: number = 1;
    
    constructor(name:string) {
        this.name = name;
        this.VSN = Venusian.uniqueIdentifier++;
    }

    //Public Methods
    getName() {
        return this.name;
    }

    getVsn() {
        return this.VSN;
    }
} 