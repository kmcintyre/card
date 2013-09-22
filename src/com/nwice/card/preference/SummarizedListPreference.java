package com.nwice.card.preference;

import android.content.Context;
import android.preference.ListPreference;
import android.util.AttributeSet;
import android.util.Log;

public class SummarizedListPreference extends ListPreference {
	
	public SummarizedListPreference(Context context) {
		super(context);
	}
	public SummarizedListPreference(Context context, AttributeSet attrs) {
		super(context, attrs);
	}
	
    @Override
    public void setValue(final String value) {
        super.setValue(value);
		Log.i("nwice", "new deck setting:" + value);
        setSummary(value);
        notifyChanged();
    }
	
}
