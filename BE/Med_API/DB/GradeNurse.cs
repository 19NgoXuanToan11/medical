using System.ComponentModel.DataAnnotations.Schema;

namespace DB;

public class GradeNurse
{
    public int GradeNurseId { get; set; }
    public int StaffId { get; set; } // nurse
    public int Grade { get; set; } // 1-5
    public virtual Staff Nurse { get; set; } = null!;
}
