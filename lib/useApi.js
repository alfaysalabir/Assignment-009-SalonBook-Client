"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";

// Loads data from the server and gives back { data, loading, error, reload }
export function useApi(path, { auth = true, enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestId = useRef(0);

  const load = useCallback(async () => {
    if (!enabled || !path) return;
    const id = ++requestId.current;
    setLoading(true);
    setError("");
    try {
      const result = await apiFetch(path, { auth });
      if (id === requestId.current) setData(result);
    } catch (err) {
      if (id === requestId.current) setError(err.message);
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [path, auth, enabled]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load, setData };
}
