package com.nwice.card;

import android.app.IntentService;
import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.preference.PreferenceManager;
import android.util.Log;

import de.tavendo.autobahn.WebSocket;
import de.tavendo.autobahn.WebSocketConnection;
import de.tavendo.autobahn.WebSocketConnectionHandler;
import de.tavendo.autobahn.WebSocketException;

public class ConnectIntentService extends IntentService {

	public static final String NOTIFICATION_TYPE = "type";
	
	public static final String CONNECT = "connect";
	public static final String MESSAGE = "message";
	public static final String DISCONNECT = "disconnect";
	
	private final WebSocket mConnection = new WebSocketConnection();
	
	public ConnectIntentService() {
		super("ConnectIntentService");		
	}
	
	// Will be called asynchronously be Android
	@Override
	protected void onHandleIntent(Intent intent) {
		Log.i("nwice", "onHandleIntent:" + intent);
		if ( !mConnection.isConnected() ) {
			connect();
		} else {
			mConnection.disconnect();
		}
	}
	
	private void connect() {
	   
      final String wsuri = "ws://" + PreferenceManager.getDefaultSharedPreferences(this).getString("settings_host", "me.nwice.com") + 
    		  ":" + 
    		  PreferenceManager.getDefaultSharedPreferences(this).getString("settings_port", "8080");
      
      Log.i("nwice", "connect to:" + wsuri);
      
      try {
         mConnection.connect(wsuri, new WebSocketConnectionHandler() {
            
        	@Override
            public void onOpen() {
               Log.i("nwice", "onOpen()");
               Intent intent = new Intent(ConnectService.NOTIFICATION);
               intent.putExtra(NOTIFICATION_TYPE, CONNECT);
               sendBroadcast(intent);
            }

            @Override
            public void onTextMessage(String message) {
               Log.i("nwice", "onTextMessage:" + message);
               Intent intent = new Intent(ConnectService.NOTIFICATION);
               intent.putExtra(NOTIFICATION_TYPE, MESSAGE);
               intent.putExtra(MESSAGE, message);
               sendBroadcast(intent);
            }

            @Override
            public void onClose(int code, String reason) {
               Log.i("nwice", "Connection lost - " + code + " reason:" + reason);
               Intent intent = new Intent(ConnectService.NOTIFICATION);
               intent.putExtra(NOTIFICATION_TYPE, DISCONNECT);               
               sendBroadcast(intent);
            }
         });
      } catch (WebSocketException e) {
         Log.e("nwice", e.toString());
      }
	}
	
}