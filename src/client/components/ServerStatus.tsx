import { useState, useEffect } from "react";

export default function ServerStatus() {
  const [status, setStatus] = useState<{ status: number; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.text())
      .then((data) => setStatus({ status: res.status, message: data }))
      .catch((err) => setStatus({ status: 0, message: err.message }));
  }, []);

  return (
    <div>
      <h1 className="text-lg">Server Status</h1>
      {status ? (
        <p>Status: {status.status} - {status.message}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
