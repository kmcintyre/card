package com.nwice.card;

import android.annotation.SuppressLint;
import android.app.Fragment;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences.Editor;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.util.Log;
import android.view.GestureDetector;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.EditText;

@SuppressLint("NewApi")
public class ConnectFragment extends Fragment {

   static EditText mHostname;
   static EditText mPort;
   static Button mStart;
   static CheckBox mAutoConnect;

	private BroadcastReceiver receiver = new BroadcastReceiver() {
		@Override
		public void onReceive(Context context, Intent intent) {
			Log.i("ConnectFragment", "onReceive" + intent);
			if ( intent.getExtras().getString(ConnectIntentService.NOTIFICATION_CONNECT) != null ) {
				connected();
				Editor edit = PreferenceManager.getDefaultSharedPreferences(getActivity()).edit();
	    		   edit.putString("settings_port", mPort.getText().toString().toString());
	    		   edit.putString("settings_hostname", mHostname.getText().toString().toString());
	    		   edit.apply();				
			} else if ( intent.getExtras().getString(ConnectIntentService.NOTIFICATION_DISCONNECT) != null ) {
				disconnected();
			}
		}
	};	
	
	public void connected() { 
		mStart.setText("Disconnect");
		mHostname.setEnabled(false);
		mPort.setEnabled(false);
	   	mStart.setOnClickListener(new View.OnClickListener() {
             public void onClick(View v) {            	
            	Log.i("ConnectFragment", "calling disconnect");
     			Intent disconnect = new Intent(getActivity(), ConnectIntentService.class);
     			disconnect.setAction(ConnectIntentService.ACTION_DISCONNECT);
    			getActivity().startService(disconnect);
             }
        });
	}
	
	public void disconnected() { 
		mStart.setText("Connect");
		mHostname.setEnabled(true);
		mPort.setEnabled(true);
	   	mStart.setOnClickListener(new View.OnClickListener() {
             public void onClick(View v) {
            	Log.i("ConnectFragment", "calling connect");
      			Intent connect = new Intent(getActivity(), ConnectIntentService.class);
     			connect.setAction(ConnectIntentService.ACTION_CONNECT);
     			getActivity().startService( connect );            	 
             }
        });
	}

	@Override
	public void onStop() {
		Log.d("ConnectFragment", "onStop");
		super.onStart();		
		getActivity().unregisterReceiver(receiver);
	}
	
	@Override
	public void onStart() {
		Log.d("ConnectFragment", "onStart");
		super.onStart();		
		getActivity().registerReceiver(receiver, new IntentFilter(ConnectIntentService.NOTIFICATION));
	}
	
   @Override
   public View onCreateView(LayoutInflater inflater, ViewGroup container,
       Bundle savedInstanceState) {
	 Log.d("ConnectFragment", "onCreateView");
     View view = inflater.inflate(R.layout.fragment_connect, container, false);
     
     mHostname = (EditText) view.findViewById(R.id.hostname);
     mHostname.setText( PreferenceManager.getDefaultSharedPreferences(getActivity()).getString("settings_host", "dev.nwice.com") );
     mPort = (EditText) view.findViewById(R.id.port);
     mPort.setText( PreferenceManager.getDefaultSharedPreferences(getActivity()).getString("settings_port", "8080") );
     
     mAutoConnect = (CheckBox) view.findViewById(R.id.autoconnect);
     
     boolean checked = PreferenceManager.getDefaultSharedPreferences(getActivity()).getBoolean("settings_connect", true);
     Log.d("ConnectFragment", "auto connect:" + checked);
     
     mAutoConnect.setChecked( checked  );
     mStart = (Button) view.findViewById(R.id.start);
     mStart.setText(MainActivity.mMenu.findItem(R.id.menu_connect).getTitle());
     
     if ( MainActivity.mMenu.findItem(R.id.menu_connect).getTitle().toString().equalsIgnoreCase("disconnect") ) {
    	 connected();
     } else {
    	 disconnected();
     }
     
     mAutoConnect.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
    	   @Override
    	   public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
    		   Log.d("ConnectFragment", "Pref " + buttonView.getId() + " changed to " + isChecked);
    		   Editor edit = PreferenceManager.getDefaultSharedPreferences(getActivity()).edit();
    		   edit.putBoolean("settings_connect", isChecked);
    		   edit.apply();
    	   }
     });
    
     return view;
   }
   
}