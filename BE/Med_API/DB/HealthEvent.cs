using System;
using System.Collections.Generic;

namespace DB;

public partial class HealthEvent
{
    public int EventId { get; set; }

    public string? StudentCode { get; set; }

    public int? StaffId { get; set; }

    public DateTime EventDate { get; set; }

    public string EventType { get; set; } = null!;

    public string? Severity { get; set; } // Mức độ nghiêm trọng: light, moderate, severe, emergency

    public string? Symptoms { get; set; }

    public string? Assessment { get; set; }

    public string? Treatment { get; set; }

    public bool? ParentNotified { get; set; }

    public bool? FollowUpRequired { get; set; }

    public string? Notes { get; set; }

    // Trường mới để lưu thông tin thiếu thuốc/vật tư
    public string? InsufficientItems { get; set; } // JSON/text mô tả chi tiết các mục thiếu

    public string? InsufficientItemsNote { get; set; } // Ghi chú của nurse về cách xử lý khi thiếu

    public virtual Staff? Staff { get; set; }

    public virtual Student? Student { get; set; }

    public virtual ICollection<HealthEventMedicine> HealthEventMedicines { get; set; } = new List<HealthEventMedicine>();

    public virtual ICollection<HealthEventMedicalSupply> HealthEventMedicalSupplies { get; set; } = new List<HealthEventMedicalSupply>();
}
