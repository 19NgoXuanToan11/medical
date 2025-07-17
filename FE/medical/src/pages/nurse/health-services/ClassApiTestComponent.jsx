import React, { useState, useEffect } from "react";
import { getActiveClasses } from "../../../utils/api/class/classService";

const ClassApiTestComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getActiveClasses();
      setData(result);
    } catch (err) {
      console.error("Class API Error:", err);
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
      <h2 className="text-xl font-bold mb-4">Class API Test</h2>

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
              Loaded {Array.isArray(data) ? data.length : 0} classes
            </p>
          </div>

          {Array.isArray(data) && (
            <div className="space-y-2">
              <h4 className="font-medium">Classes:</h4>
              {data.map((classItem) => (
                <div
                  key={classItem.classId}
                  className="p-3 border rounded bg-gray-50"
                >
                  <div className="font-medium">{classItem.className}</div>
                  <div className="text-sm text-gray-600">
                    Grade: {classItem.gradeLevel} | Section: {classItem.section}
                  </div>
                  <div className="text-sm text-gray-600">
                    Students: {classItem.currentStudentCount}/
                    {classItem.maxStudents}
                  </div>
                  <div className="text-sm text-gray-600">
                    Teacher: {classItem.classTeacher} | Room:{" "}
                    {classItem.classRoom}
                  </div>
                  <div className="text-sm text-gray-600">
                    Active: {classItem.isActive ? "Yes" : "No"}
                  </div>
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

export default ClassApiTestComponent;
