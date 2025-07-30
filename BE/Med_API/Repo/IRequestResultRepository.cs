using DB;

namespace Repo;

public interface IRequestResultRepository
{
    Task<IEnumerable<RequestResult>> GetAllRequestResultsAsync();
    Task<RequestResult?> GetRequestResultByIdAsync(int id);
    Task<RequestResult> CreateRequestResultAsync(RequestResult requestResult);
    Task<bool> UpdateRequestResultAsync(RequestResult requestResult);
    Task<bool> DeleteRequestResultAsync(int id);
    Task<IEnumerable<RequestResult>> GetRequestResultsByRequestIdAsync(int requestId);
    Task<IEnumerable<RequestResult>> GetRequestResultsByStatusAsync(string status);
    Task<RequestResult?> GetLatestRequestResultByRequestIdAsync(int requestId);
}
