"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Venusian = /** @class */ (function () {
    function Venusian(name) {
        this.name = name;
        this.VSN = Venusian.currentID++;
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
console.log('Hello, World!');
var greeting;
greeting = function (name) {
    return "Hi ".concat(name);
};
var testVenusian = new Venusian('Kevin');
console.log(greeting(testVenusian.name));
console.log('Hello ' + testVenusian.name + ', your VSN is: ' + testVenusian.VSN);
console.log(testVenusian.getName() + ' ' + testVenusian.getVsn());
