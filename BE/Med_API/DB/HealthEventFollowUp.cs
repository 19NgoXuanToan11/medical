using System;

namespace DB;

public partial class HealthEventFollowUp
{
    public int FollowUpId { get; set; }

    public int EventId { get; set; }

    public int StaffId { get; set; }

    public DateTime Timestamp { get; set; }

    public string Status { get; set; } = null!; // "Đã khỏe lại", "Được đưa về nhà", "Cần theo dõi thêm", etc.

    public string? Note { get; set; }

    public virtual HealthEvent Event { get; set; } = null!;

    public virtual Staff Staff { get; set; } = null!;
}
