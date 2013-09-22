package com.nwice.card;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;

public class SettingsActivity extends Activity {
    
	@SuppressLint("NewApi")
	@Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Display the fragment as the main content.
        getFragmentManager().beginTransaction()
                .replace(android.R.id.content, new SettingsFragment())
                .commit();
    }	
	
}