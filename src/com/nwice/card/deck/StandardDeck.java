package com.nwice.card.deck;

import java.util.ArrayList;

public class StandardDeck implements Deck {

	private ArrayList<Card> cards;
	
	private Card back;
	
	public StandardDeck() {
		ArrayList<Card> t = new ArrayList<Card>();
		for (CardSuite s : CardSuite.values()) {
			for (CardNumber cn : CardNumber.values()) {			
				t.add(new StandardCard(s, cn));
			}
		}
		cards = t;
	}

 	public ArrayList<Card> getCards() {
 		 return cards;
	}

 	public void setCards(ArrayList<Card> cards) {
		 this.cards = cards;
	}

	public void setBack(Card card) {
		this.back = card;
		
	}

	public Card getBack() {
		return this.back;
	}
 	
}

class StandardCard implements Card {
	
	private CardSuite suite;
	private CardNumber number;
	
	public StandardCard(CardSuite s, CardNumber cn) {
		suite = s;
		number = cn;
	}
	
	public CardSuite getSuite() {
		return suite;
	}

	public CardNumber getNumber() {
		return number;
	}	
	
}


