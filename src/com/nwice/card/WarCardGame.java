package com.nwice.card;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;

public class WarCardGame implements CardGame {

	private List<Card> computer_pile = Collections.synchronizedList(new ArrayList<Card>());
	private List<Card> human_pile = Collections.synchronizedList(new ArrayList<Card>());
	
	private Collection<Card> computer_discard_pile = Collections.synchronizedSet(new HashSet<Card>());
	private Collection<Card> human_discard_pile = Collections.synchronizedSet(new HashSet<Card>());
	
	private List<Card> war_pile = Collections.synchronizedList(new ArrayList<Card>());
	
	public WarCardGame(Collection<Card> computer, Collection<Card> human, boolean tba) {
		computer_pile.addAll(computer);
		human_pile.addAll(human);
	}
	
	public void computerWinner() {
		computer_discard_pile.addAll(war_pile);
		war_pile.clear();
	}
	
	public void humanWinner() {
		human_discard_pile.addAll(war_pile);
		war_pile.clear();
	}
	
	public Card getComputerCard() {
		if ( computer_pile.isEmpty() ) {
			if ( computer_discard_pile.isEmpty() ) {
				return null;
			} else {
				computer_pile.addAll(computer_discard_pile);
				computer_discard_pile.clear();
				return getComputerCard();
			}
		} else {
			return computer_pile.remove(0);
		}
	}
	
	public Card getHumanCard() {
		if ( human_pile.isEmpty() ) {
			if ( human_discard_pile.isEmpty() ) {
				return null;
			} else {
				human_pile.addAll(human_discard_pile);
				human_discard_pile.clear();
				return getHumanCard();
			}
		} else {
			return human_pile.remove(0);
		}
	}
	
	public Collection<Card> getComputerDiscardPile() {
		return computer_discard_pile;
	}
	
	public Collection<Card> getHumanDiscardPile() {
		return human_discard_pile;
	}
	
	public List<Card> getWarPile() {
		return war_pile;
	}
	
	public String getComputerScore() {
		StringBuffer sb = new StringBuffer();
		sb.append("computer:" + (computer_pile.size() + computer_discard_pile.size()));		
		return sb.toString();
	}
	
	public String getHumanScore() {
		StringBuffer sb = new StringBuffer();
		sb.append("human:" + (human_pile.size() + human_discard_pile.size()));		
		return sb.toString();
	}
	
	public String getSummary() {
		StringBuffer sb = new StringBuffer();
		sb.append("computer:" + (computer_pile.size() + computer_discard_pile.size()));
		sb.append("pile:" + computer_pile.size());
		sb.append("dischard:" + computer_discard_pile.size());
		
		sb.append(System.getProperty("line.separator"));
		
		sb.append("human:" + (human_pile.size() + human_discard_pile.size()));
		sb.append("pile:" + human_pile.size());
		sb.append("dischard:" + human_discard_pile.size());
		
		return sb.toString();
	}
		
}
