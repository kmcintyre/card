package com.nwice.card.blackjack;

import java.util.Set;

public interface Seat {
		
	public void sit(Player p);
	
	public Player getPlayer();
	
	public Set<Bet> getBets();

}
