package com.nwice.card;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.andengine.audio.sound.Sound;
import org.andengine.audio.sound.SoundFactory;
import org.andengine.engine.camera.Camera;
import org.andengine.engine.options.EngineOptions;
import org.andengine.engine.options.ScreenOrientation;
import org.andengine.engine.options.resolutionpolicy.RatioResolutionPolicy;
import org.andengine.entity.IEntity;
import org.andengine.entity.scene.IOnSceneTouchListener;
import org.andengine.entity.scene.Scene;
import org.andengine.entity.sprite.Sprite;
import org.andengine.entity.text.Text;
import org.andengine.entity.text.TextOptions;
import org.andengine.input.touch.TouchEvent;
import org.andengine.opengl.font.Font;
import org.andengine.opengl.font.FontFactory;
import org.andengine.opengl.texture.TextureOptions;
import org.andengine.opengl.texture.atlas.bitmap.BitmapTextureAtlas;
import org.andengine.opengl.texture.atlas.bitmap.BitmapTextureAtlasTextureRegionFactory;
import org.andengine.opengl.texture.atlas.bitmap.BuildableBitmapTextureAtlas;
import org.andengine.opengl.texture.atlas.bitmap.source.IBitmapTextureAtlasSource;
import org.andengine.opengl.texture.atlas.buildable.builder.BlackPawnTextureAtlasBuilder;
import org.andengine.opengl.texture.atlas.buildable.builder.ITextureAtlasBuilder.TextureAtlasBuilderException;
import org.andengine.opengl.texture.region.BaseTextureRegion;
import org.andengine.opengl.texture.region.ITextureRegion;
import org.andengine.ui.activity.SimpleBaseGameActivity;
import org.andengine.util.HorizontalAlign;
import org.andengine.util.color.Color;

import android.annotation.SuppressLint;
import android.content.res.Configuration;
import android.graphics.Point;
import android.graphics.Typeface;
import android.util.Log;
import android.view.Display;
import android.view.MotionEvent;
import android.view.Surface;

import com.nwice.card.deck.Card;
import com.nwice.card.deck.CardNumber;
import com.nwice.card.deck.Deck;
import com.nwice.card.deck.StandardDeck;
import com.nwice.card.util.Util;
import com.nwice.card.war.CatsGameException;
import com.nwice.card.war.ComputerWinnerException;
import com.nwice.card.war.HumanWinnerException;
import com.nwice.card.war.WarCardGame;

public class WarActivity extends SimpleBaseGameActivity implements
		IOnSceneTouchListener {

	private WarCardGame warCardGame;
	
	private Map<String, Integer> deckMap = Collections.synchronizedMap(new HashMap());		
	private List activeElements = Collections.synchronizedList(new ArrayList());		
	
	private Sound warSound;
	private Sound tbaSound;	
	private Sound lgioSound;
	
	private boolean atWar = false;
	private boolean started = false;
	private boolean gameOver = false;
	
	private static final float cardRatio = (float) 1.4;
	
	private static int cardWidth;
	private static int cardHeight;
	
	private static int mCameraWidth;
	private static int mCameraHeight;
	
	private Font mFont;
	
	private ScreenOrientation mScreenOrientation;

	private BuildableBitmapTextureAtlas mBuildableBitmapTextureAtlas;
	private ITextureRegion[] mCardTextureRegions;

	@SuppressLint("NewApi")
	public EngineOptions onCreateEngineOptions() {

		Display display = getWindowManager().getDefaultDisplay();
		Point size = new Point();
		display.getSize(size);

		WarActivity.mCameraWidth = size.x;
		WarActivity.mCameraHeight = size.y;

		Log.i("WarActivity", "width:" + WarActivity.mCameraWidth + "height:" + WarActivity.mCameraHeight + "area:" + WarActivity.mCameraWidth
				* WarActivity.mCameraHeight + "area per card:" + WarActivity.mCameraWidth * WarActivity.mCameraHeight / 52);

		int area_per_card = size.x * size.y / 26;

		WarActivity.cardWidth = (int) Math.sqrt(area_per_card / WarActivity.cardRatio);
		WarActivity.cardHeight = (int) (WarActivity.cardWidth * WarActivity.cardRatio);
		
		Log.i("WarActivity", "cardWidth:" + WarActivity.cardWidth + "cardHeight:" + WarActivity.cardHeight);

		int rotation = display.getRotation();
		if (rotation == Surface.ROTATION_90 || rotation == Surface.ROTATION_270) {
			Log.i("WarActivity", "Landscape");
			mScreenOrientation = ScreenOrientation.LANDSCAPE_SENSOR;
		} else {
			Log.i("WarActivity", "Portrait");
			mScreenOrientation = ScreenOrientation.PORTRAIT_SENSOR;
		}
		
		Log.i("WarActivity", "create camera");

		Camera camera = new Camera(0, 0, WarActivity.mCameraWidth, WarActivity.mCameraHeight);
		
		Log.i("WarActivity", "create engine options");
		
		EngineOptions engineOptions = new EngineOptions(true, this.mScreenOrientation,
				new RatioResolutionPolicy(WarActivity.mCameraWidth,
						WarActivity.mCameraHeight), camera);
		
		Log.i("WarActivity", "set needs sound");
		
		engineOptions.getAudioOptions().setNeedsSound(true);
		
		return engineOptions;
	}

	@Override
	public void onCreateResources() {
		
		Log.i("WarActivity", "onCreateResources");
		
		mBuildableBitmapTextureAtlas = new BuildableBitmapTextureAtlas(
				this.getTextureManager(), 2048, 2048, TextureOptions.DEFAULT);
		
		BitmapTextureAtlasTextureRegionFactory.setAssetBasePath("gfx/deck/png/");		
		Deck deck = new StandardDeck();
		
		// add 1 for back of card
		mCardTextureRegions = new BaseTextureRegion[deck.getCards().size() + 1];	
		int i = 0;
		
		try {
			Iterator<Card> iter = deck.getCards().iterator();
			while (iter.hasNext()) {
				
				Card c = iter.next();
				String tc = Util.getSVGFileName(c);
				deckMap.put(tc, new Integer(i) );				
				String png_file = tc + ".png";
				Log.i("WarActivity", "i:" + i + " png:" + png_file);
				
				this.mCardTextureRegions[i++] = BitmapTextureAtlasTextureRegionFactory.createFromAsset(mBuildableBitmapTextureAtlas, this, png_file);
						
						
			}
			
			deckMap.put("back", new Integer(i) );
			
			String red_back = "Red_Back.png";
			
			Log.i("WarActivity", "i:" + i + "png:" + red_back);

			this.mCardTextureRegions[i++] = BitmapTextureAtlasTextureRegionFactory .createFromAsset(this.mBuildableBitmapTextureAtlas, this, red_back);
			
			Log.i("WarActivity", "done with back");
			
		} catch (Exception e) {
			Log.e("nwice", "Error loading card:" + e.toString());
		}
		
		try {

			Log.i("WarActivity", "load BlackPawnTextureAtlasBuilder");
			
			this.mBuildableBitmapTextureAtlas
					.build(new BlackPawnTextureAtlasBuilder<IBitmapTextureAtlasSource, BitmapTextureAtlas>(
							0, 0, 0));
			
			Log.i("WarActivity", "go for load");
			
			this.mBuildableBitmapTextureAtlas.load();
		} catch (TextureAtlasBuilderException e) {
			Log.e("nwice", "exception:" + e);
		}		
				
		try {
			
			Log.i("WarActivity", "load font");
			
			this.mFont = FontFactory.create(this.getFontManager(), this.getTextureManager(), 256, 256, TextureOptions.DEFAULT, Typeface.create(Typeface.DEFAULT, Typeface.NORMAL), 64, true, Color.WHITE_ABGR_PACKED_INT);

			Log.i("WarActivity", "font loading");
			
			this.mFont.load();
			
		} catch (Exception e) {
			Log.e("nwice", e.toString());
		}		
		
		try {
			
			SoundFactory.setAssetBasePath("mfx/");
			
			Log.i("WarActivity", "load war sound");
			
			warSound = SoundFactory.createSoundFromAsset(this.mEngine.getSoundManager(), this, "snippet2.mp3");
			
			Log.i("WarActivity", "load tba sound");
			
			tbaSound = SoundFactory.createSoundFromAsset(this.mEngine.getSoundManager(), this, "twos_beat_aces.wav");

			Log.i("WarActivity", "load lgio sound");
			
			lgioSound = SoundFactory.createSoundFromAsset(this.mEngine.getSoundManager(), this, "letsgetiton.mp3");			
			
		} catch (Exception e) {
				Log.e("nwice", "Error with sound:" + e.toString());			
		}	
		
	}
	
	private WarCardGame createWarCardGame() {

		Log.i("WarActivity", "create local deck!");
		
		Deck deck = new StandardDeck();
		
		Log.i("WarActivity", "shuffle deck");
		
		Util.shuffle(deck);
		
		Log.i("WarActivity", "create two piles");
		
		Collection<Card> computer_cards = Collections.synchronizedSet(new HashSet<Card>());
		Collection<Card> human_cards = Collections.synchronizedSet(new HashSet<Card>());
		
		while (computer_cards.size() < 26 ) {
			Log.i("WarActivity", "one for the computer:" + computer_cards.size());
			computer_cards.add( deck.getCards().remove(0) );
		}
			
		Log.i("WarActivity", "the rest for the human");
		
		human_cards.addAll( deck.getCards() );
		
		Log.i("WarActivity", "split cards create game computer cards: " + computer_cards.size() + " human cards: " + human_cards.size());
		
		return new WarCardGame(computer_cards, human_cards, true); 
		
	}

	public void splash(Scene scene) {
		
		Log.e("nwice", "create splash text" );
		
		Text text = new Text(0, 50, this.mFont, "WAR!", new TextOptions(HorizontalAlign.LEFT), getVertexBufferObjectManager());
		text.setPosition((WarActivity.mCameraWidth - text.getWidth()) / 2, 50);
		
		text.setColor(Color.WHITE);
		scene.attachChild(text);		
		this.activeElements.add(text);

		Text text2 = new Text(WarActivity.mCameraWidth / 2, 500, this.mFont, "(touch to start)", new TextOptions(HorizontalAlign.CENTER), getVertexBufferObjectManager());
		text2.setPosition((WarActivity.mCameraWidth - text2.getWidth()) / 2, 500);
		scene.attachChild(text2);		
		this.activeElements.add(text2);
		
		
		Log.e("nwice", "create splash sprite" );
		
		Sprite sprite = new Sprite((WarActivity.mCameraWidth - WarActivity.cardWidth) / 2, 200, WarActivity.cardWidth,
				WarActivity.cardHeight, mCardTextureRegions[52], getVertexBufferObjectManager());
		
		Log.e("nwice", "attachChild splash sprite" );
		
		scene.attachChild(sprite);
		
		Log.e("nwice", "add splash sprite to active elements" );
		
		this.activeElements.add(sprite);
	}
	
	@Override
	public Scene onCreateScene() {
		Log.d("nwice", "onCreateScene" );
		
		Scene scene = new Scene();

		Log.d("nwice", "setup listener" );
		
		scene.setOnSceneTouchListener(this);
		
		this.splash(scene);
		
		return scene;
	}

	@Override
	public void onConfigurationChanged(Configuration newConfig) {
		Log.i("WarActivity", "newConfig:" + newConfig.toString());
		super.onConfigurationChanged(newConfig);

	}

	public boolean onSceneTouchEvent(final Scene pScene, TouchEvent pSceneTouchEvent) {
		Log.i("WarActivity", "scene touch event:" + pSceneTouchEvent.toString() + " action:" + pSceneTouchEvent.getAction());
		
		/*
		switch (mEngine.getEngineOptions().getScreenOrientation()) {
		case LANDSCAPE_SENSOR:
			Log.i("WarActivity", "LANDSCAPE_SENSOR");
			//mScreenOrientation = ScreenOrientation.PORTRAIT_SENSOR;
			//setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
			break;
		case PORTRAIT_SENSOR:
			Log.i("WarActivity", "PORTRAIT_SENSOR");
			//mScreenOrientation = ScreenOrientation.LANDSCAPE_SENSOR;
			//setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
			break;
		}
		*/
		if ( pSceneTouchEvent.getAction() == MotionEvent.ACTION_UP ) {
	        
			this.runOnUpdateThread(new Runnable() {
	            
	        	public void run() {
	        		
	        		while ( !activeElements.isEmpty() ) {
	        			try {
	        				
	        				Object o = activeElements.remove(0);
	        				
	        				Log.e("nwice", "Attempt remove active element:" + o.toString());
	        				
	        				pScene.detachChild((IEntity)o);
	        				
	        			} catch (Exception e) {
	        				Log.e("nwice", "Oh shit! Can't clear activeElements:" + e.toString() );
						}
	        		}

	        		Log.i("WarActivity", "pScene:" + pScene.toString());
	        		
	        		try {
	        		
		        		if ( !started ) {
		        			
		        			try {			
		        				Log.e("nwice", "play lgioSound is loaded:" + lgioSound.isLoaded() );
		        				lgioSound.play();
		        			} catch(Exception e) {
		        				Log.e("nwice", "failed to play sound:" + e.toString() );
		        			}
		        			
		        			started = true;
		        			
		        			warCardGame = createWarCardGame();
		        			
		        		} else if ( gameOver ) {
		        		
		        			splash(pScene);
		        			
		        			gameOver = false;
		        			
		        			started = false;
		        			warCardGame = null;		        		
		        			
		        		} else if ( atWar ) {

		        			Iterator<Card> iter = warCardGame.getWarPile().iterator();
		        			Random random = new Random();
		        			
		        			while (iter.hasNext()) {
		        				Card temp = iter.next();
		        				Sprite tempSprite = new Sprite( cardWidth - random.nextInt(cardWidth) ,(WarActivity.mCameraHeight - random.nextInt(cardHeight)) / 2, WarActivity.cardWidth,
			            				WarActivity.cardHeight, mCardTextureRegions[deckMap.get(Util.getSVGFileName(temp)).intValue()], getVertexBufferObjectManager());
			            		pScene.attachChild(tempSprite);
			            		activeElements.add(tempSprite);      				
		        			}
		        		
		        			Card c = warCardGame.getComputerCard();
		        			Card cwc = null;
		        			
		        			if ( c == null ) {		        				
		        			
		        				Log.e("nwice", "Oh fuck we've got nullage" );		        				
		        				throw new CatsGameException();		        				
		        			
		        			} 
		        				
		        			Card c2 = warCardGame.getComputerCard();
		        			
		        			if ( c2 == null ) {

			            		// place c to c4
			            		Sprite cs = new Sprite(
			            				WarActivity.mCameraWidth / 2, 
			            				(WarActivity.mCameraHeight - WarActivity.cardHeight - (3 * cardHeight)) / 2, 
			            				WarActivity.cardWidth,
			            				WarActivity.cardHeight, 
			            				mCardTextureRegions[deckMap.get(Util.getSVGFileName(c)).intValue()], getVertexBufferObjectManager());
			            		pScene.attachChild(cs);
			            		activeElements.add(cs);					            			

			            		cwc = c;
		        				
		        			} else {
		        					
	        					// place c face down
	        					Sprite cs = new Sprite(
			            				WarActivity.mCameraWidth/ 2, 
			            				(WarActivity.mCameraHeight - WarActivity.cardHeight - (2 * cardHeight)) / 2, 
			            				WarActivity.cardWidth,
			            				WarActivity.cardHeight, 
			            				mCardTextureRegions[52], getVertexBufferObjectManager());
			            		pScene.attachChild(cs);
			            		activeElements.add(cs);
			            		
			            		warCardGame.getWarPile().add(c);
			            		
			            		Card c3 = warCardGame.getComputerCard();
			            		
			            		if ( c3 == null ) {

				            		// place c to c4
				            		Sprite cs2 = new Sprite(
				            				WarActivity.mCameraWidth / 2, 
				            				(WarActivity.mCameraHeight - WarActivity.cardHeight - (3 * cardHeight)) / 2, 
				            				WarActivity.cardWidth,
				            				WarActivity.cardHeight, 
				            				mCardTextureRegions[deckMap.get(Util.getSVGFileName(c2)).intValue()], getVertexBufferObjectManager());
				            		pScene.attachChild(cs2);
				            		activeElements.add(cs2);					            			

				            		cwc = c2;
			            			
			            		} else {
	        						// place c2
				            		Sprite cs2 = new Sprite(
				            				WarActivity.mCameraWidth/ 2 + 25, 
				            				(WarActivity.mCameraHeight - WarActivity.cardHeight - (2 * cardHeight)) / 2 - 25, 
				            				WarActivity.cardWidth,
				            				WarActivity.cardHeight, 
				            				mCardTextureRegions[52], getVertexBufferObjectManager());
				            		pScene.attachChild(cs2);
				            		activeElements.add(cs2);
				            		warCardGame.getWarPile().add(c2);
				            		
				            		Card c4 = warCardGame.getComputerCard();

				            		if ( c4 == null ) {

					            		// place c3 to c4
					            		Sprite cs3 = new Sprite(
					            				WarActivity.mCameraWidth / 2, 
					            				(WarActivity.mCameraHeight - WarActivity.cardHeight - (3 * cardHeight)) / 2, 
					            				WarActivity.cardWidth,
					            				WarActivity.cardHeight, 
					            				mCardTextureRegions[deckMap.get(Util.getSVGFileName(c3)).intValue()], getVertexBufferObjectManager());
					            		pScene.attachChild(cs3);
					            		activeElements.add(cs3);					            			
				            			
					            		cwc = c3;
					            		
		        					} else {
		        						
		        						// place c3
					            		Sprite cs3 = new Sprite(
					            				WarActivity.mCameraWidth / 2 + 50, 
					            				(WarActivity.mCameraHeight - WarActivity.cardHeight - (2 * cardHeight)) / 2 - 50, 
					            				WarActivity.cardWidth,
					            				WarActivity.cardHeight, 
					            				mCardTextureRegions[52], getVertexBufferObjectManager());
					            		pScene.attachChild(cs3);
					            		activeElements.add(cs3);
					            		
					            		warCardGame.getWarPile().add(c3);
					            		
					            		// place c4
					            		Sprite cs4 = new Sprite(
					            				WarActivity.mCameraWidth / 2, 
					            				(WarActivity.mCameraHeight - WarActivity.cardHeight - (3 * cardHeight)) / 2, 
					            				WarActivity.cardWidth,
					            				WarActivity.cardHeight, 
					            				mCardTextureRegions[deckMap.get(Util.getSVGFileName(c4)).intValue()], getVertexBufferObjectManager());
					            		pScene.attachChild(cs4);
					            		activeElements.add(cs4);
		        						
					            		cwc = c4;
		        					}
			            		}
			            		
		        			}

		        			Card h = warCardGame.getHumanCard();
		        			Card hwc = null;
		        			
		        			if ( h == null ) {		        				
		        			
		        				Log.e("nwice", "Oh fuck we've got nullage" );		        				
		        				throw new CatsGameException();		        				
		        			
		        			} 
		        				
		        			Card h2 = warCardGame.getHumanCard();
		        			
		        			if ( h2 == null ) {

			            		// place h to h4
			            		Sprite hs = new Sprite(
			            				WarActivity.mCameraWidth / 2, 
			            				(WarActivity.mCameraHeight - WarActivity.cardHeight + (3 * cardHeight)) / 2, 
			            				WarActivity.cardWidth,
			            				WarActivity.cardHeight, 
			            				mCardTextureRegions[deckMap.get(Util.getSVGFileName(h)).intValue()], getVertexBufferObjectManager());
			            		pScene.attachChild(hs);
			            		activeElements.add(hs);					            			

			            		hwc = h;
		        				
		        			} else {
		        					
	        					// place h face down
	        					Sprite hs = new Sprite(
			            				WarActivity.mCameraWidth / 2, 
			            				(WarActivity.mCameraHeight - WarActivity.cardHeight + (2 * cardHeight)) / 2, 
			            				WarActivity.cardWidth,
			            				WarActivity.cardHeight, 
			            				mCardTextureRegions[52], getVertexBufferObjectManager());
			            		pScene.attachChild(hs);
			            		activeElements.add(hs);
			            		
			            		warCardGame.getWarPile().add(h);
			            		
			            		Card h3 = warCardGame.getHumanCard();
			            		
			            		if ( h3 == null ) {

				            		// place h2 to c4
				            		Sprite hs2 = new Sprite(
				            				WarActivity.mCameraWidth / 2, 
				            				(WarActivity.mCameraHeight - WarActivity.cardHeight + (3 * cardHeight)) / 2, 
				            				WarActivity.cardWidth,
				            				WarActivity.cardHeight, 
				            				mCardTextureRegions[deckMap.get(Util.getSVGFileName(h2)).intValue()], getVertexBufferObjectManager());
				            		pScene.attachChild(hs2);
				            		activeElements.add(hs2);					            			

				            		hwc = h2;
			            			
			            		} else {
	        						// place h2
				            		Sprite hs2 = new Sprite(
				            				WarActivity.mCameraWidth / 2 + 25, 
				            				(WarActivity.mCameraHeight - WarActivity.cardHeight + (2 * cardHeight)) / 2 + 25, 
				            				WarActivity.cardWidth,
				            				WarActivity.cardHeight, 
				            				mCardTextureRegions[52], getVertexBufferObjectManager());
				            		pScene.attachChild(hs2);
				            		activeElements.add(hs2);
				            		warCardGame.getWarPile().add(h2);
				            		
				            		Card h4 = warCardGame.getHumanCard();

				            		if ( h4 == null ) {

					            		// place h3 to h4
					            		Sprite hs3 = new Sprite(
					            				WarActivity.mCameraWidth / 2, 
					            				(WarActivity.mCameraHeight - WarActivity.cardHeight + (3 * cardHeight)) / 2, 
					            				WarActivity.cardWidth,
					            				WarActivity.cardHeight, 
					            				mCardTextureRegions[deckMap.get(Util.getSVGFileName(h3)).intValue()], getVertexBufferObjectManager());
					            		pScene.attachChild(hs3);
					            		activeElements.add(hs3);					            			
				            			
					            		hwc = h3;
					            		
		        					} else {
		        						
		        						// place h3
					            		Sprite hs3 = new Sprite(
					            				WarActivity.mCameraWidth / 2 + 50, 
					            				(WarActivity.mCameraHeight - WarActivity.cardHeight + (2 * cardHeight)) / 2 + 50, 
					            				WarActivity.cardWidth,
					            				WarActivity.cardHeight, 
					            				mCardTextureRegions[52], getVertexBufferObjectManager());
					            		pScene.attachChild(hs3);
					            		activeElements.add(hs3);
					            		
					            		warCardGame.getWarPile().add(h3);
					            		
					            		// place h4
					            		Sprite hs4 = new Sprite(
					            				WarActivity.mCameraWidth / 2, 
					            				(WarActivity.mCameraHeight - WarActivity.cardHeight + (3 * cardHeight)) / 2, 
					            				WarActivity.cardWidth,
					            				WarActivity.cardHeight, 
					            				mCardTextureRegions[deckMap.get(Util.getSVGFileName(h4)).intValue()], getVertexBufferObjectManager());
					            		pScene.attachChild(hs4);
					            		activeElements.add(hs4);
		        						
					            		hwc = h4;
		        					}
			            		}			            		
		        			}
		        			
		        			
		        			Log.e("nwice", "computer war card:" + cwc.getNumber() + cwc.getSuite() );
		        			Log.e("nwice", "human war card:" + hwc.getNumber() + hwc.getSuite() );

		        			checkWar(cwc, hwc);
		        				            	
		            	} else {
		        			
		        			Card c = warCardGame.getComputerCard();
		        			
		        			if ( c == null ) {
		        				throw new HumanWinnerException();
		        			}
		        			
		        			Log.e("nwice", "Got computer card:" + Util.getSVGFileName(c) );
		            		Integer cardOne = deckMap.get(Util.getSVGFileName(c));

		            		Card c2 = warCardGame.getHumanCard();
		            		
		        			if ( c2 == null ) {
		        				throw new ComputerWinnerException();
		        			}
		            		
		        			Log.e("nwice", "Got human card:" + Util.getSVGFileName(c2) );
		            		Integer cardTwo = deckMap.get(Util.getSVGFileName(c2));	        			
		            		
		            		Log.e("nwice", "interesting:" + cardOne.toString() + "-" + cardTwo.toString() );
	
		            		Log.e("nwice", "create card one sprite" );
		            		
		            		Sprite sprite = new Sprite(
		            				(WarActivity.mCameraWidth - WarActivity.cardWidth) / 2, 
		            				(WarActivity.mCameraHeight - WarActivity.cardHeight - (2 * cardHeight)) / 2, 
		            				WarActivity.cardWidth,
		            				WarActivity.cardHeight, 
		            				mCardTextureRegions[cardOne.intValue()], getVertexBufferObjectManager());
		            		
		            		Log.e("nwice", "attachChild card one sprite" );
	
		            		pScene.attachChild(sprite);
		            		
		            		Log.e("nwice", "add card one sprite to active elements" );
		            		
		            		activeElements.add(sprite);
		            		
		            		Log.e("nwice", "create card two sprite" );
		            		
		            		Sprite sprite2 = new Sprite((WarActivity.mCameraWidth - WarActivity.cardWidth) / 2, (WarActivity.mCameraHeight - WarActivity.cardHeight + (2 * WarActivity.cardHeight)) / 2, WarActivity.cardWidth,
		            				WarActivity.cardHeight, mCardTextureRegions[cardTwo.intValue()], getVertexBufferObjectManager());
		            		
		            		Log.e("nwice", "attachChild card two sprite" );
		            		
		            		pScene.attachChild(sprite2);
		            		
		            		Log.e("nwice", "add card two sprite to active elements" );
		            		
		            		activeElements.add(sprite2);
		            		
		            		checkWar(c, c2);
		            		
		        		}
		        		
		        		try {
		        			
		        			Log.i("WarActivity", "score create text and attach and add to activeelements");
		        			
		        			Text score = new Text(100, 100, mFont, warCardGame.getComputerScore() , new TextOptions(HorizontalAlign.LEFT), getVertexBufferObjectManager());
		        			score.setColor(Color.WHITE);
		        			score.setRotation(180);
		        			
		        			score.setPosition(mCameraWidth - 100 - score.getWidth(), 50);
		        			
		        			pScene.attachChild(score);
		        			activeElements.add(score);
		        			
		        			Text score2 = new Text(100, mCameraHeight - 100, mFont, warCardGame.getHumanScore() , new TextOptions(HorizontalAlign.LEFT), getVertexBufferObjectManager());
		        			score2.setColor(Color.WHITE);
		        			score2.setPosition(100, mCameraHeight - 50 - score2.getHeight());
		        			
		        			pScene.attachChild(score2);
		        			activeElements.add(score2);
		        			
	        			} catch (Exception e) {
	        				Log.e("nwice", "Oh shit! Can't show score maybe no warCardGame:" + e.toString() );
						}
		        		
	        		} catch (HumanWinnerException e) {
	        			
	        			Text hw = new Text(100, mCameraHeight / 2, mFont, "Human Wins!", new TextOptions(HorizontalAlign.LEFT), getVertexBufferObjectManager());
	        			hw.setColor(Color.WHITE);
	        			pScene.attachChild(hw);
	        			activeElements.add(hw);	        			
	        			
	        			gameOver = true;	        			
					} catch (ComputerWinnerException e) {
						
						Text cw = new Text(100, mCameraHeight / 2, mFont, "Computer Wins!", new TextOptions(HorizontalAlign.LEFT), getVertexBufferObjectManager());
						cw.setColor(Color.WHITE);
	        			pScene.attachChild(cw);
	        			activeElements.add(cw);	        			
	        			
						gameOver = true;
					}  catch (CatsGameException e) {
						
						Text cgw = new Text(100, mCameraHeight / 2, mFont, "Tie!", new TextOptions(HorizontalAlign.LEFT), getVertexBufferObjectManager());
						cgw.setColor(Color.WHITE);
	        			pScene.attachChild(cgw);
	        			activeElements.add(cgw);	        			
	        			
						gameOver = true;
					}
	            }
	        });		
		}
		return false;
	}

	private void checkWar(Card computer, Card human) {

		Log.e("nwice", "add cards to pile" );
		
		warCardGame.getWarPile().add(computer);
		warCardGame.getWarPile().add(human);
		
		if ( computer.getNumber() == human.getNumber() ) {
			
			Log.e("nwice", "war!" );
			
			try {			
				Log.e("nwice", "play warSound is loaded:" + warSound.isLoaded() );
				warSound.play();
			} catch(Exception e) {
				Log.e("nwice", "failed to play sound:" + e.toString() );
			}
			
			atWar = true;
			
		} else {
			
			atWar = false;
			
			if ( computer.getNumber().equals(CardNumber.TWO) && human.getNumber().equals(CardNumber.ACE) ) {
				try {			
					Log.e("nwice", "play tbaSound is loaded:" + tbaSound.isLoaded() );
					tbaSound.play();
				} catch(Exception e) {
					Log.e("nwice", "failed to play sound:" + e.toString() );
				}
				
				warCardGame.computerWinner();
				
			} else if ( human.getNumber().equals(CardNumber.TWO) && computer.getNumber().equals(CardNumber.ACE) ) {
				try {			
					Log.e("nwice", "play tbaSound is loaded:" + tbaSound.isLoaded() );
					tbaSound.play();
				} catch(Exception e) {
					Log.e("nwice", "failed to play sound:" + e.toString() );
				}
				
				warCardGame.humanWinner();
				
			} else if ( Util.getCardValue(computer) > Util.getCardValue(human) ) {
				
				Log.e("nwice", "computer wins!" );
				
				warCardGame.computerWinner();
				
			} else {
				
				Log.e("nwice", "human wins!" );
				
				warCardGame.humanWinner();
				
			}
			
			Log.e("nwice", warCardGame.getSummary() );
			
		}
		
	}
		
}