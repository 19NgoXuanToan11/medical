-- Debug query to check failed medicine requests for parent ID 825
-- Check MedicineRequest status
SELECT 
    mr.RequestId,
    mr.ParentId, 
    mr.Status as MedicineRequestStatus,
    mr.StudentCode,
    mr.RequestDate
FROM Medicine_Request mr 
WHERE mr.ParentId = 825;

-- Check RequestResult status 
SELECT 
    mr.RequestId,
    mr.ParentId,
    mr.Status as MedicineRequestStatus,
    rr.ResultId,
    rr.Status as RequestResultStatus,
    rr.SubmittedAt,
    rr.FailureReasons,
    rr.ReRequestReason
FROM Medicine_Request mr
LEFT JOIN Request_Result rr ON mr.RequestId = rr.RequestId
WHERE mr.ParentId = 825;

-- Check specifically for failed RequestResults
SELECT 
    mr.RequestId,
    mr.ParentId,
    mr.Status as MedicineRequestStatus,
    rr.ResultId,
    rr.Status as RequestResultStatus,
    rr.FailureReasons,
    rr.ReRequestReason
FROM Medicine_Request mr
INNER JOIN Request_Result rr ON mr.RequestId = rr.RequestId
WHERE mr.ParentId = 825 
  AND (rr.Status = 'Failed' OR rr.Status = 'Partially Failed'); 