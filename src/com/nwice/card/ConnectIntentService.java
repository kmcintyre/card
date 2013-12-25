package com.nwice.card;

import android.app.IntentService;
import android.content.Intent;
import android.preference.PreferenceManager;
import android.util.Log;
import de.tavendo.autobahn.WebSocket;
import de.tavendo.autobahn.WebSocketConnection;
import de.tavendo.autobahn.WebSocketConnectionHandler;
import de.tavendo.autobahn.WebSocketException;

public class ConnectIntentService extends IntentService {

	
	public static final String NOTIFICATION = "notification";
	public static final String NOTIFICATION_CONNECT = "connect";	
	public static final String NOTIFICATION_DISCONNECT = "disconnect";

	public static final String MESSAGE = "message";	
	public static final String MESSAGE_JSON = "message_json";
	
	public static final String ACTION_CONNECT = "connect";
	public static final String ACTION_DISCONNECT = "disconnect";

	final WebSocket mConnection = new WebSocketConnection();
	
	public ConnectIntentService() {
		super("ConnectIntentService");		
	}
	
	// Will be called asynchronously by Android
	@Override
	protected void onHandleIntent(Intent intent) {				
		Log.i("ConnectIntentService", "action:" + intent.getAction() + " type:" + (intent.getType() == null ? "null" : intent.getType()) + " onHandleIntent:" + intent.getDataString() + " flags:" + intent.getFlags());		
		if ( intent.getAction().equals(ACTION_CONNECT) ) {
			Log.i("ConnectIntentService", "connect");
			connect(intent);
		} else if ( intent.getAction().equals(ACTION_DISCONNECT) ) {
			Log.i("ConnectIntentService", "disconnect");
			mConnection.disconnect();			
		}
	}
	
	private void connect(Intent intent) {
	   
      final String wsuri = "ws://" + 
    		  PreferenceManager.getDefaultSharedPreferences(this).getString("settings_host", "dev.nwice.com") + 
    		  ":" + 
    		  PreferenceManager.getDefaultSharedPreferences(this).getString("settings_port", "8080");
      
      Log.i("ConnectIntentService", "connect to:" + wsuri);
      
      try {    	  
    	  mConnection.connect(wsuri, new WebSocketConnectionHandler() {
            
        	@Override
            public void onOpen() {
               Log.i("ConnectIntentService", "onOpen()");
               Intent intent = new Intent(NOTIFICATION);
               intent.putExtra(NOTIFICATION_CONNECT, "okay connected");
               sendBroadcast(intent);            
            }

            @Override
            public void onTextMessage(String message) {
               Log.i("ConnectIntentService", "onTextMessage:" + message);
               Intent intent = new Intent(MESSAGE);
               intent.putExtra(MESSAGE_JSON, message);
               sendBroadcast(intent);
            }

            @Override
            public void onClose(int code, String reason) {
               Log.i("ConnectIntentService", "Connection lost - " + code + " reason:" + reason);
               Intent intent = new Intent(NOTIFICATION);
               intent.putExtra(NOTIFICATION_DISCONNECT, "disconnect reason:" + code);                              
               if ( code == 2) {            	   
            	   if ( PreferenceManager.getDefaultSharedPreferences(ConnectIntentService.this).getBoolean("settings_connect", true) ) {
            		   Log.i("ConnectIntentService", "do we need to turn off auto-connect?");
            		   //PreferenceManager.getDefaultSharedPreferences(ConnectIntentService.this).edit().putBoolean("settings_connect", false).commit();            		   
            	   }
            	   Log.i("ConnectIntentService", "auto-connect: " + PreferenceManager.getDefaultSharedPreferences(ConnectIntentService.this).getBoolean("settings_connect", true));
               }
               sendBroadcast(intent);
            }            
            
         });
      } catch (WebSocketException e) {
         Log.e("nwice", "websocketexception:" + e.toString());
      }
	}
	
}