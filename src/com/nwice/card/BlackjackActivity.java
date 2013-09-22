package com.nwice.card;

import com.nwice.card.R;

import android.os.Bundle;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.app.Activity;

public class BlackjackActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
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
