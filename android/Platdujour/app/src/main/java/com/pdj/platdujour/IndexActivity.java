package com.pdj.platdujour;

import android.app.Activity;

import android.app.ActionBar;
import android.app.Fragment;
import android.app.FragmentManager;
import android.content.Context;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.support.v4.widget.DrawerLayout;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import com.parse.Parse;
import com.parse.ui.ParseLoginActivity;
import com.parse.ui.ParseLoginFragment;
import com.parse.ui.ParseLoginHelpFragment;
import com.parse.ui.ParseOnLoadingListener;
import com.parse.ui.ParseOnLoginSuccessListener;
import com.parse.ui.ParseSignupFragment;
import com.pdj.platdujour.fragment.client.AccueilFragment;
import com.pdj.platdujour.fragment.client.RestaurantsFragment;
import com.pdj.platdujour.fragment.client.TodayDishesFragment;
import com.pdj.platdujour.fragment.restaurateur.GererMesArdoisesFragment;
import com.pdj.platdujour.fragment.restaurateur.MesEntreesPlatsDessertsFragment;
import com.pdj.platdujour.fragment.restaurateur.MonArdoiseFragment;
import com.pdj.platdujour.fragment.restaurateur.MonRestaurantFragment;


public class IndexActivity extends Activity
        implements NavigationDrawerFragment.NavigationDrawerCallbacks, ParseLoginFragment.ParseLoginFragmentListener,
        ParseLoginHelpFragment.ParseOnLoginHelpSuccessListener,
        ParseOnLoginSuccessListener, ParseOnLoadingListener {

    public static final String LOG_TAG = "ParseLoginActivity";
    /**
     * Fragment managing the behaviors, interactions and presentation of the navigation drawer.
     */
    private NavigationDrawerFragment mNavigationDrawerFragment;

    private static final String ARG_SECTION_NUMBER = "section_number";

    /**
     * Used to store the last screen title. For use in {@link #restoreActionBar()}.
     */
    private CharSequence mTitle;


    private Bundle configOptions;


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_index);

        mNavigationDrawerFragment = (NavigationDrawerFragment)
                getFragmentManager().findFragmentById(R.id.navigation_drawer);
        mTitle = getTitle();

        // Set up the drawer.
        mNavigationDrawerFragment.setUp(
                R.id.navigation_drawer,
                (DrawerLayout) findViewById(R.id.drawer_layout));

    }

    @Override
    public void onNavigationDrawerItemSelected(int position) {
        // update the main content by replacing fragments
        FragmentManager fragmentManager = getFragmentManager();
        fragmentManager.beginTransaction()
                .replace(R.id.container, getFragmentByPosition(position))
                .commit();
    }

    private Fragment getFragmentByPosition(int position){
        Bundle args = new Bundle();
        args.putInt(ARG_SECTION_NUMBER, position);
        Fragment fragment = new PlaceholderFragment();
        configOptions = getMergedOptions();
        switch (position){
            case NavigationDrawerFragment.POSITION_INDEX:
                // par défault un placeHolder
                fragment = new AccueilFragment();
                break;
            case NavigationDrawerFragment.POSITION_PLATDUJOUR:
                fragment = new TodayDishesFragment();
                break;
            case NavigationDrawerFragment.POSITION_RESTAURANTS:
                fragment = new RestaurantsFragment();
                break;
            case NavigationDrawerFragment.POSITION_MONCOMPTE:
                fragment = ParseLoginFragment.newInstance(configOptions);
                break;
            case NavigationDrawerFragment.POSITION_RESTO_MON_ARDOISE:
                fragment = new MonArdoiseFragment();
                break;
            case NavigationDrawerFragment.POSITION_RESTO_MES_ENTREES_PLATS_DESSERTS:
                fragment = new MesEntreesPlatsDessertsFragment();
                break;
            case NavigationDrawerFragment.POSITION_RESTO_GERER_MES_ARDOISES:
                fragment = new GererMesArdoisesFragment();
                break;
            case NavigationDrawerFragment.POSITION_RESTO_MON_RESTO:
                fragment = new MonRestaurantFragment();
                break;


        }


        return fragment;
    }

    public void onSectionAttached(int number) {
        switch (number) {
            case 1:
                mTitle = getString(R.string.title_section1);
                break;
            case 2:
                mTitle = getString(R.string.title_section2);
                break;
            case 3:
                mTitle = getString(R.string.title_section3);
                break;
        }
    }

    public void restoreActionBar() {
        ActionBar actionBar = getActionBar();
        actionBar.setNavigationMode(ActionBar.NAVIGATION_MODE_STANDARD);
        actionBar.setDisplayShowTitleEnabled(true);
        actionBar.setTitle(mTitle);
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        if (!mNavigationDrawerFragment.isDrawerOpen()) {
            // Only show items in the action bar relevant to this screen
            // if the drawer is not showing. Otherwise, let the drawer
            // decide what to show in the action bar.
            getMenuInflater().inflate(R.menu.index, menu);
            restoreActionBar();
            return true;
        }
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onSignUpClicked(String username, String password) {

    }

    @Override
    public void onLoginHelpClicked() {

    }

    @Override
    public void onLoginSuccess() {

    }

    @Override
    public void onLoadingStart(boolean showSpinner) {

    }

    @Override
    public void onLoadingFinish() {

    }

    @Override
    public void onLoginHelpSuccess() {

    }

    /**
     * A placeholder fragment containing a simple view.
     */
    public static class PlaceholderFragment extends Fragment {
        /**
         * The fragment argument representing the section number for this
         * fragment.
         */
        private static final String ARG_SECTION_NUMBER = "section_number";

        /**
         * Returns a new instance of this fragment for the given section
         * number.
         */
        public static PlaceholderFragment newInstance(int sectionNumber) {
            PlaceholderFragment fragment = new PlaceholderFragment();
            Bundle args = new Bundle();
            args.putInt(ARG_SECTION_NUMBER, sectionNumber);
            fragment.setArguments(args);
            return fragment;
        }

        public PlaceholderFragment() {
        }

        @Override
        public View onCreateView(LayoutInflater inflater, ViewGroup container,
                Bundle savedInstanceState) {
            View rootView = inflater.inflate(R.layout.fragment_index, container, false);
            return rootView;
        }

        @Override
        public void onAttach(Activity activity) {
            super.onAttach(activity);
            ((IndexActivity) activity).onSectionAttached(
                    getArguments().getInt(ARG_SECTION_NUMBER));
        }
    }

    private Bundle getMergedOptions() {
        // Read activity metadata from AndroidManifest.xml
        ActivityInfo activityInfo = null;
        try {
            activityInfo = getPackageManager().getActivityInfo(
                    this.getComponentName(), PackageManager.GET_META_DATA);
        } catch (PackageManager.NameNotFoundException e) {
            if (Parse.getLogLevel() <= Parse.LOG_LEVEL_ERROR &&
                    Log.isLoggable(LOG_TAG, Log.WARN)) {
                Log.w(LOG_TAG, e.getMessage());
            }
        }

        // The options specified in the Intent (from ParseLoginBuilder) will
        // override any duplicate options specified in the activity metadata
        Bundle mergedOptions = new Bundle();
        if (activityInfo != null && activityInfo.metaData != null) {
            mergedOptions.putAll(activityInfo.metaData);
        }
        if (getIntent().getExtras() != null) {
            mergedOptions.putAll(getIntent().getExtras());
        }

        return mergedOptions;
    }

}
