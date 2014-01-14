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
	
	public static final WebSocket mConnection = new WebSocketConnection();
	
	public ConnectIntentService() {
		super("ConnectIntentService");		
	}
	
	@Override
	protected void onHandleIntent(Intent intent) {				
		Log.i("ConnectIntentService", "isconnected:" + mConnection.isConnected() + " action:" + intent.getAction() + " type:" + (intent.getType() == null ? "null" : intent.getType()) + " onHandleIntent:" + intent.getDataString() + " flags:" + intent.getFlags());		
		if ( intent.getAction().equals(ACTION_CONNECT) ) {
			if ( !mConnection.isConnected() ) {
				Log.i("ConnectIntentService", "connect");
				connect();
			} else {
				Log.i("ConnectIntentService", "re-connect");
	            Intent connected = new Intent(NOTIFICATION);
	            connected.putExtra(NOTIFICATION_CONNECT, "okay connected");
	            sendBroadcast(connected);				
			}
		} else if ( intent.getAction().equals(ACTION_DISCONNECT) && mConnection.isConnected() ) {
			Log.i("ConnectIntentService", "disconnect");
			mConnection.disconnect();
		} else {
			Log.i("ConnectIntentService", "unknown intent");			
		}
	}
	
	private void connect() {
	   
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
               sendBroadcast(intent);
               
               if ( code == 2) {            	   
            	   if ( PreferenceManager.getDefaultSharedPreferences(ConnectIntentService.this).getBoolean("settings_connect", true) ) {
            		   Log.i("ConnectIntentService", "do we need to turn off auto-connect?");            		   
            	   }
            	   Log.i("ConnectIntentService", "auto-connect: " + PreferenceManager.getDefaultSharedPreferences(ConnectIntentService.this).getBoolean("settings_connect", true));
               }               
            }                        
         });
      } catch (WebSocketException e) {
         Log.e("ConnectIntentService", "websocketexception:" + e.toString());
      }
	}
	
}