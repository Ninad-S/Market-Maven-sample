import React, { useState, useEffect } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import { createClient } from "@supabase/supabase-js";

const mapStyles = {
  width: "100%",
  height: "400px",
};

const GoogleMap = ({ google }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyStores, setNearbyStores] = useState([]);
  const supabaseClient = createClient(
    "https://ocimdzpalqvkaseuoyrj.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jaW1kenBhbHF2a2FzZXVveXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcxODM3MjIsImV4cCI6MjAzMjc1OTcyMn0.0CSciehOKHh4hlx9KnivMUr9MSAem-S_IIdqVBPbAcU"
  );

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

  const fetchNearbyStores = async (latitude, longitude) => {
    try {
      const { data: stores, error } = await supabaseClient
        .from("Store")
        .select("*");

      if (error) {
        console.error("Error fetching stores:", error.message);
        return;
      }

      const nearbyStoresData = stores.map((store) => {
        const storeAddress = store.StoreAddress;
        const distance = getDistanceFromLatLonInKm(
          latitude,
          longitude,
          store.Latitude,
          store.Longitude
        );

        console.log("Distance:", distance);

        if (distance <= 10) {
          return {
            ...store,
            distance,
          };
        } else {
          return null;
        }
      });

      const filteredStores = nearbyStoresData.filter((store) => store !== null);
      console.log("Nearby Stores Data:", filteredStores);
      setNearbyStores(filteredStores);
    } catch (error) {
      console.error("Error fetching nearby stores:", error.message);
    }
  };

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  return (
    <Map
      google={google}
      zoom={14}
      style={mapStyles}
      initialCenter={{ lat: 0, lng: 0 }}
      center={userLocation}
    >
      {userLocation && <Marker position={userLocation} title="Your Location" />}
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

export default GoogleApiWrapper({
  apiKey: "",
})(GoogleMap);
