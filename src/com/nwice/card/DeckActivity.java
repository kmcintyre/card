package com.nwice.card;

import com.nwice.test.R;

import android.os.Bundle;
import android.app.Activity;
import android.view.Menu;

public class DeckActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_deck);
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.deck, menu);
        return true;
    }    
    
}
