package com.nwice.card;

import java.util.ArrayList;

public interface Deck {
	
	public ArrayList<Card> getCards();	
	public void setCards(ArrayList<Card> cards);
	
	public void setBack(Card card);
	public Card getBack();

}
