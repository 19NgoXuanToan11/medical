import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import parentService from "../api/parent/parentService";

// Tạo context cho parent data
const ParentContext = createContext(null);

export const ParentProvider = ({ children }) => {
  const { user } = useAuth();
  const [parentData, setParentData] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch parent data from API
  const fetchParentData = async () => {
    if (!user || !user.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await parentService.getCurrentParent();
      setParentData(data);
      
      // Extract and format students from parent data
      if (data.students && data.students.length > 0) {
        const formattedStudents = data.students.map(student => ({
          studentId: student.studentId,
          name: `${student.firstName} ${student.lastName}`,
          class: student.className || 'N/A',
          studentCode: student.studentCode,
          firstName: student.firstName,
          lastName: student.lastName,
          className: student.className,
          dateOfBirth: student.dateOfBirth,
          gender: student.gender,
          gradeLevel: student.gradeLevel,
          address: student.address,
          isActive: student.isActive
        }));
        
        setStudents(formattedStudents);
        
        // Set first student as selected if none is selected
        if (!selectedStudent && formattedStudents.length > 0) {
          setSelectedStudent(formattedStudents[0]);
        }
      } else {
        setStudents([]);
        setSelectedStudent(null);
      }
    } catch (error) {
      console.error('Error fetching parent data:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Update parent data
  const updateParentData = async (updateData) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedData = await parentService.updateParent(
        parentData?.parentId || user?.id, 
        updateData
      );
      
      setParentData(updatedData);
      return updatedData;
    } catch (error) {
      console.error('Error updating parent data:', error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Select a student
  const selectStudent = (student) => {
    setSelectedStudent(student);
  };

  // Refresh parent data
  const refreshParentData = () => {
    fetchParentData();
  };

  // Initial fetch when user changes
  useEffect(() => {
    if (user && user.id) {
      fetchParentData();
    } else {
      setParentData(null);
      setStudents([]);
      setSelectedStudent(null);
    }
  }, [user]);

  const value = {
    parentData,
    students,
    selectedStudent,
    loading,
    error,
    fetchParentData,
    updateParentData,
    selectStudent,
    refreshParentData,
  };

  return (
    <ParentContext.Provider value={value}>
      {children}
    </ParentContext.Provider>
  );
};

// Hook để sử dụng ParentContext
export const useParent = () => {
  const context = useContext(ParentContext);
  if (!context) {
    throw new Error("useParent must be used within a ParentProvider");
  }
  return context;
};

export default ParentContext; 