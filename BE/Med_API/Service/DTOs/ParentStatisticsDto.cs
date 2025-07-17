namespace Service.DTOs;

public class ParentStatisticsDto
{
    public int TotalChildren { get; set; }
    public int TotalVaccinations { get; set; }
    public int TotalHealthEvents { get; set; }
    public int TotalHealthChecks { get; set; }
    public int TotalMedicineRequests { get; set; }
    
    // Breakdown by status
    public VaccinationStats VaccinationBreakdown { get; set; } = new();
    public HealthEventStats HealthEventBreakdown { get; set; } = new();
    public HealthCheckStats HealthCheckBreakdown { get; set; } = new();
    public MedicineRequestStats MedicineRequestBreakdown { get; set; } = new();
    
    // Children details
    public ICollection<ChildStatistic> ChildrenDetails { get; set; } = new List<ChildStatistic>();
}

public class VaccinationStats
{
    public int Pending { get; set; }
    public int Approved { get; set; }
    public int Completed { get; set; }
    public int Rejected { get; set; }
}

public class HealthEventStats
{
    public int Emergency { get; set; }
    public int Routine { get; set; }
    public int FollowUpRequired { get; set; }
    public int Resolved { get; set; }
}

public class HealthCheckStats
{
    public int Scheduled { get; set; }
    public int Completed { get; set; }
    public int Pending { get; set; }
    public int Cancelled { get; set; }
}

public class MedicineRequestStats
{
    public int Pending { get; set; }
    public int Approved { get; set; }
    public int Rejected { get; set; }
    public int InProgress { get; set; }
    public int Completed { get; set; }
}

public class ChildStatistic
{
    public int StudentId { get; set; }
    public string StudentCode { get; set; } = null!;
    public string StudentName { get; set; } = null!;
    public string? ClassName { get; set; }
    public int GradeLevel { get; set; }
    public int VaccinationCount { get; set; }
    public int HealthEventCount { get; set; }
    public int HealthCheckCount { get; set; }
    public int MedicineRequestCount { get; set; }
    public DateTime? LastHealthCheck { get; set; }
    public DateTime? LastHealthEvent { get; set; }
} 