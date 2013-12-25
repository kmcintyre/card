package com.nwice.card;

import android.content.Context;
import android.util.AttributeSet;
import android.util.Log;
import android.widget.ImageView;

public class GameView extends ImageView {


	public GameView(Context context) {		
		super(context);
		Log.i("GameView ", "yo");
	}

	
	public GameView (Context context, AttributeSet attrs) {
		super(context, attrs);
		Log.i("GameView ", "yo2");
		// TODO Auto-generated constructor stub
	}

	
	public GameView (Context context, AttributeSet attrs, int defStyle) {
		super(context, attrs, defStyle);
		Log.i("GameView", "yo3");
		// TODO Auto-generated constructor stub
	}


	
}
