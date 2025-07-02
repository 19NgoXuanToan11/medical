import React, { useState, useEffect } from "react";
import healthProfileService from "../../utils/api/health-profile/healthProfileService";

const ApiTest = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testGetAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await healthProfileService.getAll();
      setData(result);
      console.log("API Result:", result);
    } catch (err) {
      setError(err.message);
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const testGetByStudentCode = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await healthProfileService.getByStudentCode("HS001");
      setData(result);
      console.log("API Result:", result);
    } catch (err) {
      setError(err.message);
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">API Test</h2>

      <div className="space-y-4">
        <button
          onClick={testGetAll}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Test Get All"}
        </button>

        <button
          onClick={testGetByStudentCode}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 ml-2"
        >
          {loading ? "Loading..." : "Test Get By Student Code"}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {data && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <strong>Success:</strong>
          <pre className="mt-2 text-sm overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiTest;
