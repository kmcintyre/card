package com.nwice.card;

import com.nwice.card.R;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.Gravity;

import android.view.View;

import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import de.tavendo.autobahn.WebSocket;
import de.tavendo.autobahn.WebSocketConnection;
import de.tavendo.autobahn.WebSocketException;
import de.tavendo.autobahn.WebSocketConnectionHandler;

public class ConnectActivity extends Activity {

   static EditText mHostname;
   static EditText mPort;
   static Button mStart;

   private final WebSocket mConnection = new WebSocketConnection();

   private void alert(String message) {
	  Log.i("nwice", "alert:" + message);
	  try {
		  Toast toast = Toast.makeText(getApplicationContext(), message, Toast.LENGTH_SHORT);
	      toast.setGravity(Gravity.TOP | Gravity.CENTER_HORIZONTAL, 0, 0);      
	      toast.show();
	  } catch (Exception e) {
		  Log.e("nwice", "exception:" + e.toString());
	  }
   }
   
   private void setButtonConnect() {
	  mStart.setText("Connect");      
	  mHostname.setEnabled(true);
      mPort.setEnabled(true);
      mStart.setOnClickListener(new Button.OnClickListener() {
         public void onClick(View v) {
        	 Log.i("nwice", "please start");
            start();
         }
      });
   }

   private void setButtonDisconnect() {
      mHostname.setEnabled(false);
      mPort.setEnabled(false);      
      mStart.setText("Disconnect");
      mStart.setOnClickListener(new Button.OnClickListener() {
         public void onClick(View v) {
        	try {
        		setButtonConnect();
        		if ( mConnection.isConnected() ) {
        			Log.i("nwice", "close");
        			mConnection.disconnect();
        		}
        	} catch (Exception e) {
        		Log.i("nwice", "exception:" + e);
        	}
         }
      });
   }     

   private void start() {

      final String wsuri = "ws://" + mHostname.getText() + ":" + mPort.getText();

      setButtonDisconnect();
      
      Log.i("nwice", "connect to:" + wsuri);
      
      try {
         mConnection.connect(wsuri, new WebSocketConnectionHandler() {
            
        	@Override
            public void onOpen() {
               Log.i("nwice", "onOpen()");
            }

            @Override
            public void onTextMessage(String message) {
               Log.i("nwice", "onTextMessage:" + message);
               alert(message);
            }

            @Override
            public void onClose(int code, String reason) {
               Log.i("nwice", "Connection lost - " + code + " reason:" + reason);
               setButtonConnect();
            }
         });
      } catch (WebSocketException e) {
         Log.e("nwice", e.toString());
      }
   }

   @Override
   public void onCreate(Bundle savedInstanceState) {

      super.onCreate(savedInstanceState);
      setContentView(R.layout.activity_connect);

      mHostname = (EditText) findViewById(R.id.hostname);
      mPort = (EditText) findViewById(R.id.port);
      mStart = (Button) findViewById(R.id.start);

      mHostname.setText("me.nwice.com");
      mPort.setText("8080");
      
      setButtonConnect();
   }

   @Override
   protected void onDestroy() {
       super.onDestroy();
       if (mConnection.isConnected()) {
          mConnection.disconnect();
       }
   }

}