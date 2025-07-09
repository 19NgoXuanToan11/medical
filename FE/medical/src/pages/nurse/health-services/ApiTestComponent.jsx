import React, { useState, useEffect } from "react";
import { healthCheckItemService } from "../../../utils/api/healthCheckItem/healthCheckItemService";

const ApiTestComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    try {
      const result =
        await healthCheckItemService.getHealthCheckItemsWithMedicalSupplies();
      console.log("API Result:", result);
      setData(result);
    } catch (err) {
      console.error("API Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testApi();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Health Check Items API Test</h2>

      <button
        onClick={testApi}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 mb-4"
      >
        {loading ? "Testing..." : "Test API"}
      </button>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded mb-4">
          <h3 className="font-medium text-red-800">Error:</h3>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {data && (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <h3 className="font-medium text-green-800">Success!</h3>
            <p className="text-green-600">
              Loaded {data.success ? data.data?.length || 0 : 0} health check
              items
            </p>
          </div>

          {data.success && data.data && (
            <div className="space-y-2">
              <h4 className="font-medium">Health Check Items:</h4>
              {data.data.map((item) => (
                <div
                  key={item.itemId}
                  className="p-3 border rounded bg-gray-50"
                >
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-600">
                    Category: {item.category} | Time:{" "}
                    {item.estimatedTimeMinutes}min
                  </div>
                  <div className="text-sm text-gray-600">
                    Description: {item.description}
                  </div>
                  {item.requiredMedicalSupplies &&
                    item.requiredMedicalSupplies.length > 0 && (
                      <div className="mt-2">
                        <div className="text-sm font-medium">
                          Required Supplies:
                        </div>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {item.requiredMedicalSupplies.map((supply, index) => (
                            <li key={index}>
                              {supply.medicalSupply.name} (Qty:{" "}
                              {supply.quantityRequired})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-4 p-3 bg-gray-100 rounded">
        <h4 className="font-medium">Raw API Response:</h4>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ApiTestComponent;
