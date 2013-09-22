package com.nwice.card;

import com.nwice.card.R;

import android.os.Bundle;
import android.app.Activity;
import android.content.Intent;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;

public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    } 

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }
    
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle item selection
        switch (item.getItemId()) {
        case R.id.menu_login:
            return true;
        case R.id.menu_settings:
            Intent intent = new Intent(this, SettingsActivity.class);
            startActivity(intent);
            return true;
        default:
            return super.onOptionsItemSelected(item);
        }
    }    
    
    
    public void war(View v)
    {
        Intent i=new Intent();
        i.setClass(this,WarActivity.class);
        startActivity(i);
    }
    
    public void blackjack(View v)
    {
        Intent i=new Intent();
        i.setClass(this,BlackjackActivity.class);
        startActivity(i);
    }

    public void deck(View v)
    {
        Intent i=new Intent();
        i.setClass(this,DeckActivity.class);
        startActivity(i);
    }

}
