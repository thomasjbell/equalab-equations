const Algebra = require("algebra.js");
const Expression = Algebra.Expression;
const Equation = Algebra.Equation;

var input = 2;

var Volt = Algebra.parse("V");
var IR = Algebra.parse("I * R");
var equation = new Equation(Volt, IR);

var Vresult = equation.solveFor("V");
var Iresult = equation.solveFor("I");
var Rresult = equation.solveFor("R");

console.log("V = " + Vresult);
console.log("I = " + Iresult);
console.log("R = " + Rresult);
