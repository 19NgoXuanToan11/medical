using System;

namespace DB;

[Flags]
public enum Permissions
{
    None = 0,

    // Quyền chung
    ViewDashboard = 1 << 0,
    ViewHistory = 1 << 1,
    ExportReport = 1 << 2,

    // Quyền của Nurse
    CreateHealthEvent = 1 << 3,
    CreateInjectionForm = 1 << 4,
    CreateHealthCheckForm = 1 << 5,
    UpdateHealthChecklist = 1 << 6,
    ProcessRequest = 1 << 7,
    UpdateHealthProfile = 1 << 8,
    ProcessInjection = 1 << 9,
    ProcessHealthCheck = 1 << 10,

    // Quyền của Manager
    ManageUsers = 1 << 11,
    ManageMedicine = 1 << 12,
    ManageMedicalSupply = 1 << 13,
    ImportExcel = 1 << 14,

    // Quyền của Admin
    ViewAllHistory = 1 << 15,
    ExportAllReports = 1 << 16,

    // Các role mặc định
    Nurse =
        ViewDashboard
        | CreateHealthEvent
        | CreateInjectionForm
        | CreateHealthCheckForm
        | UpdateHealthChecklist
        | ProcessRequest
        | UpdateHealthProfile
        | ProcessInjection
        | ProcessHealthCheck,

    Manager = ViewDashboard | ManageUsers | ManageMedicine | ManageMedicalSupply | ImportExcel,

    Admin = ViewDashboard | ViewAllHistory | ExportAllReports,
}
