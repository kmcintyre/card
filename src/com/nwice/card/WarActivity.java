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
import java.util.Set;

import org.andengine.audio.sound.Sound;
import org.andengine.audio.sound.SoundFactory;
import org.andengine.engine.camera.Camera;
import org.andengine.engine.options.EngineOptions;
import org.andengine.engine.options.ScreenOrientation;
import org.andengine.engine.options.resolutionpolicy.RatioResolutionPolicy;
import org.andengine.entity.IEntity;
import org.andengine.entity.scene.IOnSceneTouchListener;
import org.andengine.entity.scene.Scene;
import org.andengine.entity.scene.background.Background;
import org.andengine.entity.sprite.AnimatedSprite;
import org.andengine.entity.sprite.Sprite;
import org.andengine.entity.text.Text;
import org.andengine.entity.text.TextOptions;
import org.andengine.extension.svg.opengl.texture.atlas.bitmap.SVGBitmapTextureAtlasTextureRegionFactory;
import org.andengine.input.touch.TouchEvent;
import org.andengine.opengl.font.Font;
import org.andengine.opengl.font.FontFactory;
import org.andengine.opengl.texture.TextureOptions;
import org.andengine.opengl.texture.atlas.bitmap.BitmapTextureAtlas;
import org.andengine.opengl.texture.atlas.bitmap.BuildableBitmapTextureAtlas;
import org.andengine.opengl.texture.atlas.bitmap.source.IBitmapTextureAtlasSource;
import org.andengine.opengl.texture.atlas.buildable.builder.BlackPawnTextureAtlasBuilder;
import org.andengine.opengl.texture.atlas.buildable.builder.ITextureAtlasBuilder.TextureAtlasBuilderException;
import org.andengine.opengl.texture.region.BaseTextureRegion;
import org.andengine.opengl.texture.region.ITextureRegion;
import org.andengine.opengl.vbo.VertexBufferObjectManager;
import org.andengine.ui.activity.SimpleBaseGameActivity;
import org.andengine.util.HorizontalAlign;
import org.andengine.util.color.Color;

import android.annotation.SuppressLint;
import android.content.pm.ActivityInfo;
import android.content.res.Configuration;
import android.graphics.Point;
import android.graphics.Typeface;
import android.util.Log;
import android.view.Display;
import android.view.Menu;
import android.view.MotionEvent;
import android.view.Surface;

public class WarActivity extends SimpleBaseGameActivity implements
		IOnSceneTouchListener {

	// ===========================================================
	// Constants
	// ===========================================================

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

	// ===========================================================
	// Fields
	// ===========================================================

	private Font mFont;
	
	private ScreenOrientation mScreenOrientation;

	private BuildableBitmapTextureAtlas mBuildableBitmapTextureAtlas;
	private ITextureRegion[] mSVGTestTextureRegions;

	// ===========================================================
	// Constructors
	// ===========================================================

	// ===========================================================
	// Getter & Setter
	// ===========================================================

	// ===========================================================
	// Methods for/from SuperClass/Interfaces
	// ===========================================================

	@SuppressLint("NewApi")
	public EngineOptions onCreateEngineOptions() {

		Display display = getWindowManager().getDefaultDisplay();
		Point size = new Point();
		display.getSize(size);

		WarActivity.mCameraWidth = size.x;
		WarActivity.mCameraHeight = size.y;

		Log.i("nwice", "width:" + WarActivity.mCameraWidth + "height:" + WarActivity.mCameraHeight + "area:" + WarActivity.mCameraWidth
				* WarActivity.mCameraHeight + "area per card:" + WarActivity.mCameraWidth * WarActivity.mCameraHeight / 52);

		int area_per_card = size.x * size.y / 26;

		WarActivity.cardWidth = (int) Math.sqrt(area_per_card / WarActivity.cardRatio);
		WarActivity.cardHeight = (int) (WarActivity.cardWidth * WarActivity.cardRatio);
		
		Log.i("nwice", "cardWidth:" + WarActivity.cardWidth + "cardHeight:" + WarActivity.cardHeight);

		int rotation = display.getRotation();
		if (rotation == Surface.ROTATION_90 || rotation == Surface.ROTATION_270) {
			Log.i("nwice", "Landscape");
			mScreenOrientation = ScreenOrientation.LANDSCAPE_SENSOR;
		} else {
			Log.i("nwice", "Portrait");
			mScreenOrientation = ScreenOrientation.PORTRAIT_SENSOR;
		}
		
		Log.i("nwice", "create camera");

		Camera camera = new Camera(0, 0, WarActivity.mCameraWidth, WarActivity.mCameraHeight);
		
		Log.i("nwice", "create engine options");
		
		EngineOptions engineOptions = new EngineOptions(true, this.mScreenOrientation,
				new RatioResolutionPolicy(WarActivity.mCameraWidth,
						WarActivity.mCameraHeight), camera);
		
		Log.i("nwice", "set needs sound");
		
		engineOptions.getAudioOptions().setNeedsSound(true);
		
		return engineOptions;
	}

	@Override
	public void onCreateResources() {
		this.mBuildableBitmapTextureAtlas = new BuildableBitmapTextureAtlas(
				this.getTextureManager(), 1024, 1024, TextureOptions.NEAREST);
		
		Log.i("nwice", "onCreateResources");
		
		SVGBitmapTextureAtlasTextureRegionFactory.setAssetBasePath("gfx/deck/");

		Log.i("nwice", "create local deck");
		
		Deck deck = new StandardDeck();
		
		// add 1 for back of card
		this.mSVGTestTextureRegions = new BaseTextureRegion[deck.getCards().size() + 1];
		
		Log.i("nwice", "onCreateResources2");

		int i = 0;
		
		Log.i("nwice", "onCreateResources i:" + i);
		
		try {
			Iterator<Card> iter = deck.getCards().iterator();
			while (iter.hasNext()) {
				
				Card c = iter.next();
				String tc = Util.getSVGFileName(c);
				deckMap.put(tc, new Integer(i) );				
				String svg = "svg/" + tc + ".svg";
				Log.i("nwice", "i:" + i + "svg:" + svg);
				this.mSVGTestTextureRegions[i++] = SVGBitmapTextureAtlasTextureRegionFactory
						.createFromAsset(this.mBuildableBitmapTextureAtlas,
								this, svg, 128, 128);
			}
			
			Log.i("nwice", "put back: " + i);
			
			deckMap.put("back", new Integer(i) );
			
			Log.i("nwice", "set svg: red.svg");

			String svg = "red.svg";
			
			Log.i("nwice", "i:" + i + "svg:" + svg);

			this.mSVGTestTextureRegions[i++] = SVGBitmapTextureAtlasTextureRegionFactory
					.createFromAsset(this.mBuildableBitmapTextureAtlas,
							this, svg, 128, 128);
			
			Log.i("nwice", "done with back");
			
		} catch (Exception e) {
			Log.e("Test", "Error loading card:" + e.toString());
		}
		
		try {

			Log.i("nwice", "load BlackPawnTextureAtlasBuilder");
			
			this.mBuildableBitmapTextureAtlas
					.build(new BlackPawnTextureAtlasBuilder<IBitmapTextureAtlasSource, BitmapTextureAtlas>(
							0, 0, 0));
			
			Log.i("nwice", "go for load");
			
			this.mBuildableBitmapTextureAtlas.load();
		} catch (TextureAtlasBuilderException e) {
			Log.e("Test", e.toString());
		}		
				
		try {
			
			Log.i("nwice", "load font");
			
			this.mFont = FontFactory.create(this.getFontManager(), this.getTextureManager(), 256, 256, TextureOptions.DEFAULT, Typeface.create(Typeface.DEFAULT, Typeface.NORMAL), 64, true, Color.WHITE_ABGR_PACKED_INT);

			Log.i("nwice", "font loading");
			
			this.mFont.load();
			
		} catch (Exception e) {
			Log.e("Test", e.toString());
		}		
		
		try {
			
			SoundFactory.setAssetBasePath("mfx/");
			
			Log.i("nwice", "load war sound");
			
			warSound = SoundFactory.createSoundFromAsset(this.mEngine.getSoundManager(), this, "snippet2.mp3");
			
			Log.i("nwice", "load tba sound");
			
			tbaSound = SoundFactory.createSoundFromAsset(this.mEngine.getSoundManager(), this, "twos_beat_aces.wav");

			Log.i("nwice", "load lgio sound");
			
			lgioSound = SoundFactory.createSoundFromAsset(this.mEngine.getSoundManager(), this, "letsgetiton.mp3");			
			
		} catch (Exception e) {
				Log.e("Test", "Error with sound:" + e.toString());			
		}	
		
	}
	
	private WarCardGame createWarCardGame() {

		Log.i("nwice", "create local deck!");
		
		Deck deck = new StandardDeck();
		
		Log.i("nwice", "shuffle deck");
		
		Util.shuffle(deck);
		
		Log.i("nwice", "create two piles");
		
		Collection<Card> computer_cards = Collections.synchronizedSet(new HashSet<Card>());
		Collection<Card> human_cards = Collections.synchronizedSet(new HashSet<Card>());
		
		while (computer_cards.size() < 26 ) {
			Log.i("nwice", "one for the computer:" + computer_cards.size());
			computer_cards.add( deck.getCards().remove(0) );
		}
			
		Log.i("nwice", "the rest for the human");
		
		human_cards.addAll( deck.getCards() );
		
		Log.i("nwice", "split cards create game computer cards: " + computer_cards.size() + " human cards: " + human_cards.size());
		
		return new WarCardGame(computer_cards, human_cards, true); 
		
	}

	public void splash(Scene scene) {
		
		Log.e("Test", "create splash text" );
		
		Text text = new Text(100, 100, this.mFont, "F#ck you, it's WAR!", new TextOptions(HorizontalAlign.LEFT), getVertexBufferObjectManager());
		
		Log.e("Test", "set color white" );
		
		text.setColor(Color.WHITE);
		
		Log.e("Test", "attached splash text" );
		
		scene.attachChild(text);
		
		Log.e("Test", "add splash text to active elements" );
		
		this.activeElements.add(text);
		
		Log.e("Test", "create splash sprite" );
		
		Sprite sprite = new Sprite((WarActivity.mCameraWidth - WarActivity.cardWidth) / 2, 200, WarActivity.cardWidth,
				WarActivity.cardHeight, mSVGTestTextureRegions[52], getVertexBufferObjectManager());
		
		Log.e("Test", "attachChild splash sprite" );
		
		scene.attachChild(sprite);
		
		Log.e("Test", "add splash sprite to active elements" );
		
		this.activeElements.add(sprite);
	}
	
	@Override
	public Scene onCreateScene() {
		// this.mEngine.registerUpdateHandler(new FPSLogger());

		Log.e("Test", "onCreateScene" );
		
		Scene scene = new Scene();

		Log.e("Test", "setup listener" );
		
		scene.setOnSceneTouchListener(this);
		
		this.splash(scene);
		
		/*
		scene.setBackground(new Background(0.5f, 0.5f, 0.5f));
	    */
		
		return scene;
	}

	@Override
	public void onConfigurationChanged(Configuration newConfig) {
		Log.i("nwice", "newConfig:" + newConfig.toString());
		super.onConfigurationChanged(newConfig);

	}

	public boolean onSceneTouchEvent(final Scene pScene, TouchEvent pSceneTouchEvent) {
		Log.i("nwice", "scene touch event:" + pSceneTouchEvent.toString() + " action:" + pSceneTouchEvent.getAction());
		
		/*
		switch (mEngine.getEngineOptions().getScreenOrientation()) {
		case LANDSCAPE_SENSOR:
			Log.i("nwice", "LANDSCAPE_SENSOR");
			//mScreenOrientation = ScreenOrientation.PORTRAIT_SENSOR;
			//setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
			break;
		case PORTRAIT_SENSOR:
			Log.i("nwice", "PORTRAIT_SENSOR");
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
	        				
	        				Log.e("Test", "Attempt remove active element:" + o.toString());
	        				
	        				pScene.detachChild((IEntity)o);
	        				
	        			} catch (Exception e) {
	        				Log.e("Test", "Oh shit! Can't clear activeElements:" + e.toString() );
						}
	        		}

	        		Log.i("nwice", "pScene:" + pScene.toString());
	        		
	        		try {
	        		
		        		if ( !started ) {
		        			
		        			try {			
		        				Log.e("Test", "play lgioSound is loaded:" + lgioSound.isLoaded() );
		        				lgioSound.play();
		        			} catch(Exception e) {
		        				Log.e("Test", "failed to play sound:" + e.toString() );
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
			            				WarActivity.cardHeight, mSVGTestTextureRegions[deckMap.get(Util.getSVGFileName(temp)).intValue()], getVertexBufferObjectManager());
			            		pScene.attachChild(tempSprite);
			            		activeElements.add(tempSprite);      				
		        			}
		        		
		        			Card c = warCardGame.getComputerCard();
		        			Card cwc = null;
		        			
		        			if ( c == null ) {		        				
		        			
		        				Log.e("Test", "Oh fuck we've got nullage" );		        				
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
			            				mSVGTestTextureRegions[deckMap.get(Util.getSVGFileName(c)).intValue()], getVertexBufferObjectManager());
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
			            				mSVGTestTextureRegions[52], getVertexBufferObjectManager());
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
				            				mSVGTestTextureRegions[deckMap.get(Util.getSVGFileName(c2)).intValue()], getVertexBufferObjectManager());
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
				            				mSVGTestTextureRegions[52], getVertexBufferObjectManager());
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
					            				mSVGTestTextureRegions[deckMap.get(Util.getSVGFileName(c3)).intValue()], getVertexBufferObjectManager());
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
					            				mSVGTestTextureRegions[52], getVertexBufferObjectManager());
					            		pScene.attachChild(cs3);
					            		activeElements.add(cs3);
					            		
					            		warCardGame.getWarPile().add(c3);
					            		
					            		// place c4
					            		Sprite cs4 = new Sprite(
					            				WarActivity.mCameraWidth / 2, 
					            				(WarActivity.mCameraHeight - WarActivity.cardHeight - (3 * cardHeight)) / 2, 
					            				WarActivity.cardWidth,
					            				WarActivity.cardHeight, 
					            				mSVGTestTextureRegions[deckMap.get(Util.getSVGFileName(c4)).intValue()], getVertexBufferObjectManager());
					            		pScene.attachChild(cs4);
					            		activeElements.add(cs4);
		        						
					            		cwc = c4;
		        					}
			            		}
			            		
		        			}

		        			Card h = warCardGame.getHumanCard();
		        			Card hwc = null;
		        			
		        			if ( h == null ) {		        				
		        			
		        				Log.e("Test", "Oh fuck we've got nullage" );		        				
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
			            				mSVGTestTextureRegions[deckMap.get(Util.getSVGFileName(h)).intValue()], getVertexBufferObjectManager());
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
			            				mSVGTestTextureRegions[52], getVertexBufferObjectManager());
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
				            				mSVGTestTextureRegions[deckMap.get(Util.getSVGFileName(h2)).intValue()], getVertexBufferObjectManager());
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
				            				mSVGTestTextureRegions[52], getVertexBufferObjectManager());
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
					            				mSVGTestTextureRegions[deckMap.get(Util.getSVGFileName(h3)).intValue()], getVertexBufferObjectManager());
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
					            				mSVGTestTextureRegions[52], getVertexBufferObjectManager());
					            		pScene.attachChild(hs3);
					            		activeElements.add(hs3);
					            		
					            		warCardGame.getWarPile().add(h3);
					            		
					            		// place h4
					            		Sprite hs4 = new Sprite(
					            				WarActivity.mCameraWidth / 2, 
					            				(WarActivity.mCameraHeight - WarActivity.cardHeight + (3 * cardHeight)) / 2, 
					            				WarActivity.cardWidth,
					            				WarActivity.cardHeight, 
					            				mSVGTestTextureRegions[deckMap.get(Util.getSVGFileName(h4)).intValue()], getVertexBufferObjectManager());
					            		pScene.attachChild(hs4);
					            		activeElements.add(hs4);
		        						
					            		hwc = h4;
		        					}
			            		}			            		
		        			}
		        			
		        			
		        			Log.e("Test", "computer war card:" + cwc.getNumber() + cwc.getSuite() );
		        			Log.e("Test", "human war card:" + hwc.getNumber() + hwc.getSuite() );

		        			checkWar(cwc, hwc);
		        				            	
		            	} else {
		        			
		        			Card c = warCardGame.getComputerCard();
		        			
		        			if ( c == null ) {
		        				throw new HumanWinnerException();
		        			}
		        			
		        			Log.e("Test", "Got computer card:" + Util.getSVGFileName(c) );
		            		Integer cardOne = deckMap.get(Util.getSVGFileName(c));

		            		Card c2 = warCardGame.getHumanCard();
		            		
		        			if ( c2 == null ) {
		        				throw new ComputerWinnerException();
		        			}
		            		
		        			Log.e("Test", "Got human card:" + Util.getSVGFileName(c2) );
		            		Integer cardTwo = deckMap.get(Util.getSVGFileName(c2));	        			
		            		
		            		Log.e("Test", "interesting:" + cardOne.toString() + "-" + cardTwo.toString() );
	
		            		Log.e("Test", "create card one sprite" );
		            		
		            		Sprite sprite = new Sprite(
		            				(WarActivity.mCameraWidth - WarActivity.cardWidth) / 2, 
		            				(WarActivity.mCameraHeight - WarActivity.cardHeight - (2 * cardHeight)) / 2, 
		            				WarActivity.cardWidth,
		            				WarActivity.cardHeight, 
		            				mSVGTestTextureRegions[cardOne.intValue()], getVertexBufferObjectManager());
		            		
		            		Log.e("Test", "attachChild card one sprite" );
	
		            		pScene.attachChild(sprite);
		            		
		            		Log.e("Test", "add card one sprite to active elements" );
		            		
		            		activeElements.add(sprite);
		            		
		            		Log.e("Test", "create card two sprite" );
		            		
		            		Sprite sprite2 = new Sprite((WarActivity.mCameraWidth - WarActivity.cardWidth) / 2, (WarActivity.mCameraHeight - WarActivity.cardHeight + (2 * WarActivity.cardHeight)) / 2, WarActivity.cardWidth,
		            				WarActivity.cardHeight, mSVGTestTextureRegions[cardTwo.intValue()], getVertexBufferObjectManager());
		            		
		            		Log.e("Test", "attachChild card two sprite" );
		            		
		            		pScene.attachChild(sprite2);
		            		
		            		Log.e("Test", "add card two sprite to active elements" );
		            		
		            		activeElements.add(sprite2);
		            		
		            		checkWar(c, c2);
		            		
		        		}
		        		
		        		try {
		        			
		        			Log.i("nwice", "score create text and attach and add to activeelements");
		        			
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
	        				Log.e("Test", "Oh shit! Can't show score maybe no warCardGame:" + e.toString() );
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

		Log.e("Test", "add cards to pile" );
		
		warCardGame.getWarPile().add(computer);
		warCardGame.getWarPile().add(human);
		
		if ( computer.getNumber() == human.getNumber() ) {
			
			Log.e("Test", "war!" );
			
			try {			
				Log.e("Test", "play warSound is loaded:" + warSound.isLoaded() );
				warSound.play();
			} catch(Exception e) {
				Log.e("Test", "failed to play sound:" + e.toString() );
			}
			
			atWar = true;
			
		} else {
			
			atWar = false;
			
			if ( computer.getNumber().equals(CardNumber.TWO) && human.getNumber().equals(CardNumber.ACE) ) {
				try {			
					Log.e("Test", "play tbaSound is loaded:" + tbaSound.isLoaded() );
					tbaSound.play();
				} catch(Exception e) {
					Log.e("Test", "failed to play sound:" + e.toString() );
				}
				
				warCardGame.computerWinner();
				
			} else if ( human.getNumber().equals(CardNumber.TWO) && computer.getNumber().equals(CardNumber.ACE) ) {
				try {			
					Log.e("Test", "play tbaSound is loaded:" + tbaSound.isLoaded() );
					tbaSound.play();
				} catch(Exception e) {
					Log.e("Test", "failed to play sound:" + e.toString() );
				}
				
				warCardGame.humanWinner();
				
			} else if ( Util.getCardValue(computer) > Util.getCardValue(human) ) {
				
				Log.e("Test", "computer wins!" );
				
				warCardGame.computerWinner();
				
			} else {
				
				Log.e("Test", "human wins!" );
				
				warCardGame.humanWinner();
				
			}
			
			Log.e("Test", warCardGame.getSummary() );
			
		}
		
	}
		
}