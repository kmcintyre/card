package com.nwice.card;

import android.app.Activity;
import android.os.Bundle;
import android.widget.*;

import org.mozilla.javascript.*;

public class JSActivity extends Activity
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        TextView view = new TextView(this);
        view.setText("Hello JavaScript!");
        setContentView(view);
        doit(view,
             "var x = 'Kalle\\nLisa';\n" +
             "TheView.append(x);"
             );
    }

    void doit(TextView view, String code)
    {
        // Creates and enters a Context. The Context stores information
        // about the execution environment of a script.
        Context cx = Context.enter();
        cx.setOptimizationLevel(-1);
        try
        {
            // Initialize the standard objects (Object, Function, etc.)
            // This must be done before scripts can be executed. Returns
            // a scope object that we use in later calls.
            Scriptable scope = cx.initStandardObjects();
            ScriptableObject.putProperty(scope, "TheView", Context.javaToJS(view, scope));

            // Now evaluate the string we've colected.
            Object result = cx.evaluateString(scope, code, "doit:", 1, null);

            // Convert the result to a string and print it.
            view.append(Context.toString(result));

        }
        finally
        {
            // Exit from the context.
            Context.exit();


        }
    }
}