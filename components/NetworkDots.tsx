'use client'
import { useEffect, useState } from "react";

export default function NetworkDots() {
  const [online, setOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return (
    <div
      title={online ? "Online" : "Offline"}
      style={{
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: online ? "#00d26a" : "#ff3b3b",
        boxShadow: "0 0 6px rgba(0,0,0,0.3)",
      }}
    />
  );
}
