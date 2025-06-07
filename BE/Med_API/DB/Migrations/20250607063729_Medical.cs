using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DB.Migrations
{
    /// <inheritdoc />
    public partial class Medical : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Medical_Supply",
                columns: table => new
                {
                    SupplyID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Category = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    StockQuantity = table.Column<decimal>(type: "decimal(10,2)", nullable: true, defaultValue: 0m),
                    IsActive = table.Column<bool>(type: "bit", nullable: true, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Medical___7CDD6C8E0BF90B60", x => x.SupplyID);
                });

            migrationBuilder.CreateTable(
                name: "Medicine",
                columns: table => new
                {
                    MedicineID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    StockQuantity = table.Column<decimal>(type: "decimal(10,2)", nullable: true, defaultValue: 0m),
                    IsActive = table.Column<bool>(type: "bit", nullable: true, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Medicine__4F2128F091736C4F", x => x.MedicineID);
                });

            migrationBuilder.CreateTable(
                name: "Role",
                columns: table => new
                {
                    RoleID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleName = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Role__8AFACE3A8BFD5C33", x => x.RoleID);
                });

            migrationBuilder.CreateTable(
                name: "Staff",
                columns: table => new
                {
                    StaffID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleID = table.Column<int>(type: "int", nullable: true),
                    FirstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Username = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Staff__96D4AAF731254C53", x => x.StaffID);
                    table.ForeignKey(
                        name: "FK_Staff_Role_RoleID",
                        column: x => x.RoleID,
                        principalTable: "Role",
                        principalColumn: "RoleID");
                });

            migrationBuilder.CreateTable(
                name: "Dashboard_Summary",
                columns: table => new
                {
                    SummaryID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StaffID = table.Column<int>(type: "int", nullable: true),
                    GeneratedDate = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    TotalInjectionParticipants = table.Column<int>(type: "int", nullable: true, defaultValue: 0),
                    TotalInjectionNonParticipants = table.Column<int>(type: "int", nullable: true, defaultValue: 0),
                    InjectionParticipationRate = table.Column<decimal>(type: "decimal(5,2)", nullable: true, defaultValue: 0m),
                    TotalHealthCheckParticipants = table.Column<int>(type: "int", nullable: true, defaultValue: 0),
                    TotalHealthCheckNonParticipants = table.Column<int>(type: "int", nullable: true, defaultValue: 0),
                    HealthCheckParticipationRate = table.Column<decimal>(type: "decimal(5,2)", nullable: true, defaultValue: 0m),
                    TotalHealthEvents = table.Column<int>(type: "int", nullable: true, defaultValue: 0),
                    TotalMedicineRequests = table.Column<int>(type: "int", nullable: true, defaultValue: 0),
                    TotalAppointments = table.Column<int>(type: "int", nullable: true, defaultValue: 0),
                    ScheduledAppointments = table.Column<int>(type: "int", nullable: true, defaultValue: 0),
                    CompletedAppointments = table.Column<int>(type: "int", nullable: true, defaultValue: 0),
                    TotalMedicineItems = table.Column<int>(type: "int", nullable: true, defaultValue: 0),
                    TotalSupplyItems = table.Column<int>(type: "int", nullable: true, defaultValue: 0),
                    InjectionFormID = table.Column<int>(type: "int", nullable: true),
                    HealthCheckFormID = table.Column<int>(type: "int", nullable: true),
                    HealthEventID = table.Column<int>(type: "int", nullable: true),
                    MedicineRequestID = table.Column<int>(type: "int", nullable: true),
                    AppointmentID = table.Column<int>(type: "int", nullable: true),
                    MedicineID = table.Column<int>(type: "int", nullable: true),
                    SupplyID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Dashboar__DAB10E0FE883130D", x => x.SummaryID);
                    table.ForeignKey(
                        name: "FK__Dashboard_Summary__StaffID",
                        column: x => x.StaffID,
                        principalTable: "Staff",
                        principalColumn: "StaffID");
                });

            migrationBuilder.CreateTable(
                name: "Student",
                columns: table => new
                {
                    StudentID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StaffID = table.Column<int>(type: "int", nullable: true),
                    StudentCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DateOfBirth = table.Column<DateOnly>(type: "date", nullable: false),
                    Gender = table.Column<string>(type: "char(1)", unicode: false, fixedLength: true, maxLength: 1, nullable: true),
                    Address = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ClassName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    GradeLevel = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: true, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Student__32C52A7964894850", x => x.StudentID);
                    table.ForeignKey(
                        name: "FK__Student__StaffID__6EF57B66",
                        column: x => x.StaffID,
                        principalTable: "Staff",
                        principalColumn: "StaffID");
                });

            migrationBuilder.CreateTable(
                name: "Report",
                columns: table => new
                {
                    ReportID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReportType = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    ReportName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    GeneratedDate = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    DateRange_Start = table.Column<DateOnly>(type: "date", nullable: true),
                    DateRange_End = table.Column<DateOnly>(type: "date", nullable: true),
                    InjectionData = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HealthCheckData = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HealthEventData = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InventoryData = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NonParticipantData = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AppointmentData = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GeneratedBy = table.Column<int>(type: "int", nullable: true),
                    BasedOnDashboardID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Report__D5BD48E573B45ED0", x => x.ReportID);
                    table.ForeignKey(
                        name: "FK__Report__BasedOnDashboardID",
                        column: x => x.BasedOnDashboardID,
                        principalTable: "Dashboard_Summary",
                        principalColumn: "SummaryID");
                    table.ForeignKey(
                        name: "FK__Report__GeneratedBy",
                        column: x => x.GeneratedBy,
                        principalTable: "Staff",
                        principalColumn: "StaffID");
                });

            migrationBuilder.CreateTable(
                name: "Health_Event",
                columns: table => new
                {
                    EventID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentID = table.Column<int>(type: "int", nullable: true),
                    StaffID = table.Column<int>(type: "int", nullable: true),
                    EventDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    EventType = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Symptoms = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Assessment = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Treatment = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    ParentNotified = table.Column<bool>(type: "bit", nullable: true, defaultValue: false),
                    FollowUpRequired = table.Column<bool>(type: "bit", nullable: true, defaultValue: false),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    MedicinesUsed = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    SuppliesUsed = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Health_E__7944C870BB836071", x => x.EventID);
                    table.ForeignKey(
                        name: "FK__Health_Event__StaffID",
                        column: x => x.StaffID,
                        principalTable: "Staff",
                        principalColumn: "StaffID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK__Health_Event__StudentID",
                        column: x => x.StudentID,
                        principalTable: "Student",
                        principalColumn: "StudentID",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Health_Profile",
                columns: table => new
                {
                    HealthProfileID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentID = table.Column<int>(type: "int", nullable: true),
                    BloodType = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: true),
                    Height = table.Column<decimal>(type: "decimal(5,2)", nullable: true),
                    Weight = table.Column<decimal>(type: "decimal(5,2)", nullable: true),
                    HasAllergies = table.Column<bool>(type: "bit", nullable: true, defaultValue: false),
                    AllergyDetails = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    HasChronicDiseases = table.Column<bool>(type: "bit", nullable: true, defaultValue: false),
                    ChronicDetails = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    HasPreviousTreatment = table.Column<bool>(type: "bit", nullable: true, defaultValue: false),
                    TreatmentDetails = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    HasCompleteVaccinations = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: true),
                    VaccinationDetails = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Vaccinations = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    HasVisionIssues = table.Column<bool>(type: "bit", nullable: true, defaultValue: false),
                    LeftEye = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    RightEye = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    VisionNotes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    HasHearingIssues = table.Column<bool>(type: "bit", nullable: true, defaultValue: false),
                    LeftEar = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    RightEar = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    HearingNotes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    EmergencyContact = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    OtherInfo = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    LastUpdated = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Health_P__73C2C2B5FF5B2341", x => x.HealthProfileID);
                    table.ForeignKey(
                        name: "FK__Health_Profile__StudentID",
                        column: x => x.StudentID,
                        principalTable: "Student",
                        principalColumn: "StudentID",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Parent",
                columns: table => new
                {
                    ParentID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StaffID = table.Column<int>(type: "int", nullable: true),
                    StudentID = table.Column<int>(type: "int", nullable: true),
                    FirstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Relationship = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Address = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Occupation = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    IsEmergencyContact = table.Column<bool>(type: "bit", nullable: true, defaultValue: false),
                    IsMainContact = table.Column<bool>(type: "bit", nullable: true, defaultValue: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: true, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Parent__D339510FC35C248C", x => x.ParentID);
                    table.ForeignKey(
                        name: "FK__Parent__StaffID__70DDC3D8",
                        column: x => x.StaffID,
                        principalTable: "Staff",
                        principalColumn: "StaffID");
                    table.ForeignKey(
                        name: "FK__Parent__StudentI__6FE99F9F",
                        column: x => x.StudentID,
                        principalTable: "Student",
                        principalColumn: "StudentID");
                });

            migrationBuilder.CreateTable(
                name: "Appointment",
                columns: table => new
                {
                    AppointmentID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentID = table.Column<int>(type: "int", nullable: true),
                    ParentID = table.Column<int>(type: "int", nullable: true),
                    StaffID = table.Column<int>(type: "int", nullable: true),
                    AppointmentDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    AppointmentType = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Status = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true, defaultValue: "Scheduled"),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Appointm__8ECDFCA24A1FE88D", x => x.AppointmentID);
                    table.ForeignKey(
                        name: "FK_Appointment_Parent_ParentID",
                        column: x => x.ParentID,
                        principalTable: "Parent",
                        principalColumn: "ParentID");
                    table.ForeignKey(
                        name: "FK_Appointment_Staff_StaffID",
                        column: x => x.StaffID,
                        principalTable: "Staff",
                        principalColumn: "StaffID");
                    table.ForeignKey(
                        name: "FK_Appointment_Student_StudentID",
                        column: x => x.StudentID,
                        principalTable: "Student",
                        principalColumn: "StudentID");
                });

            migrationBuilder.CreateTable(
                name: "Health_Check_Form",
                columns: table => new
                {
                    FormID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentID = table.Column<int>(type: "int", nullable: true),
                    ParentID = table.Column<int>(type: "int", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    ConsentStatus = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true, defaultValue: "Pending"),
                    ConsentDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    GradeLevel = table.Column<int>(type: "int", nullable: true),
                    ClassName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ConfirmStatus = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    ConfirmedBy = table.Column<int>(type: "int", nullable: true),
                    ConfirmedDate = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Health_C__FB05B7BD3533D90A", x => x.FormID);
                    table.ForeignKey(
                        name: "FK__Health_Check_Form__ConfirmedBy",
                        column: x => x.ConfirmedBy,
                        principalTable: "Staff",
                        principalColumn: "StaffID");
                    table.ForeignKey(
                        name: "FK__Health_Check_Form__ParentID",
                        column: x => x.ParentID,
                        principalTable: "Parent",
                        principalColumn: "ParentID");
                    table.ForeignKey(
                        name: "FK__Health_Check_Form__StudentID",
                        column: x => x.StudentID,
                        principalTable: "Student",
                        principalColumn: "StudentID");
                });

            migrationBuilder.CreateTable(
                name: "Injection_Form",
                columns: table => new
                {
                    FormID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentID = table.Column<int>(type: "int", nullable: true),
                    ParentID = table.Column<int>(type: "int", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    InjectionName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ConsentStatus = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true, defaultValue: "Pending"),
                    ConsentDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    GradeLevel = table.Column<int>(type: "int", nullable: true),
                    ClassName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ConfirmStatus = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    ConfirmedBy = table.Column<int>(type: "int", nullable: true),
                    ConfirmedDate = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Injectio__FB05B7BDEC6DF4D0", x => x.FormID);
                    table.ForeignKey(
                        name: "FK__Injection_Form__ConfirmedBy",
                        column: x => x.ConfirmedBy,
                        principalTable: "Staff",
                        principalColumn: "StaffID");
                    table.ForeignKey(
                        name: "FK__Injection_Form__ParentID",
                        column: x => x.ParentID,
                        principalTable: "Parent",
                        principalColumn: "ParentID");
                    table.ForeignKey(
                        name: "FK__Injection_Form__StudentID",
                        column: x => x.StudentID,
                        principalTable: "Student",
                        principalColumn: "StudentID");
                });

            migrationBuilder.CreateTable(
                name: "Medicine_Request",
                columns: table => new
                {
                    RequestID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentID = table.Column<int>(type: "int", nullable: true),
                    MedicineName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Dosage = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Frequency = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    TimeOfDay = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    MealRelation = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: false),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Instructions = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    MedicationImagePath = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    PrescriptionImagePath = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Status = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true, defaultValue: "Pending"),
                    RequestDate = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    ParentID = table.Column<int>(type: "int", nullable: true),
                    StaffID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Medicine__33A8519AA6EED751", x => x.RequestID);
                    table.ForeignKey(
                        name: "FK__Medicine_Request__ParentID",
                        column: x => x.ParentID,
                        principalTable: "Parent",
                        principalColumn: "ParentID");
                    table.ForeignKey(
                        name: "FK__Medicine_Request__StaffID",
                        column: x => x.StaffID,
                        principalTable: "Staff",
                        principalColumn: "StaffID");
                    table.ForeignKey(
                        name: "FK__Medicine_Request__StudentID",
                        column: x => x.StudentID,
                        principalTable: "Student",
                        principalColumn: "StudentID");
                });

            migrationBuilder.CreateTable(
                name: "Health_Check_Result",
                columns: table => new
                {
                    ResultID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FormID = table.Column<int>(type: "int", nullable: true),
                    StudentID = table.Column<int>(type: "int", nullable: true),
                    ExaminedBy = table.Column<int>(type: "int", nullable: true),
                    ExaminedDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    Height = table.Column<decimal>(type: "decimal(5,2)", nullable: true),
                    Weight = table.Column<decimal>(type: "decimal(5,2)", nullable: true),
                    VisionRight = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    VisionLeft = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    HearingStatus = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    BloodPressure = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    HeartRate = table.Column<int>(type: "int", nullable: true),
                    GeneralFindings = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Recommendations = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Health_C__97690228CF51D4A0", x => x.ResultID);
                    table.ForeignKey(
                        name: "FK__Health_Check_Result__ExaminedBy",
                        column: x => x.ExaminedBy,
                        principalTable: "Staff",
                        principalColumn: "StaffID");
                    table.ForeignKey(
                        name: "FK__Health_Check_Result__FormID",
                        column: x => x.FormID,
                        principalTable: "Health_Check_Form",
                        principalColumn: "FormID");
                    table.ForeignKey(
                        name: "FK__Health_Check_Result__StudentID",
                        column: x => x.StudentID,
                        principalTable: "Student",
                        principalColumn: "StudentID");
                });

            migrationBuilder.CreateTable(
                name: "Injection_Result",
                columns: table => new
                {
                    ResultID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FormID = table.Column<int>(type: "int", nullable: true),
                    StudentID = table.Column<int>(type: "int", nullable: true),
                    AdministeredBy = table.Column<int>(type: "int", nullable: true),
                    AdministeredDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    ImmediateReaction = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    FollowUpRequired = table.Column<bool>(type: "bit", nullable: true),
                    FollowUpNotes = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Injectio__9769022834983DA5", x => x.ResultID);
                    table.ForeignKey(
                        name: "FK__Injection_Result__AdministeredBy",
                        column: x => x.AdministeredBy,
                        principalTable: "Staff",
                        principalColumn: "StaffID");
                    table.ForeignKey(
                        name: "FK__Injection_Result__FormID",
                        column: x => x.FormID,
                        principalTable: "Injection_Form",
                        principalColumn: "FormID");
                    table.ForeignKey(
                        name: "FK__Injection_Result__StudentID",
                        column: x => x.StudentID,
                        principalTable: "Student",
                        principalColumn: "StudentID");
                });

            migrationBuilder.CreateTable(
                name: "Request_Result",
                columns: table => new
                {
                    ResultID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RequestID = table.Column<int>(type: "int", nullable: true),
                    Status = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false),
                    SubmittedAt = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    AdministeredBy = table.Column<int>(type: "int", nullable: true),
                    AdministeredTime = table.Column<DateTime>(type: "datetime", nullable: true),
                    ActionBy = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Request___97690228392A5FD6", x => x.ResultID);
                    table.ForeignKey(
                        name: "FK__Request_Result__ActionBy",
                        column: x => x.ActionBy,
                        principalTable: "Staff",
                        principalColumn: "StaffID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK__Request_Result__AdministeredBy",
                        column: x => x.AdministeredBy,
                        principalTable: "Staff",
                        principalColumn: "StaffID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK__Request_Result__RequestID",
                        column: x => x.RequestID,
                        principalTable: "Medicine_Request",
                        principalColumn: "RequestID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_ParentID",
                table: "Appointment",
                column: "ParentID");

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_StaffID",
                table: "Appointment",
                column: "StaffID");

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_StudentID",
                table: "Appointment",
                column: "StudentID");

            migrationBuilder.CreateIndex(
                name: "IX_Dashboard_Summary_StaffID",
                table: "Dashboard_Summary",
                column: "StaffID");

            migrationBuilder.CreateIndex(
                name: "IX_Health_Check_Form_ConfirmedBy",
                table: "Health_Check_Form",
                column: "ConfirmedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Health_Check_Form_ParentID",
                table: "Health_Check_Form",
                column: "ParentID");

            migrationBuilder.CreateIndex(
                name: "IX_Health_Check_Form_StudentID",
                table: "Health_Check_Form",
                column: "StudentID");

            migrationBuilder.CreateIndex(
                name: "IX_Health_Check_Result_ExaminedBy",
                table: "Health_Check_Result",
                column: "ExaminedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Health_Check_Result_FormID",
                table: "Health_Check_Result",
                column: "FormID");

            migrationBuilder.CreateIndex(
                name: "IX_Health_Check_Result_StudentID",
                table: "Health_Check_Result",
                column: "StudentID");

            migrationBuilder.CreateIndex(
                name: "IX_Health_Event_StaffID",
                table: "Health_Event",
                column: "StaffID");

            migrationBuilder.CreateIndex(
                name: "IX_Health_Event_StudentID",
                table: "Health_Event",
                column: "StudentID");

            migrationBuilder.CreateIndex(
                name: "IX_Health_Profile_StudentID",
                table: "Health_Profile",
                column: "StudentID");

            migrationBuilder.CreateIndex(
                name: "IX_Injection_Form_ConfirmedBy",
                table: "Injection_Form",
                column: "ConfirmedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Injection_Form_ParentID",
                table: "Injection_Form",
                column: "ParentID");

            migrationBuilder.CreateIndex(
                name: "IX_Injection_Form_StudentID",
                table: "Injection_Form",
                column: "StudentID");

            migrationBuilder.CreateIndex(
                name: "IX_Injection_Result_AdministeredBy",
                table: "Injection_Result",
                column: "AdministeredBy");

            migrationBuilder.CreateIndex(
                name: "IX_Injection_Result_FormID",
                table: "Injection_Result",
                column: "FormID");

            migrationBuilder.CreateIndex(
                name: "IX_Injection_Result_StudentID",
                table: "Injection_Result",
                column: "StudentID");

            migrationBuilder.CreateIndex(
                name: "IX_Medicine_Request_ParentID",
                table: "Medicine_Request",
                column: "ParentID");

            migrationBuilder.CreateIndex(
                name: "IX_Medicine_Request_StaffID",
                table: "Medicine_Request",
                column: "StaffID");

            migrationBuilder.CreateIndex(
                name: "IX_Medicine_Request_StudentID",
                table: "Medicine_Request",
                column: "StudentID");

            migrationBuilder.CreateIndex(
                name: "IX_Parent_StaffID",
                table: "Parent",
                column: "StaffID");

            migrationBuilder.CreateIndex(
                name: "IX_Parent_StudentID",
                table: "Parent",
                column: "StudentID");

            migrationBuilder.CreateIndex(
                name: "IX_Report_BasedOnDashboardID",
                table: "Report",
                column: "BasedOnDashboardID");

            migrationBuilder.CreateIndex(
                name: "IX_Report_GeneratedBy",
                table: "Report",
                column: "GeneratedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Request_Result_ActionBy",
                table: "Request_Result",
                column: "ActionBy");

            migrationBuilder.CreateIndex(
                name: "IX_Request_Result_AdministeredBy",
                table: "Request_Result",
                column: "AdministeredBy");

            migrationBuilder.CreateIndex(
                name: "IX_Request_Result_RequestID",
                table: "Request_Result",
                column: "RequestID");

            migrationBuilder.CreateIndex(
                name: "UQ__Role__8A2B616058FE1837",
                table: "Role",
                column: "RoleName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Staff_RoleID",
                table: "Staff",
                column: "RoleID");

            migrationBuilder.CreateIndex(
                name: "UQ__Staff__536C85E4FC5C7093",
                table: "Staff",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__Staff__A9D10534AFE18051",
                table: "Staff",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Student_StaffID",
                table: "Student",
                column: "StaffID");

            migrationBuilder.CreateIndex(
                name: "UQ__Student__1FC8860437093A19",
                table: "Student",
                column: "StudentCode",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Appointment");

            migrationBuilder.DropTable(
                name: "Health_Check_Result");

            migrationBuilder.DropTable(
                name: "Health_Event");

            migrationBuilder.DropTable(
                name: "Health_Profile");

            migrationBuilder.DropTable(
                name: "Injection_Result");

            migrationBuilder.DropTable(
                name: "Medical_Supply");

            migrationBuilder.DropTable(
                name: "Medicine");

            migrationBuilder.DropTable(
                name: "Report");

            migrationBuilder.DropTable(
                name: "Request_Result");

            migrationBuilder.DropTable(
                name: "Health_Check_Form");

            migrationBuilder.DropTable(
                name: "Injection_Form");

            migrationBuilder.DropTable(
                name: "Dashboard_Summary");

            migrationBuilder.DropTable(
                name: "Medicine_Request");

            migrationBuilder.DropTable(
                name: "Parent");

            migrationBuilder.DropTable(
                name: "Student");

            migrationBuilder.DropTable(
                name: "Staff");

            migrationBuilder.DropTable(
                name: "Role");
        }
    }
}
