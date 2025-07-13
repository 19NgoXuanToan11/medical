using DB;

namespace Repo;

public interface IMedicineRequestRepository
{
    Task<IEnumerable<MedicineRequest>> GetAllMedicineRequestsAsync();
    Task<MedicineRequest?> GetMedicineRequestByIdAsync(int id);
    Task<MedicineRequest> CreateMedicineRequestAsync(MedicineRequest medicineRequest);
    Task UpdateMedicineRequestAsync(MedicineRequest medicineRequest);
    Task<bool> DeleteMedicineRequestAsync(int id);
    Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStudentCodeAsync(string studentCode);
    Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByParentIdAsync(int parentId);
    Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStaffIdAsync(int staffId);
    Task<IEnumerable<MedicineRequest>> GetMedicineRequestsByStatusAsync(string status);
    Task<IEnumerable<Staff>> GetAvailableNursesAsync();
    Task<int> GetPendingRequestCountForNurseAsync(int staffId);
    Task<IEnumerable<MedicineRequest>> GetPendingRequestsAsync();
    Task<bool> AssignNurseToRequestAsync(int requestId, int staffId);
    Task<bool> CompleteRequestAsync(int requestId, int staffId);
    
    // New frequency-based methods
    Task<RequestResult?> StartMedicineRequestAsync(int requestId, int staffId);
    Task<bool> AdministerMedicineByFrequencyAsync(int requestResultId, int medicineRequestItemId, string frequency, int staffId, string? notes = null);
    Task<bool> IsMedicineCompletedForDayAsync(int requestResultId, int medicineRequestItemId);
    Task<IEnumerable<string>> GetPendingFrequenciesAsync(int requestResultId, int medicineRequestItemId);
    Task<bool> CompleteMedicineRequestAsync(int requestResultId, int staffId);
    
    // New failure handling methods
    Task<bool> ReportMedicineFailureAsync(int requestResultId, int medicineRequestItemId, string frequency, string failureReason, int staffId, string? notes = null);
    Task<RequestResult?> CreateReRequestAsync(int originalRequestResultId, string reRequestReason, int staffId);
    Task<bool> UpdateTimeBasedStatusAsync();
    Task<IEnumerable<RequestResult>> GetFailedRequestsAsync();
    Task<IEnumerable<RequestResult>> GetReRequestsAsync(int originalRequestResultId);
    Task<bool> IsRequestEligibleForReRequestAsync(int requestResultId);
    Task<string> GetReRequestReasonAsync(int requestResultId);
    Task<bool> MarkRequestAsFailedAsync(int requestResultId, string reason);
    Task<RequestResult?> GetRequestResultByIdAsync(int requestResultId);
    Task<(bool isCompleted, IEnumerable<string> pendingFrequencies)> GetProgressInfoAsync(int requestResultId, int medicineRequestItemId);
    Task<(bool eligible, string reason)> GetReRequestInfoAsync(int requestResultId);
    Task<IEnumerable<MedicineRequest>> GetRequestsWithFrequencyMoreThanOneAsync();
    Task<IEnumerable<MedicineRequest>> GetRequestsNeedingTimeOfDayAsync(string timeOfDay);
    
    // Public parsing methods for debugging
    int ParseFrequencyToTimesPerDay(string? frequency);
    List<string> ParseFrequencyToFrequencies(string? frequency);
} 