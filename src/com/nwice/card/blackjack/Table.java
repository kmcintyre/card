package com.nwice.card.blackjack;

import java.util.List;

public interface Table {

	/*
	 *  Including the dealer norammly 8
	 */
	public List<Seat> getSeats();	
	
	public Shoe getShoe();
	
	public Dealer getDealer();
	
}
