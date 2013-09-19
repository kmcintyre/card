package com.nwice.card;

import com.nwice.test.R;

import android.os.Bundle;
import android.app.Activity;
import android.view.Menu;

public class BlackjackActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_blackjack);
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.blackjack, menu);
        return true;
    }    
    
}
