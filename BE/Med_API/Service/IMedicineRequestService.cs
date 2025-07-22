using DB;

namespace Service;

public interface IMedicineRequestService
{
    Task<IEnumerable<MedicineRequest>> GetAllMedicineRequestsAsync();
    Task<MedicineRequest?> GetMedicineRequestByIdAsync(int id);
    Task<MedicineRequest?> CreateMedicineRequestAsync(MedicineRequest medicineRequest);
    Task<bool> UpdateMedicineRequestAsync(MedicineRequest medicineRequest);
    Task<bool> DeleteMedicineRequestAsync(int id);
    Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStudentCodeAsync(string studentCode);
    Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByParentIdAsync(int parentId);
    Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStaffIdAsync(int staffId);
    Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStatusAsync(string status);
    Task<IEnumerable<Staff>> GetAvailableNursesAsync();
    Task<IEnumerable<MedicineRequest>> GetPendingRequestsAsync();
    Task<bool> AssignNurseToRequestAsync(int requestId, int staffId);
    Task<bool> CompleteRequestAsync(int requestId, int staffId);
    
    // Status update methods
    Task<bool> VerifyRequestAsync(int requestId, int staffId);
    Task<bool> RefuseRequestAsync(int requestId, int staffId, string refusalReason);
    Task<IEnumerable<MedicineRequest>> GetRefusedRequestsAsync();
    
    // New frequency-based methods
    Task<RequestResult?> StartMedicineRequestAsync(int requestId, int staffId);
    Task<bool> AdministerMedicineByFrequencyAsync(int requestResultId, int medicineRequestItemId, string frequency, int staffId, string? notes = null);
    Task<bool> IsMedicineCompletedForDayAsync(int requestResultId, int medicineRequestItemId);
    Task<IEnumerable<string>> GetPendingFrequenciesAsync(int requestResultId, int medicineRequestItemId);
    Task<bool> CompleteMedicineRequestAsync(int requestResultId, int staffId);
    
    // New failure handling methods
    Task<bool> ReportMedicineFailureAsync(int requestResultId, int medicineRequestItemId, string frequency, string failureReason, int staffId, string? notes = null);
    Task<RequestResult?> CreateReRequestAsync(int originalRequestResultId, string reRequestReason, int staffId);
    Task<IEnumerable<RequestResult>> GetFailedRequestsAsync();
    Task<IEnumerable<RequestResult>> GetReRequestsAsync(int originalRequestResultId);
    Task<bool> CanReRequestAsync(int requestResultId);
    Task<bool> UpdateTimeBasedStatusAsync();
    Task<bool> MarkAsFailedAsync(int requestResultId, string reason);
    Task<(bool isCompleted, IEnumerable<string> pendingFrequencies)> GetProgressInfoAsync(int requestResultId, int medicineRequestItemId);

    // Additional methods
    Task<MedicineRequestItem?> GetMedicineRequestItemByIdAsync(int itemId);
    Task<bool> UpdateMedicineRequestItemAsync(MedicineRequestItem item);
    Task<RequestResult?> GetRequestResultByIdAsync(int resultId);

    // New methods for auto nurse assignment by grade
    Task<int?> GetGradeByStudentCodeAsync(string studentCode);
    Task<Staff?> GetNurseByGradeAsync(int grade);
    Task<bool> IsManualAssignmentAllowedAsync(int requestId);
    Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByAssignedGradeAsync(int staffId, string? status = null);
} 