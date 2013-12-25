package com.nwice.card;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.widget.ImageView;
import android.widget.RelativeLayout;

public class BlackjackActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
    	Log.i("BlackjackActivity", "onCreate");
        super.onCreate(savedInstanceState);
        
        
        
        // Create a LinearLayout in which to add the ImageView
        RelativeLayout rl = new RelativeLayout(this);

        // Instantiate an ImageView and define its properties
        ImageView i = new ImageView(this);
        //i.setImageResource(R.drawable);
        // Add the ImageView to the layout and set the layout as the content view
        rl.addView(i);

        setContentView(R.layout.activity_blackjack);
    }
    
}
