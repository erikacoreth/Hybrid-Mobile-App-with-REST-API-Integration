import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const key = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!key) {
          setError("Missing API key");
          setLoading(false);
          return;
        }

        const address = "Philadelphia, PA";
        const url =
          "https://maps.googleapis.com/maps/api/geocode/json?address=" +
          encodeURIComponent(address) +
          "&key=" +
          key;

        const res = await fetch(url);
        const data = await res.json();

        if (data.status !== "OK") {
          setError(`Geocoding failed: ${data.status}`);
          setLoading(false);
          return;
        }

        const top = data.results[0];
        const loc = top.geometry.location;

        setResult({
          address: top.formatted_address,
          lat: loc.lat,
          lng: loc.lng,
        });
      } catch (e: any) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const region = result
    ? {
        latitude: result.lat,
        longitude: result.lng,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      }
    : {
        latitude: 39.9526,
        longitude: -75.1652,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Week 7 – Google Maps API</Text>

      {loading && <Text>Loading location…</Text>}
      {!!error && <Text style={styles.error}>{error}</Text>}

      {result && (
        <View style={styles.card}>
          <Text>{result.address}</Text>
          <Text>
            {result.lat}, {result.lng}
          </Text>
        </View>
      )}

      <MapView style={styles.map} initialRegion={region}>
        {result && (
          <Marker
            coordinate={{ latitude: result.lat, longitude: result.lng }}
            title="Geocoded Location"
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 16 },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  card: { marginBottom: 8 },
  error: { color: "red", marginTop: 6 },
  map: { flex: 1, borderRadius: 12 },
});
