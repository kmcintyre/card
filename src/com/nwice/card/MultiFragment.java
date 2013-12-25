package com.nwice.card;

import android.annotation.SuppressLint;
import android.app.Fragment;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

@SuppressLint("NewApi")
public class MultiFragment extends Fragment {
   
   @Override
   public View onCreateView(LayoutInflater inflater, ViewGroup container,
       Bundle savedInstanceState) {
	 Log.i("MultiFragment", "onCreateView");
     View view = inflater.inflate(R.layout.fragment_multi, container, false);     
     return view;
   }
   
}