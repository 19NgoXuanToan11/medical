using DB;
using Repo;

namespace Service;

public class HealthEventService : IHealthEventService
{
    private readonly IHealthEventRepository _healthEventRepository;
    private readonly IStudentRepository _studentRepository;
    private readonly IStaffRepository _staffRepository;
    private readonly INotificationService _notificationService;
    private readonly IMedicineService _medicineService;
    private readonly IMedicalSupplyService _medicalSupplyService;
    private readonly MedicalContext _context;

    public HealthEventService(
        IHealthEventRepository healthEventRepository,
        IStudentRepository studentRepository,
        IStaffRepository staffRepository,
        INotificationService notificationService,
        IMedicineService medicineService,
        IMedicalSupplyService medicalSupplyService,
        MedicalContext context
    )
    {
        _healthEventRepository = healthEventRepository;
        _studentRepository = studentRepository;
        _staffRepository = staffRepository;
        _notificationService = notificationService;
        _medicineService = medicineService;
        _medicalSupplyService = medicalSupplyService;
        _context = context;
    }

    public async Task<IEnumerable<HealthEvent>> GetAllHealthEventsAsync()
    {
        return await _healthEventRepository.GetAllHealthEventsAsync();
    }

    public async Task<HealthEvent?> GetHealthEventByIdAsync(int id)
    {
        return await _healthEventRepository.GetHealthEventByIdAsync(id);
    }

    public async Task<BatchResult> CreateBatchHealthEventsAsync(
        IEnumerable<HealthEvent> healthEvents
    )
    {
        var result = new BatchResult();
        var createdEvents = new List<HealthEvent>();

        foreach (var healthEvent in healthEvents)
        {
            try
            {
                var createdEvent = await CreateHealthEventAsync(healthEvent);
                if (createdEvent != null)
                {
                    createdEvents.Add(createdEvent);
                    result.SuccessfulCount++;
                }
            }
            catch (Exception ex)
            {
                result.FailedCount++;
                result.FailedDetails.Add($"Học sinh {healthEvent.StudentCode}: {ex.Message}");
            }
        }

        result.CreatedEvents = createdEvents;
        return result;
    }

    public async Task<HealthEvent?> CreateHealthEventAsync(HealthEvent healthEvent)
    {
        // Validate StudentCode
        if (string.IsNullOrEmpty(healthEvent.StudentCode))
        {
            throw new InvalidOperationException("StudentCode is required");
        }

        var student = await _studentRepository.GetStudentByCodeAsync(healthEvent.StudentCode);
        if (student == null)
        {
            throw new InvalidOperationException("Student not found");
        }

        // Validate StaffId
        if (!healthEvent.StaffId.HasValue)
        {
            throw new InvalidOperationException("StaffId is required");
        }

        var staff = await _staffRepository.GetStaffByIdAsync(healthEvent.StaffId.Value);
        if (staff == null)
        {
            throw new InvalidOperationException("Staff not found");
        }

        // Check if nurse has permission for student's grade
        if (staff.Role?.RoleName?.ToLower() == "nurse")
        {
            var studentGrade = await GetGradeByStudentCodeAsync(healthEvent.StudentCode);
            if (studentGrade.HasValue)
            {
                var hasGradePermission =
                    staff.GradeNurses?.Any(gn => gn.Grade == studentGrade.Value) ?? false;
                if (!hasGradePermission)
                {
                    throw new InvalidOperationException(
                        $"Nurse does not have permission to create health events for grade {studentGrade.Value} students"
                    );
                }
            }
        }

        // Validate and check stock availability before creating the health event
        var insufficientItemsList = new List<string>();

        var medicineStockValidation = await ValidateMedicineStockAsync(
            healthEvent.HealthEventMedicines
        );
        if (!medicineStockValidation.IsValid)
        {
            insufficientItemsList.Add($"Thuốc: {medicineStockValidation.ErrorMessage}");
        }

        var supplyStockValidation = await ValidateMedicalSupplyStockAsync(
            healthEvent.HealthEventMedicalSupplies
        );
        if (!supplyStockValidation.IsValid)
        {
            insufficientItemsList.Add($"Vật tư y tế: {supplyStockValidation.ErrorMessage}");
        }

        // Lưu thông tin thiếu vào HealthEvent thay vì throw exception
        if (insufficientItemsList.Any())
        {
            healthEvent.InsufficientItems = string.Join("; ", insufficientItemsList);
            // InsufficientItemsNote sẽ được set từ frontend qua DTO
        }

        // Set default values with Vietnam timezone (UTC+7)
        var vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
        healthEvent.EventDate = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, vietnamTimeZone);
        healthEvent.ParentNotified ??= false;
        healthEvent.FollowUpRequired ??= false;

        // Ensure HealthEventMedicines are linked
        if (healthEvent.HealthEventMedicines != null)
        {
            foreach (var item in healthEvent.HealthEventMedicines)
            {
                item.HealthEventId = healthEvent.EventId; // Will be 0 for new event, EF handles
            }
        }

        // Ensure HealthEventMedicalSupplies are linked
        if (healthEvent.HealthEventMedicalSupplies != null)
        {
            foreach (var item in healthEvent.HealthEventMedicalSupplies)
            {
                item.HealthEventId = healthEvent.EventId; // Will be 0 for new event, EF handles
            }
        }

        var createdHealthEvent = await _healthEventRepository.CreateHealthEventAsync(healthEvent);

        // Trừ số lượng kho sau khi tạo sự cố y tế thành công
        await UpdateInventoryStockAsync(createdHealthEvent);

        // Tự động lưu vào hồ sơ sức khỏe nếu mức độ nghiêm trọng
        if (createdHealthEvent.Severity == "severe" || createdHealthEvent.Severity == "emergency")
        {
            await CreateHealthRecordFromEvent(createdHealthEvent);
        }

        // Send notification to parent after successful creation
        try
        {
            await _notificationService.CreateHealthEventNotificationAsync(
                createdHealthEvent.EventId,
                createdHealthEvent.StudentCode!
            );

            // Update parentNotified to true after successful notification
            createdHealthEvent.ParentNotified = true;
            await _healthEventRepository.UpdateHealthEventAsync(createdHealthEvent);
        }
        catch { }

        return createdHealthEvent;
    }

    public async Task<bool> UpdateHealthEventAsync(HealthEvent healthEvent)
    {
        return await _healthEventRepository.UpdateHealthEventAsync(healthEvent);
    }

    public async Task<bool> DeleteHealthEventAsync(int id)
    {
        return await _healthEventRepository.DeleteHealthEventAsync(id);
    }

    public async Task<IEnumerable<HealthEvent>> GetHealthEventsByStudentCodeAsync(
        string studentCode
    )
    {
        return await _healthEventRepository.GetHealthEventsByStudentCodeAsync(studentCode);
    }

    public async Task<IEnumerable<HealthEvent>> GetHealthEventsByStaffIdAsync(int staffId)
    {
        return await _healthEventRepository.GetHealthEventsByStaffIdAsync(staffId);
    }

    public async Task<IEnumerable<HealthEvent>> GetHealthEventsByDateRangeAsync(
        DateTime startDate,
        DateTime endDate
    )
    {
        return await _healthEventRepository.GetHealthEventsByDateRangeAsync(startDate, endDate);
    }

    public async Task<IEnumerable<HealthEvent>> GetHealthEventsByTypeAsync(string eventType)
    {
        return await _healthEventRepository.GetHealthEventsByTypeAsync(eventType);
    }

    public async Task<IEnumerable<HealthEvent>> GetRecentHealthEventsAsync(int count)
    {
        return await _healthEventRepository.GetRecentHealthEventsAsync(count);
    }

    public async Task<IEnumerable<HealthEvent>> GetHealthEventsByGradeAsync(int grade)
    {
        return await _healthEventRepository.GetHealthEventsByGradeAsync(grade);
    }

    public async Task<IEnumerable<HealthEvent>> GetHealthEventsForNurseByGradeAsync(int staffId)
    {
        return await _healthEventRepository.GetHealthEventsForNurseByGradeAsync(staffId);
    }

    public async Task<IEnumerable<HealthEvent>> GetCriticalIncidentsByStudentAsync(
        string studentCode
    )
    {
        // Lấy tất cả sự cố y tế của học sinh có mức độ nghiêm trọng "severe" hoặc "emergency"
        var allEvents = await _healthEventRepository.GetHealthEventsByStudentCodeAsync(studentCode);

        var criticalIncidents = allEvents
            .Where(he =>
                he.Severity != null
                && (he.Severity.ToLower() == "severe" || he.Severity.ToLower() == "emergency")
            )
            .OrderByDescending(he => he.EventDate)
            .ToList();

        return criticalIncidents;
    }

    // Phương thức helper để validate số lượng thuốc trong kho
    private async Task<(bool IsValid, string ErrorMessage)> ValidateMedicineStockAsync(
        ICollection<HealthEventMedicine>? medicines
    )
    {
        if (medicines == null || !medicines.Any())
        {
            return (true, string.Empty);
        }

        foreach (var medicine in medicines)
        {
            var medicineInfo = await _medicineService.GetMedicineByIdAsync(medicine.MedicineId);
            if (medicineInfo == null)
            {
                return (false, $"Thuốc với ID {medicine.MedicineId} không tồn tại");
            }

            if (medicineInfo.IsActive != true)
            {
                return (false, $"Thuốc {medicineInfo.Name} không còn hoạt động");
            }

            var quantityNeeded = ExtractQuantityFromDosage(medicine.Dosage);
            if (medicineInfo.StockQuantity < quantityNeeded)
            {
                return (
                    false,
                    $"Thuốc {medicineInfo.Name} không đủ số lượng trong kho (Cần: {quantityNeeded}, Có: {medicineInfo.StockQuantity})"
                );
            }
        }

        return (true, string.Empty);
    }

    // Phương thức helper để validate số lượng vật tư y tế trong kho
    private async Task<(bool IsValid, string ErrorMessage)> ValidateMedicalSupplyStockAsync(
        ICollection<HealthEventMedicalSupply>? supplies
    )
    {
        if (supplies == null || !supplies.Any())
        {
            return (true, string.Empty);
        }

        foreach (var supply in supplies)
        {
            var supplyInfo = await _medicalSupplyService.GetMedicalSupplyByIdAsync(
                supply.MedicalSupplyId
            );
            if (supplyInfo == null)
            {
                return (false, $"Vật tư y tế với ID {supply.MedicalSupplyId} không tồn tại");
            }

            if (supplyInfo.IsActive != true)
            {
                return (false, $"Vật tư y tế {supplyInfo.Name} không còn hoạt động");
            }

            var quantityNeeded = supply.Quantity ?? 1;
            if (supplyInfo.StockQuantity < quantityNeeded)
            {
                return (
                    false,
                    $"Vật tư y tế {supplyInfo.Name} không đủ số lượng trong kho (Cần: {quantityNeeded}, Có: {supplyInfo.StockQuantity})"
                );
            }
        }

        return (true, string.Empty);
    }

    // Phương thức helper để cập nhật số lượng kho
    private async Task UpdateInventoryStockAsync(HealthEvent healthEvent)
    {
        try
        {
            // Cập nhật số lượng thuốc - chỉ trừ những gì có đủ
            if (healthEvent.HealthEventMedicines != null && healthEvent.HealthEventMedicines.Any())
            {
                foreach (var medicine in healthEvent.HealthEventMedicines)
                {
                    var quantityUsed = ExtractQuantityFromDosage(medicine.Dosage);

                    // Kiểm tra lại số lượng có sẵn trước khi trừ
                    var medicineInfo = await _medicineService.GetMedicineByIdAsync(
                        medicine.MedicineId
                    );
                    if (
                        medicineInfo != null
                        && medicineInfo.IsActive == true
                        && medicineInfo.StockQuantity >= quantityUsed
                    )
                    {
                        var success = await _medicineService.UpdateStockQuantityAsync(
                            medicine.MedicineId,
                            quantityUsed
                        );
                        if (!success) { }
                    }
                    else { }
                }
            }

            // Cập nhật số lượng vật tư y tế - chỉ trừ những gì có đủ
            if (
                healthEvent.HealthEventMedicalSupplies != null
                && healthEvent.HealthEventMedicalSupplies.Any()
            )
            {
                foreach (var supply in healthEvent.HealthEventMedicalSupplies)
                {
                    var quantityUsed = supply.Quantity ?? 1;

                    // Kiểm tra lại số lượng có sẵn trước khi trừ
                    var supplyInfo = await _medicalSupplyService.GetMedicalSupplyByIdAsync(
                        supply.MedicalSupplyId
                    );
                    if (
                        supplyInfo != null
                        && supplyInfo.IsActive == true
                        && supplyInfo.StockQuantity >= quantityUsed
                    )
                    {
                        var success = await _medicalSupplyService.UpdateStockQuantityAsync(
                            supply.MedicalSupplyId,
                            quantityUsed
                        );
                        if (!success) { }
                    }
                    else { }
                }
            }
        }
        catch { }
    }

    // Phương thức helper để extract số lượng từ dosage string
    private decimal ExtractQuantityFromDosage(string? dosage)
    {
        if (string.IsNullOrEmpty(dosage))
        {
            return 1; // Default quantity
        }

        // Tìm số ở đầu chuỗi (có thể có dấu thập phân)
        var match = System.Text.RegularExpressions.Regex.Match(dosage, @"^(\d+(?:\.\d+)?)");
        if (match.Success && decimal.TryParse(match.Groups[1].Value, out decimal quantity))
        {
            return quantity;
        }

        return 1; // Default quantity nếu không parse được
    }

    // Helper method to get grade by student code (similar to MedicineRequestService)
    private async Task<int?> GetGradeByStudentCodeAsync(string studentCode)
    {
        try
        {
            var student = await _studentRepository.GetStudentByCodeAsync(studentCode);

            if (student == null)
            {
                return null;
            }

            if (student.Class == null)
            {
                return null;
            }

            return student.Class.GradeLevel;
        }
        catch (Exception)
        {
            return null;
        }
    }

    private async Task CreateHealthRecordFromEvent(HealthEvent healthEvent)
    {
        try
        {
            var student = await _studentRepository.GetStudentByCodeAsync(healthEvent.StudentCode!);
            var staff = await _staffRepository.GetStaffByIdAsync(healthEvent.StaffId!.Value);

            var healthRecord = new HealthRecord
            {
                StudentCode = healthEvent.StudentCode!,
                HealthEventId = healthEvent.EventId,
                Title = $"Sự cố y tế - {GetEventTypeVietnamese(healthEvent.EventType)}",
                EventType = healthEvent.EventType,
                Severity = healthEvent.Severity!,
                Description =
                    $"Triệu chứng: {healthEvent.Symptoms}\nĐánh giá: {healthEvent.Assessment}",
                Treatment = healthEvent.Treatment,
                EventDate = healthEvent.EventDate,
                CreatedBy = healthEvent.StaffId,
                Notes = healthEvent.Notes,
                CreatedAt = DateTime.UtcNow,
            };

            _context.HealthRecords.Add(healthRecord);
            await _context.SaveChangesAsync();
        }
        catch { }
    }

    private string GetEventTypeVietnamese(string eventType)
    {
        return eventType?.ToLower() switch
        {
            "illness" => "Bệnh tật",
            "injury" => "Chấn thương",
            "allergy" => "Dị ứng",
            "chronic" => "Bệnh mãn tính",
            _ => "Khác",
        };
    }
}
