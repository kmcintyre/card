package com.nwice.card;

import java.util.Arrays;

import com.facebook.Request;
import com.facebook.Response;
import com.facebook.Session;
import com.facebook.SessionState;
import com.facebook.model.GraphUser;
import com.facebook.widget.LoginButton;

import android.annotation.SuppressLint;
import android.app.Fragment;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

@SuppressLint("NewApi")
public class LoginFragment extends Fragment {

   @Override
   public View onCreateView(
	   LayoutInflater inflater, 
	   ViewGroup container,
       Bundle savedInstanceState) {
	   Log.d("LoginFragment", "onCreateView");	   
	   View view = inflater.inflate(R.layout.fragment_login, container, false);
	   LoginButton authButton = (LoginButton) view.findViewById(R.id.authButton);
	   authButton.setReadPermissions(Arrays.asList("basic_info"));	   
	   /*
	   Log.i("MainActivity", "openActiveSession");
	   Session.openActiveSession(this.getActivity(), true, new Session.StatusCallback() {
		    // callback when session changes state
			@Override
			public void call(Session session, SessionState state,
					Exception exception) {
				Log.i("MainActivity", "call");
	
		        if (session.isOpened()) {
		        	Log.i("MainActivity", "session.isOpened");
		        	Request.newMeRequest(session, new Request.GraphUserCallback() {
		        		
		        		  @Override
		        		  public void onCompleted(GraphUser user, Response response) {
		        		    if (user != null) {
		        		      Log.i("MainActivity", "onCompleted user-" + user.getName());
		        		      //TextView welcome = (TextView) findViewById(R.id.main_fragment);
		        		      //welcome.setText("Hello " + user.getName() + "!");		        		      
		        		      MainActivity.mMenu.findItem(R.id.menu_login).setTitle("FB");		        		      
		        		    } 
		        		  }

		        		}).executeAsync();		        	
		        }
			}
	    });
	   */	   
	   return view;	   
   }

   
}