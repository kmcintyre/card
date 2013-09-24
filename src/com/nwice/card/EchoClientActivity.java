package com.nwice.card;

import com.nwice.card.R;

import android.app.Activity;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.Gravity;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import de.tavendo.autobahn.WebSocket;
import de.tavendo.autobahn.WebSocketConnection;
import de.tavendo.autobahn.WebSocketException;
import de.tavendo.autobahn.WebSocketConnectionHandler;

public class EchoClientActivity extends Activity {

   static EditText mHostname;
   static EditText mPort;
   static TextView mStatusline;
   static Button mStart;

   static EditText mMessage;
   static Button mSendMessage;

   private SharedPreferences mSettings;

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

   private void loadPrefs() {
      mHostname.setText(mSettings.getString("hostname", "me.nwice.com"));
      mPort.setText(mSettings.getString("port", "8080"));
   }

   private void savePrefs() {

      SharedPreferences.Editor editor = mSettings.edit();
      editor.putString("hostname", mHostname.getText().toString());
      editor.putString("port", mPort.getText().toString());
      editor.commit();
   }

   private void setButtonConnect() {
	   mStart.setText("Connect");
      mHostname.setEnabled(true);
      mPort.setEnabled(true);
      
      mStart.setText("Connect");
      
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
        		Log.i("nwice", "close");
        		mConnection.disconnect();
        	} catch (Exception e) {
        		Log.i("nwice", "exception:" + e);
        	}
         }
      });
   }

   private final WebSocket mConnection = new WebSocketConnection();   

   private void start() {

	   Log.i("nwice", "debug: start");
	   
      final String wsuri = "ws://" + mHostname.getText() + ":" + mPort.getText();

      mStatusline.setText("Status: Connecting to " + wsuri + " ..");
      
      Log.i("nwice", "debug: start 1:" + wsuri);
      
      setButtonDisconnect();
      
      Log.i("nwice", "debug: start 2");

      try {
         mConnection.connect(wsuri, new WebSocketConnectionHandler() {
            @Override
            public void onOpen() {
            	Log.i("nwice", "onOpen()");
               mStatusline.setText("Status: Connected to " + wsuri);
               savePrefs();
               mSendMessage.setEnabled(true);
               mMessage.setEnabled(true);
            }

            @Override
            public void onTextMessage(String payload) {
               Log.i("nwice", "onTextMessage()");
               alert("Got echo: " + payload);
            }

            @Override
            public void onClose(int code, String reason) {
            	Log.i("nwice", "Connection lost - " + code + " reason:" + reason);
               alert("Connection lost.");
               mStatusline.setText("Status: Ready.");
               setButtonConnect();
               mSendMessage.setEnabled(false);
               mMessage.setEnabled(false);
            }
         });
      } catch (WebSocketException e) {
         Log.e("nwice", e.toString());
      }
   }

   @Override
   public void onCreate(Bundle savedInstanceState) {

      super.onCreate(savedInstanceState);
      setContentView(R.layout.activity_echo);

      mHostname = (EditText) findViewById(R.id.hostname);
      mPort = (EditText) findViewById(R.id.port);
      mStatusline = (TextView) findViewById(R.id.statusline);
      mStart = (Button) findViewById(R.id.start);
      mMessage = (EditText) findViewById(R.id.msg);
      mSendMessage = (Button) findViewById(R.id.sendMsg);

      mSettings = getSharedPreferences("nwice", 0);
      loadPrefs();

      setButtonConnect();
      mSendMessage.setEnabled(false);
      mMessage.setEnabled(false);

      mSendMessage.setOnClickListener(new Button.OnClickListener() {
         public void onClick(View v) {
            mConnection.sendTextMessage(mMessage.getText().toString());
         }
      });
   }

   @Override
   protected void onDestroy() {
       super.onDestroy();
       if (mConnection.isConnected()) {
          mConnection.disconnect();
       }
   }

   @Override
   public boolean onCreateOptionsMenu(Menu menu) {
       MenuInflater inflater = getMenuInflater();
       inflater.inflate(R.menu.echo, menu);
       return true;
   }

   @Override
   public boolean onOptionsItemSelected(MenuItem item) {
      switch (item.getItemId()) {
         case R.id.quit:
            finish();
            break;
         default:
            return super.onOptionsItemSelected(item);
      }
      return true;
   }
}

