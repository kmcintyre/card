package com.nwice.card;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

import android.annotation.SuppressLint;
import android.app.Fragment;
import android.content.BroadcastReceiver;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

@SuppressLint("NewApi")
public class MainFragment extends Fragment {

	
	private Scriptable scope;
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
		    	} catch (Exception e) {
					Toast.makeText(getActivity(), e.toString(), Toast.LENGTH_LONG).show();
					Log.e("MainFragment", "jackson mapper", e);
				    return;
		    	}			 
				
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
				//ImageView iw= (ImageView)findViewById(R.id.cardview);  
				//int resID = getResources().getIdentifier(drawableName, "drawable",  getPackageName());
				//iw.setImageResource(resID);
			}
		}
	};
	
	
		
	public void blah(String s) {
	     blah(
	             "var widgets = Packages.android.widget;\n" +
	             "var view = new widgets.TextView(TheActivity);\n" +
	             "cardview.setContentView(view);\n" +
	             "var text = 'Hello Android!\\nThis is JavaScript in action!';\n" +
	             "view.append(text);"
	             );
	}
	
	
	@Override
	public void onStart() {
		super.onStart();
		getActivity().registerReceiver(receiver, new IntentFilter(ConnectIntentService.MESSAGE));
	}		
	
	
	public void onStop() {
		super.onStart();
		getActivity().unregisterReceiver(receiver);
	}
   
   @Override
   public View onCreateView(LayoutInflater inflater, ViewGroup container,
       Bundle savedInstanceState) {
	 Log.i("MainFragment", "onCreateView");
     View view = inflater.inflate(R.layout.fragment_main, container, false);     
     //view.setText("Hello JavaScript!");
     //setContentView(view);
     //doit(view,
      //   "var x = 'Kalle\\nLisa';\n" + "return x;"
     //);
     createRhinoContext();     
     cardview = (ImageView)view.findViewById(R.id.cardview);
     
     return view;
   }
   
   public void createRhinoContext()
   {
       // Create an execution environment.
	   org.mozilla.javascript.Context cx = org.mozilla.javascript.Context.enter();

       // Turn compilation off.
       cx.setOptimizationLevel(-1);
       Scriptable scope = cx.initStandardObjects();
       ScriptableObject.putProperty(scope, "cardview", org.mozilla.javascript.Context.javaToJS(this.getActivity().findViewById(R.id.cardview), scope));
       this.scope = scope;
   } 
   
   
}


