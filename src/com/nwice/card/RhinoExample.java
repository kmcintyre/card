package com.nwice.card;

import java.util.Arrays;
import java.util.List;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.commonjs.module.Require;
import org.mozilla.javascript.tools.shell.Global;

public class RhinoExample {

	
	
	
	public static void main() {
		Global global = new Global();
		Context cx = Context.enter();
		try {
			global.initStandardObjects(cx, true);
			cx.setLanguageVersion(170); // enable 1.7 language features
			List<String> modulePaths = Arrays.asList("main",
					"/js_module");
			Require require = global.installRequire(cx, modulePaths, false);
			require.requireMain(cx, "main");
		} finally {
			Context.exit();
		}
	}

	public static void add() {
		Global global = new Global();
		Context cx = Context.enter();
		try {
			global.initStandardObjects(cx, true);
			cx.setLanguageVersion(170); // enable 1.7 language features
			List<String> modulePaths = Arrays.asList("path/to/my_modules");
			Require require = global.installRequire(cx, modulePaths, false);
			Scriptable exports = (Scriptable) require.call(cx, global, global,
					new String[] { "math" });
			Function add = (Function) exports.get("add", exports);
			Object result = add.call(cx, global, global, new Object[] { 2, 4 });
			System.out.println("result:" + result);
		} finally {
			Context.exit();
		}
	}

}