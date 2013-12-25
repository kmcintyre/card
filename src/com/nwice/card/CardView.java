package com.nwice.card;

import android.content.Context;
import android.util.AttributeSet;
import android.util.Log;
import android.widget.ImageView;

public class CardView extends ImageView {

	public CardView(Context context) {		
		super(context);
		Log.i("CardView", "yo");
	}

	
	public CardView(Context context, AttributeSet attrs) {
		super(context, attrs);
		Log.i("CardView", "yo2");
		// TODO Auto-generated constructor stub
	}
	
	public CardView(Context context, AttributeSet attrs, int defStyle) {
		super(context, attrs, defStyle);
		Log.i("CardView", "yo3");
		// TODO Auto-generated constructor stub
	}
	
}
