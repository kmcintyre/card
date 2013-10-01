package com.nwice.card;

import com.nwice.card.R;

import android.os.Bundle;
import android.preference.PreferenceManager;
import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Toast;
import android.util.Log;

public class MainActivity extends Activity {
	
	private static Menu mMenu;
	
	private BroadcastReceiver receiver = new BroadcastReceiver() {
		@Override
		public void onReceive(Context context, Intent intent) {
			Log.i("nwice", "onReceive");
			Bundle bundle = intent.getExtras();
		    if (bundle != null) {
		    	String type = bundle.getString(ConnectIntentService.NOTIFICATION_TYPE);
		    	Log.i("nwice", "type:" + type);
		    	if ( type.equals(ConnectIntentService.CONNECT)) {
		    		MainActivity.mMenu.findItem(R.id.menu_connect).setTitle("disconnect");
		    		MainActivity.mMenu.findItem(R.id.menu_connect).setEnabled(true);
		    		Toast.makeText(MainActivity.this, "connected", Toast.LENGTH_LONG).show();
		    	} else if ( type.equals(ConnectIntentService.DISCONNECT)) {
		    		MainActivity.mMenu.findItem(R.id.menu_connect).setTitle("connect");
		    		MainActivity.mMenu.findItem(R.id.menu_connect).setEnabled(true);
		    		Toast.makeText(MainActivity.this, "disconnected!", Toast.LENGTH_LONG).show();
		    	} else if ( type.equals(ConnectIntentService.MESSAGE)) {
		    		String msg = bundle.getString(ConnectIntentService.MESSAGE);
		    		Toast.makeText(MainActivity.this, msg, Toast.LENGTH_LONG).show();		    		
		    		Log.i("nwice", msg);
		    		
		    	}	
		    }
		}
	};
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		Log.d("nwice", "onCreate");
		super.onCreate(savedInstanceState);		
		setContentView(R.layout.activity_main);
		if ( PreferenceManager.getDefaultSharedPreferences(this).getBoolean("settings_connect", true) ) {
			Log.i("nwice", "need to auto-connect");
			startService( new Intent(this, ConnectIntentService.class) );
		} else {
			Log.i("nwice", "no auto-connect");
		}								
	}
	
	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		Log.d("nwice", "onCreateOptionsMenu");
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.main, menu);
		MainActivity.mMenu = menu;
		Log.d("nwice", "setCreateOptionsMenu");
		return true;
	}

	@Override
	protected void onResume() {
		Log.d("nwice", "onResume");
		super.onResume();		
		registerReceiver(receiver, new IntentFilter(ConnectService.NOTIFICATION));
	}

	@Override
	protected void onPause() {
		Log.d("nwice", "onPause");		
		super.onPause();
		unregisterReceiver(receiver);
	}

	public boolean onOptionsItemSelected(MenuItem item) {
		Log.d("nwice", "selected item:" + item.getItemId());
		switch (item.getItemId()) {
			case R.id.menu_connect:
				//startService( new Intent(this, ConnectIntentService.class) );
				if ( PreferenceManager.getDefaultSharedPreferences(this).getBoolean("settings_connect", true) ) {
					item.setEnabled(false);
					startService( new Intent(this, ConnectIntentService.class) );
				} else {
					startActivity(new Intent(this, ConnectActivity.class));
				}								
				return true;
			case R.id.menu_settings:
				Intent intent = new Intent(this, SettingsActivity.class);
				startActivity(intent);
				return true;
			default:
				return super.onOptionsItemSelected(item);
		}
	}

	public void war(View v) {
		Intent i = new Intent();
		i.setClass(this, WarActivity.class);
		startActivity(i);
	}

	public void blackjack(View v) {
		Intent i = new Intent();
		i.setClass(this, BlackjackActivity.class);
		startActivity(i);
	}

	public void deck(View v) {
		Intent i = new Intent();
		i.setClass(this, DeckActivity.class);
		startActivity(i);
	}

}
