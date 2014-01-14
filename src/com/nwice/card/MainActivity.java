package com.nwice.card;

import android.app.Activity;
import android.app.FragmentManager;
import android.app.FragmentTransaction;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Toast;

public class MainActivity extends Activity {
	
	protected static Menu mMenu;
	
	/*
	 * We're only gettting 'notifications'
	 */
	private BroadcastReceiver receiver = new BroadcastReceiver() {		
		@Override
		public void onReceive(Context context, Intent intent) {
			
			Log.i("MainActivity", "onReceive");
			if ( intent.getExtras().getString(ConnectIntentService.NOTIFICATION_CONNECT) != null ) {
	    		MainActivity.mMenu.findItem(R.id.menu_connect).setTitle("Disconnect");
	    		//MainActivity.mMenu.findItem(R.id.menu_connect).setEnabled(true);
	    		//Toast.makeText(MainActivity.this, "connected", Toast.LENGTH_LONG).show();
			} else if ( intent.getExtras().getString(ConnectIntentService.NOTIFICATION_DISCONNECT) != null ) {
				MainActivity.mMenu.findItem(R.id.menu_connect).setTitle("Connect");
				Toast.makeText(MainActivity.this, "disconnected!", Toast.LENGTH_LONG).show();
			}
		}
		
	};
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		Log.d("MainActivity", "onCreate");
		super.onCreate(savedInstanceState);		
		setContentView(R.layout.activity_main);

		if ( PreferenceManager.getDefaultSharedPreferences(this).getBoolean("settings_connect", true) ) {
			Log.i("MainActivity", "need to auto-connect");
			Intent connect = new Intent(this, ConnectIntentService.class);
			connect.setAction(ConnectIntentService.ACTION_CONNECT);
			startService( connect );
		} else {
			Log.i("MainActivity", "no auto-connect");
		}
		
		Log.i("MainActivity", "create fragment"); 
		FragmentManager fm = getFragmentManager();
		FragmentTransaction ft = fm.beginTransaction();					
		MainFragment mf = new MainFragment();
		ft.add(R.id.main_activity,  mf);
		ft.commit();	
	}
	
	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		Log.d("MainActivity", "onCreateOptionsMenu");
		getMenuInflater().inflate(R.menu.main, menu);		
		MainActivity.mMenu = menu;		
		Log.d("MainActivity", "setCreateOptionsMenu");		
		return true;
	}	
	
	@Override
	protected void onResume() {
		Log.d("MainActivity", "onResume");
		super.onResume();		
		registerReceiver(receiver, new IntentFilter(ConnectIntentService.NOTIFICATION));
	}

	@Override
	protected void onPause() {
		Log.d("MainActivity", "onPause");		
		super.onPause();
		unregisterReceiver(receiver);
	}
	
	public boolean onOptionsItemSelected(MenuItem item) {
		Log.d("MainActivity", "selected item:" + item.getItemId());
		FragmentManager fm = getFragmentManager();
		FragmentTransaction ft = fm.beginTransaction();
		switch (item.getItemId()) {
			case R.id.menu_connect:
				Log.i("MainActivity", "menu_connect");
				if ( fm.findFragmentByTag("cf") == null ) {
					Log.i("MainActivity", "create fragment_connect");
					ft.add(R.id.main_activity, new ConnectFragment(), "cf" );
					ft.commit();				
					return true;
				} else {
					Log.i("MainActivity", "fragment_connect exists");
					return false;
				}
			case R.id.menu_settings:
				
				Log.d("MainActivity", "switch settings");				
				if ( fm.findFragmentByTag("sf") == null ) {
					Log.i("MainActivity", "create settings");
					ft.add(R.id.main_activity,  new SettingsFragment(), "sf" );
					ft.commit();				
					return true;
				} else {
					Log.i("MainActivity", "fragment_setting exists");
					return false;
				}
			case R.id.menu_multi:
				Log.d("MainActivity", "switch multi");				
				if ( fm.findFragmentByTag("mf") == null ) {
					Log.i("MainActivity", "create fragment_login");
					ft.add(R.id.main_activity,  new MultiFragment(), "mf" );
					ft.commit();				
					return true;
				} else {
					Log.i("MainActivity", "fragment_login exists");
					return false;
				}				
				
			case R.id.menu_login:
				Log.d("MainActivity", "switch login");				
				if ( fm.findFragmentByTag("lf") == null ) {
					Log.i("MainActivity", "create fragment_login");
					ft.add(R.id.main_activity,  new LoginFragment(), "lf" );
					ft.commit();				
					return true;
				} else {
					Log.i("MainActivity", "fragment_login exists");
					return false;
				}
			default:
				Log.d("MainActivity", "switch default");
				return false;
		}
	}
	
	public void toggle_connection(View v) {
		Log.d("MainActivity", "toggle_connection:" + MainActivity.mMenu.findItem(R.id.menu_connect).getTitle().toString());
		if ( MainActivity.mMenu.findItem(R.id.menu_connect).getTitle().toString().equals("Connect") ) {
			Log.d("MainActivity", "connect!!!");
			Intent connect = new Intent(this, ConnectIntentService.class);
			connect.setAction(ConnectIntentService.ACTION_CONNECT);
			startService( connect );			
		} else if ( MainActivity.mMenu.findItem(R.id.menu_connect).getTitle().toString().equals("Disconnect") ) {
			Log.d("MainActivity", "disconnect");
			Intent disconnect = new Intent(this, ConnectIntentService.class);
			disconnect.setAction(ConnectIntentService.ACTION_DISCONNECT);
			startService(disconnect);
		} else {
			Log.d("MainActivity", MainActivity.mMenu.findItem(R.id.menu_connect).getTitle().toString() );
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
