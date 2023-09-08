export default class Venusian {
  name: string;

  VSN: number;

  static uniqueIdentifier = 1;
    
  constructor(name:string) {
    this.name = name;
    Venusian.uniqueIdentifier += 1;
    this.VSN = Venusian.uniqueIdentifier;
  }

  // Public Methods
  getName() {
    return this.name;
  }

  getVsn() {
    return this.VSN;
  }
} 