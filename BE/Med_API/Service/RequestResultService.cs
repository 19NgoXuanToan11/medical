using DB;
using Repo;

namespace Service;

public class RequestResultService : IRequestResultService
{
    private readonly IRequestResultRepository _requestResultRepository;
    private readonly IMedicineRequestRepository _medicineRequestRepository;

    public RequestResultService(IRequestResultRepository requestResultRepository, IMedicineRequestRepository medicineRequestRepository)
    {
        _requestResultRepository = requestResultRepository;
        _medicineRequestRepository = medicineRequestRepository;
    }

    public async Task<IEnumerable<RequestResult>> GetAllRequestResultsAsync()
    {
        return await _requestResultRepository.GetAllRequestResultsAsync();
    }

    public async Task<RequestResult?> GetRequestResultByIdAsync(int id)
    {
        return await _requestResultRepository.GetRequestResultByIdAsync(id);
    }

    public async Task<RequestResult?> CreateRequestResultAsync(RequestResult requestResult)
    {
        // Validate RequestId is not null
        if (!requestResult.RequestId.HasValue)
        {
            throw new InvalidOperationException("RequestId is required");
        }

        // Validate that the associated request exists
        var request = await _medicineRequestRepository.GetMedicineRequestByIdAsync(requestResult.RequestId.Value);
        if (request == null)
        {
            throw new InvalidOperationException("Associated medicine request not found");
        }

        // Set submission date to current time
        requestResult.SubmittedAt = DateTime.UtcNow;

        // Validate status
        if (!IsValidStatus(requestResult.Status))
        {
            throw new InvalidOperationException("Invalid status value");
        }

        return await _requestResultRepository.CreateRequestResultAsync(requestResult);
    }

    public async Task<bool> UpdateRequestResultAsync(RequestResult requestResult)
    {
        // Validate that the result exists
        var existingResult = await _requestResultRepository.GetRequestResultByIdAsync(requestResult.ResultId);
        if (existingResult == null)
        {
            return false;
        }

        // Validate RequestId is not null
        if (!requestResult.RequestId.HasValue)
        {
            throw new InvalidOperationException("RequestId is required");
        }

        // Validate that the associated request exists
        var request = await _medicineRequestRepository.GetMedicineRequestByIdAsync(requestResult.RequestId.Value);
        if (request == null)
        {
            throw new InvalidOperationException("Associated medicine request not found");
        }

        // Validate status
        if (!IsValidStatus(requestResult.Status))
        {
            throw new InvalidOperationException("Invalid status value");
        }

        return await _requestResultRepository.UpdateRequestResultAsync(requestResult);
    }

    public async Task<bool> DeleteRequestResultAsync(int id)
    {
        return await _requestResultRepository.DeleteRequestResultAsync(id);
    }

    public async Task<IEnumerable<RequestResult>> GetRequestResultsByRequestIdAsync(int requestId)
    {
        return await _requestResultRepository.GetRequestResultsByRequestIdAsync(requestId);
    }

    public async Task<IEnumerable<RequestResult>> GetRequestResultsByStatusAsync(string status)
    {
        if (!IsValidStatus(status))
        {
            throw new InvalidOperationException("Invalid status value");
        }

        return await _requestResultRepository.GetRequestResultsByStatusAsync(status);
    }

    public async Task<RequestResult?> GetLatestRequestResultByRequestIdAsync(int requestId)
    {
        return await _requestResultRepository.GetLatestRequestResultByRequestIdAsync(requestId);
    }

    private bool IsValidStatus(string status)
    {
        return status == "Approved" || status == "Rejected" || status == "Pending";
    }
} 