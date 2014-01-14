package com.nwice.card;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import android.annotation.SuppressLint;
import android.app.Fragment;
import android.content.BroadcastReceiver;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.util.Log;
import android.view.GestureDetector;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.Toast;

@SuppressLint("NewApi")
public class MainFragment extends Fragment {	
	
	private ImageView cardview;

	/*
	 * We're only gettting 'notifications'
	 */	
	private BroadcastReceiver receiver = new BroadcastReceiver() {		
		@Override
		public void onReceive(android.content.Context context, Intent intent) {
			Log.i("MainFragment", "onReceive");			
			if ( intent.getExtras().getString(ConnectIntentService.MESSAGE_JSON) != null ) {

				Toast.makeText(getActivity(), intent.getExtras().getString(ConnectIntentService.MESSAGE_JSON), Toast.LENGTH_LONG).show();
				
			    Map<String,String> map = new HashMap<String,String>();
			    ObjectMapper mapper = new ObjectMapper();			     
		    	try {		     
		    		map = mapper.readValue(intent.getExtras().getString(ConnectIntentService.MESSAGE_JSON), new TypeReference<HashMap<String,String>>(){});

		    		if ( map.get("card") != null ) {
						try 
						{
						    InputStream ims = context.getAssets().open("gfx/deck/png/" + map.get("card") + map.get("suite") + ".png");				    		
						    Drawable d = Drawable.createFromStream(ims, null);
						    cardview.setImageDrawable(d);
						} catch(IOException ex) 
						{
							Toast.makeText(getActivity(), ex.toString(), Toast.LENGTH_LONG).show();
						    return;
						}				
		    		}
		    	} catch (Exception e) {
					Toast.makeText(getActivity(), e.toString(), Toast.LENGTH_LONG).show();
					Log.e("MainFragment", "jackson mapper", e);
				    return;
		    	}			 
			}
		}
	};
	
	@Override
	public void onStart() {
		super.onStart();
		Log.d("MainFragment", "onStart");
		getActivity().registerReceiver(receiver, new IntentFilter(ConnectIntentService.MESSAGE));
	}		
	
	
	public void onStop() {
		super.onStop();
		Log.d("MainFragment", "onStop");
		getActivity().unregisterReceiver(receiver);
	}

	
   @Override
   public View onCreateView(LayoutInflater inflater, ViewGroup container,
       Bundle savedInstanceState) {
	 Log.d("MainFragment", "onCreateView");
     View view = inflater.inflate(R.layout.fragment_main, container, false);     

     cardview = (ImageView)view.findViewById(R.id.cardview);
     
     final GestureDetector gesture = new GestureDetector(getActivity(),

    		 new GestureDetector.SimpleOnGestureListener() {
                 @Override
                 public boolean onDown(MotionEvent e) {
                     return true;
                 }

                 @Override
                 public boolean onFling(MotionEvent e1, MotionEvent e2, float velocityX,
                     float velocityY) {
                     Log.d("MainFragment", "onFling has been called!");
                     final int SWIPE_MIN_DISTANCE = 120;
                     final int SWIPE_MAX_OFF_PATH = 250;
                     final int SWIPE_THRESHOLD_VELOCITY = 200;
                     try {
                         if (Math.abs(e1.getY() - e2.getY()) > SWIPE_MAX_OFF_PATH)
                             return false;
                         if (e1.getX() - e2.getX() > SWIPE_MIN_DISTANCE
                             && Math.abs(velocityX) > SWIPE_THRESHOLD_VELOCITY) {
                             Log.i("MainFragment", "Right to Left");
                         } else if (e2.getX() - e1.getX() > SWIPE_MIN_DISTANCE
                             && Math.abs(velocityX) > SWIPE_THRESHOLD_VELOCITY) {
                             Log.i("MainFragment", "Left to Right");
                         }
                     } catch (Exception e) {
                         // nothing
                     }
                     return super.onFling(e1, e2, velocityX, velocityY);
                 }
             });

     view.setOnTouchListener(new View.OnTouchListener() {
         @Override
         public boolean onTouch(View v, MotionEvent event) {
             return gesture.onTouchEvent(event);
         }
     });     
          
     return view;
   }
     
}


