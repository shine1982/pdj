package com.pdj.platdujour;

import android.app.Application;

import com.parse.Parse;
import com.parse.ParseACL;
import com.parse.ParseUser;

public class ParseApplication extends Application {

	@Override
	public void onCreate() {
		super.onCreate();

		// Add your initialization code here
        Parse.initialize(this, "AWenu1Ai25oFVGJAQgxPlMmCCxLyTzp45fpDGoa5", "CKfsqTm4Az7fLNHdhnRpk9Hsx3JR5tGdinH8JuNA");

        ParseUser.enableAutomaticUser();
		ParseACL defaultACL = new ParseACL();
	    
		// If you would like all objects to be private by default, remove this line.
		defaultACL.setPublicReadAccess(true);
		
		ParseACL.setDefaultACL(defaultACL, true);
	}

}
