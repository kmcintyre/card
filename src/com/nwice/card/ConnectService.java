package com.nwice.card;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.preference.PreferenceManager;
import android.util.Log;

public class ConnectService extends Service {

	public static final String NOTIFICATION = "com.nwice.card";
	
	public ConnectService() {
		super();		
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
	public IBinder onBind(Intent arg0) {
		// TODO Auto-generated method stub
		return null;
	}
		
}