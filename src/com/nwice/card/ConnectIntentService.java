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

	public static final String NOTIFICATION_TYPE = "type";
	
	public static final String CONNECT = "connect";
	public static final String MESSAGE = "message";
	public static final String DISCONNECT = "disconnect";

	final WebSocket mConnection = new WebSocketConnection();
	
	public ConnectIntentService() {
		super("ConnectIntentService");		
	}
	
	// Will be called asynchronously be Android
	@Override
	protected void onHandleIntent(Intent intent) {		
		Log.i("nwice", "onHandleIntent:" + intent.getDataString() + " flags:" + intent.getFlags());
		connect(intent);	
	}
	
	private void connect(Intent intent) {
	   
      final String wsuri = "ws://" + 
    		  PreferenceManager.getDefaultSharedPreferences(this).getString("settings_host", "dev.nwice.com") + 
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
               if ( code == 2) {            	   
            	   if ( PreferenceManager.getDefaultSharedPreferences(ConnectIntentService.this).getBoolean("settings_connect", true) ) {
            		   Log.i("nwice", "need to turn off auto-connect");
            		   PreferenceManager.getDefaultSharedPreferences(ConnectIntentService.this).edit().putBoolean("settings_connect", false).commit();            		   
            	   }
            	   Log.i("nwice", "auto-connect: " + PreferenceManager.getDefaultSharedPreferences(ConnectIntentService.this).getBoolean("settings_connect", true));
               }
               sendBroadcast(intent);
            }
         });
      } catch (WebSocketException e) {
         Log.e("nwice", "websocketexception:" + e.toString());
      }
	}
	
}