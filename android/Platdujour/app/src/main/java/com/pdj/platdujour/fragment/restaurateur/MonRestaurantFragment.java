package com.pdj.platdujour.fragment.restaurateur;



import android.os.Bundle;
import android.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.pdj.platdujour.R;

/**
 * A simple {@link Fragment} subclass.
 *
 */
public class MonRestaurantFragment extends Fragment {


    public MonRestaurantFragment() {
        // Required empty public constructor
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_mon_restaurant, container, false);
    }


}
