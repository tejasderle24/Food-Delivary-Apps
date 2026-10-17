
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View, Pressable } from "react-native";
import { getHealth, type HealthResponse } from "../services/api";
import {SafeAreaView} from "react-native-safe-area-context"

export default function Index() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getHealth();
      setHealth(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to connect to API"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-slate-950 px-6">
      <View className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <Text className="mb-2 text-2xl font-bold text-white">
          API Health Check
        </Text>

        <Text className="mb-6 text-sm text-slate-400">
          NestJS backend connection status
        </Text>

        {loading ? (
          <View className="items-center py-6">
            <ActivityIndicator size="large" color="#38bdf8" />
            <Text className="mt-3 text-slate-300">
              Checking API...
            </Text>
          </View>
        ) : error ? (
          <View className="rounded-xl bg-red-950 p-4">
            <Text className="font-semibold text-red-400">
              Connection failed
            </Text>
            <Text className="mt-2 text-sm text-red-200">
              {error}
            </Text>
          </View>
        ) : (
          <View className="rounded-xl bg-emerald-950 p-4">
            <Text className="font-semibold text-emerald-400">
              Status: {health?.status}
            </Text>
            <Text className="mt-2 text-sm text-emerald-200">
              Timestamp: {health?.timestamp}
            </Text>
          </View>
        )}

        <Pressable
          onPress={checkHealth}
          disabled={loading}
          className={`mt-6 items-center rounded-xl bg-sky-500 px-4 py-3 ${
            loading ? "opacity-50" : "active:bg-sky-600"
          }`}
        >
          <Text className="font-bold text-white">
            {loading ? "Checking..." : "Retry Connection"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
