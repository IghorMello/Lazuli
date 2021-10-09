"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gensym = gensym;
let internedMap = new Map();

let counter = 0;

function gensym(name) {
  let prefix = name == null ? 's_' : name + '_';
  let sym;
  if (name == null) {
    sym = new Symbol(prefix + counter);
  } else {
    sym = new Symbol(name);
  }
  counter++;
  return sym;
}

function Symbol(name) {
  this.name = name;
}
Symbol.prototype.toString = function () {
  return this.name;
};

function makeSymbol(name) {
  if (internedMap.has(name)) {
    return internedMap.get(name);
  } else {
    let sym = new Symbol(name);
    internedMap.set(name, sym);
    return sym;
  }
}

exports.Symbol = makeSymbol;
exports.SymbolClass = Symbol;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zeW1ib2wuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFJZ0IsTSxHQUFBLE07QUFKaEIsSUFBSSxjQUFjLElBQUksR0FBSixFQUFsQjs7QUFFQSxJQUFJLFVBQVUsQ0FBZDs7QUFFTyxTQUFTLE1BQVQsQ0FBZ0IsSUFBaEIsRUFBc0I7QUFDM0IsTUFBSSxTQUFTLFFBQVEsSUFBUixHQUFlLElBQWYsR0FBc0IsT0FBTyxHQUExQztBQUNBLE1BQUksTUFBTSxJQUFJLE1BQUosQ0FBVyxTQUFTLE9BQXBCLENBQVY7QUFDQTtBQUNBLFNBQU8sR0FBUDtBQUNEOztBQUVELFNBQVMsTUFBVCxDQUFnQixJQUFoQixFQUFzQjtBQUNwQixPQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0Q7QUFDRCxPQUFPLFNBQVAsQ0FBaUIsUUFBakIsR0FBNEIsWUFBWTtBQUN0QyxTQUFPLEtBQUssSUFBWjtBQUNELENBRkQ7O0FBSUEsU0FBUyxVQUFULENBQW9CLElBQXBCLEVBQTBCO0FBQ3hCLE1BQUksWUFBWSxHQUFaLENBQWdCLElBQWhCLENBQUosRUFBMkI7QUFDekIsV0FBTyxZQUFZLEdBQVosQ0FBZ0IsSUFBaEIsQ0FBUDtBQUNELEdBRkQsTUFFTztBQUNMLFFBQUksTUFBTSxJQUFJLE1BQUosQ0FBVyxJQUFYLENBQVY7QUFDQSxnQkFBWSxHQUFaLENBQWdCLElBQWhCLEVBQXNCLEdBQXRCO0FBQ0EsV0FBTyxHQUFQO0FBQ0Q7QUFDRjs7UUFHZSxNLEdBQWQsVTtRQUNVLFcsR0FBVixNIiwiZmlsZSI6InN5bWJvbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBpbnRlcm5lZE1hcCA9IG5ldyBNYXAoKTtcblxubGV0IGNvdW50ZXIgPSAwO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2Vuc3ltKG5hbWUpIHtcbiAgbGV0IHByZWZpeCA9IG5hbWUgPT0gbnVsbCA/IFwic19cIiA6IG5hbWUgKyBcIl9cIjtcbiAgbGV0IHN5bSA9IG5ldyBTeW1ib2wocHJlZml4ICsgY291bnRlcik7XG4gIGNvdW50ZXIrKztcbiAgcmV0dXJuIHN5bTtcbn1cblxuZnVuY3Rpb24gU3ltYm9sKG5hbWUpIHtcbiAgdGhpcy5uYW1lID0gbmFtZTtcbn1cblN5bWJvbC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLm5hbWU7XG59O1xuXG5mdW5jdGlvbiBtYWtlU3ltYm9sKG5hbWUpIHtcbiAgaWYgKGludGVybmVkTWFwLmhhcyhuYW1lKSkge1xuICAgIHJldHVybiBpbnRlcm5lZE1hcC5nZXQobmFtZSk7XG4gIH0gZWxzZSB7XG4gICAgbGV0IHN5bSA9IG5ldyBTeW1ib2wobmFtZSk7XG4gICAgaW50ZXJuZWRNYXAuc2V0KG5hbWUsIHN5bSk7XG4gICAgcmV0dXJuIHN5bTtcbiAgfVxufVxuXG5leHBvcnQge1xuICBtYWtlU3ltYm9sIGFzIFN5bWJvbCxcbiAgU3ltYm9sIGFzIFN5bWJvbENsYXNzXG59O1xuIl19