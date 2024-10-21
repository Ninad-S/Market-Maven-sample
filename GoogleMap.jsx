// Import necessary dependencies
import React, { useState, useEffect } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import { createClient } from "@supabase/supabase-js";

// Define map styles
const mapStyles = {
  width: "100%",
  height: "400px",
};

// GoogleMap component definition
const GoogleMap = ({ google }) => {
  // State for user's location and nearby stores
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyStores, setNearbyStores] = useState([]);

  // Initialize Supabase client
  const supabaseClient = createClient(
    "https://ocimdzpalqvkaseuoyrj.supabase.co",
    "###"
  );

  // Effect to get user's location and fetch nearby stores
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          fetchNearbyStores(latitude, longitude);
        },
        (error) => {
          console.error("Error getting user's location:", error.message);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  // Function to fetch nearby stores from Supabase
  const fetchNearbyStores = async (latitude, longitude) => {
    try {
      const { data: stores, error } = await supabaseClient
        .from("Store")
        .select("*");

      if (error) {
        console.error("Error fetching stores:", error.message);
        return;
      }

      // Filter and process nearby stores
      const nearbyStoresData = stores.map((store) => {
        const distance = getDistanceFromLatLonInKm(
          latitude,
          longitude,
          store.Latitude,
          store.Longitude
        );

        console.log("Distance:", distance);

        return distance <= 10 ? { ...store, distance } : null;
      }).filter(Boolean);

      console.log("Nearby Stores Data:", nearbyStoresData);
      setNearbyStores(nearbyStoresData);
    } catch (error) {
      console.error("Error fetching nearby stores:", error.message);
    }
  };

  // Helper function to calculate distance between two points
  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  // Helper function to convert degrees to radians
  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  // Render the Google Map component
  return (
    <Map
      google={google}
      zoom={14}
      style={mapStyles}
      initialCenter={{ lat: 0, lng: 0 }}
      center={userLocation}
    >
      {/* Marker for user's location */}
      {userLocation && <Marker position={userLocation} title="Your Location" />}
      
      {/* Markers for nearby stores */}
      {nearbyStores.map((store, index) => (
        <Marker
          key={index}
          position={{ lat: store.Latitude, lng: store.Longitude }}
          title={store.StoreAddress}
        />
      ))}
    </Map>
  );
};

// Wrap the GoogleMap component with GoogleApiWrapper
export default GoogleApiWrapper({
  apiKey: "", // Add your Google Maps API key here
})(GoogleMap);
