var cardorder = new Array("2","3","4","5","6","7","8","9","10","J","Q","K","A");
var suitorder = new Array("S","H","C","D");

var card = function(c) {	
 this.suite = suitorder[ Math.floor( c / 13 ) ];
 this.card = cardorder[ Math.floor( c % 13 ) ]; 
}

card.prototype.toString = function() {
  return '' + this.card + this.suite;
}

var deck = function() {
  this.cards = new Array();
  for (var i = 0; i < 52;i++ ) {
   this.cards[i] = new card(i);
  }
}

deck.prototype.toString = function() {
  return '' + this.cards;
}

var shuffle = function(cards) {
 shuffledcards = new Array();
 for (var i = cards.length; i > 0; i--) {
  var rand_no = Math.random();
  rand_no = rand_no * i; 
  rand_no = Math.floor(rand_no);
  shuffledcards[i - 1] = cards[rand_no]; 
  cards = cards.slice(0,rand_no).concat( cards.slice(1+rand_no) );
 }
 return shuffledcards;
}

if ( typeof exports !== 'undefined' ) {
	exports.deck = deck;
	exports.shuffle = shuffle;
}