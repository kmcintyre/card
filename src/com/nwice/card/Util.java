package com.nwice.card;

import java.util.ArrayList;
import java.util.Random;

public class Util {

	public static void shuffle(Deck d) {		
		ArrayList<Card> shuffledCards = new ArrayList<Card>();
		while (d.getCards().size() > 0 ) {
			int r = new Random().nextInt(d.getCards().size());
			shuffledCards.add(d.getCards().remove(r));
		}
		d.setCards(shuffledCards);
	}
	
	public static int getCardValue(Card c) {
		switch (c.getNumber()) {
			case ACE:
				return 14;
			case TWO:
				return 2;
			case THREE:
				return 3;
			case FOUR:
				return 4;
			case FIVE:
				return 5;
			case SIX:
				return 6;
			case SEVEN:
				return 7;
			case EIGHT:
				return 8;
			case NINE:
				return 9;
			case TEN:
				return 10;
			case JACK:
				return 11;
			case QUEEN:
				return 12;
			case KING:
				return 13;
		}
		return 0;		
	}
	
	public static String getSVGFileName(Card c) {
		
		String s = null;
		String n = null;
		
		switch (c.getSuite()) {
			case HEARTS:
				s = "H";
				break;
			case DIAMONDS:
				s = "D";
				break;
			case CLUBS:
				s = "C";
				break;
			case SPADES:
				s = "S";
				break;			
		}
		
		switch (c.getNumber()) {
			case ACE:
				n = "A";
				break;
			case TWO:
				n = "2";
				break;
			case THREE:
				n = "3";
				break;
			case FOUR:
				n = "4";
				break;
			case FIVE:
				n = "5";
				break;
			case SIX:
				n = "6";
				break;
			case SEVEN:
				n = "7";
				break;
			case EIGHT:
				n = "8";
				break;
			case NINE:
				n = "9";
				break;
			case TEN:
				n = "10";
				break;
			case JACK:
				n = "J";
				break;
			case QUEEN:
				n = "Q";
				break;
			case KING:
				n = "K";
				break;
		}
		return n.concat(s);
	}

	
}
