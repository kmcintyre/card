package com.nwice.card;

import android.app.IntentService;
import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.preference.PreferenceManager;
import android.util.Log;

import de.tavendo.autobahn.WebSocket;
import de.tavendo.autobahn.WebSocketConnection;

public class ConnectService extends IntentService {

	public static final String NOTIFICATION = "com.nwice.card";
	
	private final WebSocket mConnection = new WebSocketConnection();
	
	public ConnectService() {
		super("ConnectService");		
	}
	
	@Override
	public void onCreate() {
		Log.i("nwice", "onCreate");
		super.onCreate();
	}
	
	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
		Log.i("nwice", "onStartCommand flags:" + flags + " startId:" + startId);
		if ( PreferenceManager.getDefaultSharedPreferences(this).getBoolean("settings_connect", true) ) {
			Log.i("nwice", "need to auto-connect");			
		} else {
			Log.i("nwice", "no auto-connect");
		}
		return Service.START_NOT_STICKY;
	}

	@Override
	public IBinder onBind(Intent intent) {
		Log.i("nwice", "onBind");
		return null;
	}
	
	// Will be called asynchronously be Android
	@Override
	protected void onHandleIntent(Intent intent) {
		Log.i("nwice", "onHandleIntent:" + intent);
		publishResults();
	}
	
	
	private void publishResults() {
		Intent intent = new Intent(NOTIFICATION);		
		sendBroadcast(intent);
	}
	
}