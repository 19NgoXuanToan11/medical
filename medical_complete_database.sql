-- =====================================================
-- MEDICAL SCHOOL MANAGEMENT SYSTEM - COMPLETE DATABASE
-- Gộp từ a.sql và schema.sql với dữ liệu mẫu đầy đủ
-- Created: 2025-07-21
-- =====================================================

USE [master]
GO

-- Tạo database nếu chưa tồn tại
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'Medical')
BEGIN
    CREATE DATABASE [Medical]
    CONTAINMENT = NONE
    ON PRIMARY 
    ( NAME = N'Medical', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\Medical.mdf' , SIZE = 73728KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
    LOG ON 
    ( NAME = N'Medical_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\Medical_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
    WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
END
GO

-- Cấu hình database
ALTER DATABASE [Medical] SET COMPATIBILITY_LEVEL = 160
GO
ALTER DATABASE [Medical] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Medical] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Medical] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Medical] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Medical] SET ARITHABORT OFF 
GO
ALTER DATABASE [Medical] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [Medical] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Medical] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Medical] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Medical] SET CURSOR_DEFAULT GLOBAL 
GO
ALTER DATABASE [Medical] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Medical] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Medical] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Medical] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Medical] SET ENABLE_BROKER 
GO
ALTER DATABASE [Medical] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Medical] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Medical] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Medical] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Medical] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Medical] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Medical] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Medical] SET RECOVERY FULL 
GO
ALTER DATABASE [Medical] SET MULTI_USER 
GO
ALTER DATABASE [Medical] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Medical] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Medical] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Medical] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [Medical] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [Medical] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'Medical', N'ON'
GO
ALTER DATABASE [Medical] SET QUERY_STORE = ON
GO
ALTER DATABASE [Medical] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO

USE [Medical]
GO

-- =====================================================
-- BẢNG MIGRATION HISTORY
-- =====================================================
CREATE TABLE [dbo].[__EFMigrationsHistory](
    [MigrationId] [nvarchar](150) NOT NULL,
    [ProductVersion] [nvarchar](32) NOT NULL,
    CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED ([MigrationId] ASC)
) ON [PRIMARY]
GO

-- =====================================================
-- BẢNG ROLE (VAI TRÒ)
-- =====================================================
CREATE TABLE [dbo].[Role](
    [RoleID] [int] IDENTITY(1,1) NOT NULL,
    [RoleName] [varchar](50) NOT NULL,
    [Permissions] [int] NOT NULL DEFAULT ((0)),
    CONSTRAINT [PK__Role__8AFACE1A12345678] PRIMARY KEY CLUSTERED ([RoleID] ASC),
    CONSTRAINT [UQ__Role__8A2B616058FE1837] UNIQUE ([RoleName])
) ON [PRIMARY]
GO

-- =====================================================
-- BẢNG STAFF (NHÂN VIÊN)
-- =====================================================
CREATE TABLE [dbo].[Staff](
    [StaffID] [int] IDENTITY(1,1) NOT NULL,
    [RoleID] [int] NULL,
    [FirstName] [nvarchar](50) NOT NULL,
    [LastName] [nvarchar](50) NOT NULL,
    [Email] [nvarchar](100) NOT NULL,
    [Phone] [nvarchar](20) NOT NULL,
    [Username] [varchar](50) NOT NULL,
    [PasswordHash] [nvarchar](255) NOT NULL,
    [IsActiveForRequest] [bit] NOT NULL DEFAULT ((1)),
    CONSTRAINT [PK__Staff__96D4AAF731254C53] PRIMARY KEY CLUSTERED ([StaffID] ASC),
    CONSTRAINT [AK_Staff_Username] UNIQUE ([Username]),
    CONSTRAINT [UQ__Staff__536C85E4FC5C7093] UNIQUE ([Username]),
    CONSTRAINT [UQ__Staff__A9D10534AFE18051] UNIQUE ([Email])
) ON [PRIMARY]
GO

-- =====================================================
-- BẢNG CLASS (LỚP HỌC)
-- =====================================================
CREATE TABLE [dbo].[Class](
    [ClassID] [int] IDENTITY(1,1) NOT NULL,
    [ClassName] [nvarchar](50) NOT NULL,
    [GradeLevel] [int] NOT NULL,
    [Section] [nvarchar](10) NULL,
    [Description] [nvarchar](100) NULL,
    [MaxStudents] [int] NULL,
    [CurrentStudentCount] [int] NULL,
    [ClassTeacher] [nvarchar](50) NULL,
    [ClassRoom] [nvarchar](50) NULL,
    [IsActive] [bit] NOT NULL DEFAULT ((1)),
    [CreatedAt] [datetime] NOT NULL DEFAULT (getdate()),
    [UpdatedAt] [datetime] NULL,
    CONSTRAINT [PK__Class__CB1927C0123456789] PRIMARY KEY CLUSTERED ([ClassID] ASC)
) ON [PRIMARY]
GO

-- =====================================================
-- BẢNG STUDENT (HỌC SINH)
-- =====================================================
CREATE TABLE [dbo].[Student](
    [StudentID] [int] IDENTITY(1,1) NOT NULL,
    [StudentCode] [varchar](20) NOT NULL,
    [FirstName] [nvarchar](50) NOT NULL,
    [LastName] [nvarchar](50) NOT NULL,
    [DateOfBirth] [date] NOT NULL,
    [Gender] [nvarchar](10) NULL,
    [Address] [nvarchar](255) NULL,
    [Password] [nvarchar](255) NOT NULL,
    [IsActive] [bit] NULL DEFAULT ((1)),
    [ClassID] [int] NULL,
    CONSTRAINT [PK__Student__32C52A7964894850] PRIMARY KEY CLUSTERED ([StudentID] ASC),
    CONSTRAINT [AK_Student_StudentCode] UNIQUE ([StudentCode]),
    CONSTRAINT [UQ__Student__1FC8860437093A19] UNIQUE ([StudentCode])
) ON [PRIMARY]
GO

-- =====================================================
-- BẢNG PARENT (PHỤ HUYNH)
-- =====================================================
CREATE TABLE [dbo].[Parent](
    [ParentID] [int] IDENTITY(1,1) NOT NULL,
    [FirstName] [nvarchar](50) NOT NULL,
    [LastName] [nvarchar](50) NOT NULL,
    [Relationship] [varchar](20) NOT NULL,
    [Phone] [nvarchar](20) NOT NULL,
    [Email] [nvarchar](100) NULL,
    [Address] [nvarchar](255) NULL,
    [Occupation] [nvarchar](100) NULL,
    [Password] [nvarchar](255) NOT NULL,
    [IsEmergencyContact] [bit] NULL DEFAULT ((0)),
    [IsMainContact] [bit] NULL DEFAULT ((0)),
    [IsActive] [bit] NULL DEFAULT ((1)),
    CONSTRAINT [PK__Parent__D339510FC35C248C] PRIMARY KEY CLUSTERED ([ParentID] ASC)
) ON [PRIMARY]
GO

-- =====================================================
-- BẢNG STUDENT_PARENT (QUAN HỆ HỌC SINH - PHỤ HUYNH)
-- =====================================================
CREATE TABLE [dbo].[Student_Parent](
    [StudentParentID] [int] IDENTITY(1,1) NOT NULL,
    [StudentCode] [varchar](20) NOT NULL,
    [ParentID] [int] NOT NULL,
    CONSTRAINT [PK_Student_Parent] PRIMARY KEY CLUSTERED ([StudentParentID] ASC)
) ON [PRIMARY]
GO

-- =====================================================
-- BẢNG GRADENURSE (Y TÁ THEO KHỐI LỚP)
-- =====================================================
CREATE TABLE [dbo].[GradeNurse](
    [GradeNurseId] [int] IDENTITY(1,1) NOT NULL,
    [StaffId] [int] NOT NULL,
    [Grade] [int] NOT NULL,
    CONSTRAINT [PK_GradeNurse] PRIMARY KEY CLUSTERED ([GradeNurseId] ASC)
) ON [PRIMARY]
GO

-- =====================================================
-- BẢNG MEDICINE (THUỐC)
-- =====================================================
CREATE TABLE [dbo].[Medicine](
    [MedicineID] [int] IDENTITY(1,1) NOT NULL,
    [Name] [nvarchar](100) NOT NULL,
    [StockQuantity] [decimal](10, 2) NULL DEFAULT ((0.0)),
    [IsActive] [bit] NULL DEFAULT ((1)),
    [AdministrationMethod] [nvarchar](50) NULL,
    [BatchNumber] [nvarchar](100) NULL,
    [Dose] [nvarchar](50) NULL,
    [ExpiryDate] [date] NULL,
    [Manufacturer] [nvarchar](100) NULL,
    [Type] [nvarchar](50) NULL,
    CONSTRAINT [PK__Medicine__4F2128F091736C4F] PRIMARY KEY CLUSTERED ([MedicineID] ASC)
) ON [PRIMARY]
GO

-- =====================================================
-- BẢNG VACCINE (VẮC XIN)
-- =====================================================
CREATE TABLE [dbo].[Vaccine](
    [VaccineId] [int] IDENTITY(1,1) NOT NULL,
    [Name] [nvarchar](100) NOT NULL,
    [Manufacturer] [nvarchar](100) NULL,
    [BatchNumber] [nvarchar](100) NULL,
    [ExpiryDate] [date] NULL,
    [Dose] [nvarchar](50) NULL,
    [AdministrationMethod] [nvarchar](50) NULL,
    [Description] [nvarchar](500) NULL,
    [IsActive] [bit] NULL,
    PRIMARY KEY CLUSTERED ([VaccineId] ASC)
) ON [PRIMARY]
GO

-- =====================================================
-- BẢNG MEDICAL_SUPPLY (VẬT TƯ Y TẾ)
-- =====================================================
CREATE TABLE [dbo].[Medical_Supply](
    [SupplyID] [int] IDENTITY(1,1) NOT NULL,
    [Name] [nvarchar](100) NOT NULL,
    [Category] [nvarchar](50) NULL,
    [Description] [nvarchar](255) NULL,
    [StockQuantity] [decimal](10, 2) NULL DEFAULT ((0.0)),
    [IsActive] [bit] NULL DEFAULT ((1)),
    CONSTRAINT [PK__Medical___7CDD6C8E0BF90B60] PRIMARY KEY CLUSTERED ([SupplyID] ASC)
) ON [PRIMARY]
GO

-- =====================================================
-- BẢNG HEALTH_PROFILE (HỒ SƠ SỨC KHỎE)
-- =====================================================
CREATE TABLE [dbo].[Health_Profile](
    [HealthProfileID] [int] IDENTITY(1,1) NOT NULL,
    [StudentCode] [varchar](20) NOT NULL,
    [BloodType] [varchar](5) NULL,
    [Height] [decimal](5, 2) NULL,
    [Weight] [decimal](5, 2) NULL,
    [HasAllergies] [bit] NULL DEFAULT ((0)),
    [AllergyDetails] [nvarchar](1000) NULL,
    [HasChronicDiseases] [bit] NULL DEFAULT ((0)),
    [ChronicDetails] [nvarchar](1000) NULL,
    [HasPreviousTreatment] [bit] NULL DEFAULT ((0)),
    [TreatmentDetails] [nvarchar](1000) NULL,
    [HasCompleteVaccinations] [varchar](10) NULL,
    [VaccinationDetails] [nvarchar](1000) NULL,
    [Vaccinations] [nvarchar](1000) NULL,
    [HasVisionIssues] [bit] NULL DEFAULT ((0)),
    [LeftEye] [nvarchar](20) NULL,
    [RightEye] [nvarchar](20) NULL,
    [VisionNotes] [nvarchar](1000) NULL,
    [HasHearingIssues] [bit] NULL DEFAULT ((0)),
    [LeftEar] [nvarchar](100) NULL,
    [RightEar] [nvarchar](100) NULL,
    [HearingNotes] [nvarchar](1000) NULL,
    [EmergencyContact] [nvarchar](255) NULL,
    [OtherInfo] [nvarchar](1000) NULL,
    [LastUpdated] [datetime] NULL DEFAULT (getdate()),
    [BloodPressure] [nvarchar](20) NULL,
    [HeartRate] [int] NULL,
    CONSTRAINT [PK__Health_P__73C2C2B5FF5B2341] PRIMARY KEY CLUSTERED ([HealthProfileID] ASC)
) ON [PRIMARY]
GO

-- =====================================================
-- BẢNG HEALTH_EVENT (SỰ KIỆN SỨC KHỎE)
-- =====================================================
CREATE TABLE [dbo].[Health_Event](
    [EventID] [int] IDENTITY(1,1) NOT NULL,
    [StaffID] [int] NULL,
    [EventDate] [datetime] NOT NULL DEFAULT (getdate()),
    [EventType] [varchar](50) NOT NULL,
    [Symptoms] [nvarchar](500) NULL,
    [Assessment] [nvarchar](1000) NULL,
    [Treatment] [nvarchar](1000) NULL,
    [ParentNotified] [bit] NULL DEFAULT ((0)),
    [FollowUpRequired] [bit] NULL DEFAULT ((0)),
    [Notes] [nvarchar](500) NULL,
    [StudentCode] [varchar](20) NULL,
    CONSTRAINT [PK__Health_E__7944C870BB836071] PRIMARY KEY CLUSTERED ([EventID] ASC)
) ON [PRIMARY]
GO

-- =====================================================
-- BẢNG HEALTH_EVENT_MEDICINE (THUỐC DÙNG TRONG SỰ KIỆN)
-- =====================================================
CREATE TABLE [dbo].[Health_Event_Medicine](
    [HealthEventMedicineID] [int] IDENTITY(1,1) NOT NULL,
    [HealthEventID] [int] NOT NULL,
    [MedicineID] [int] NOT NULL,
    [Dosage] [nvarchar](100) NULL,
    [Time] [nvarchar](50) NULL,
    CONSTRAINT [PK_Health_Event_Medicine] PRIMARY KEY CLUSTERED ([HealthEventMedicineID] ASC)
) ON [PRIMARY]
GO

-- =====================================================
-- BẢNG HEALTH_EVENT_MEDICAL_SUPPLY (VẬT TƯ DÙNG TRONG SỰ KIỆN)
-- =====================================================
CREATE TABLE [dbo].[Health_Event_Medical_Supply](
    [HealthEventMedicalSupplyID] [int] IDENTITY(1,1) NOT NULL,
    [HealthEventID] [int] NOT NULL,
    [MedicalSupplyID] [int] NOT NULL,
    [Quantity] [decimal](10, 2) NULL,
    [Time] [nvarchar](50) NULL,
    CONSTRAINT [PK_Health_Event_Medical_Supply] PRIMARY KEY CLUSTERED ([HealthEventMedicalSupplyID] ASC)
) ON [PRIMARY]
GO

-- =====================================================
-- BẢNG MEDICINE_REQUEST (YÊU CẦU THUỐC)
-- =====================================================
CREATE TABLE [dbo].[Medicine_Request](
    [RequestID] [int] IDENTITY(1,1) NOT NULL,
    [Date] [date] NOT NULL,
    [Status] [varchar](20) NULL DEFAULT ('Pending'),
    [RequestDate] [datetime] NULL DEFAULT (getdate()),
    [ParentID] [int] NULL,
    [StaffID] [int] NULL,
    [StudentCode] [varchar](20) NULL,
    [ClassName] [nvarchar](50) NULL,
    [RefusalReason] [nvarchar](500) NULL,
    [FailureReason] [nvarchar](max) NULL,
    [IsResent] [bit] NOT NULL DEFAULT ((0)),
    [OriginalRequestId] [int] NULL,
    CONSTRAINT [PK__Medicine__33A8519AA6EED751] PRIMARY KEY CLUSTERED ([RequestID] ASC)
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

-- =====================================================
-- BẢNG MEDICINE_REQUEST_ITEM (CHI TIẾT YÊU CẦU THUỐC)
-- =====================================================
CREATE TABLE [dbo].[Medicine_Request_Item](
    [MedicineRequestItemID] [int] IDENTITY(1,1) NOT NULL,
    [MedicineRequestID] [int] NOT NULL,
    [MedicineName] [nvarchar](100) NOT NULL,
    [Dosage] [nvarchar](100) NOT NULL,
    [Frequency] [nvarchar](100) NOT NULL,
    [TimeOfDay] [nvarchar](100) NULL,
    [Instructions] [nvarchar](500) NULL,
    [DosageUnit] [nvarchar](50) NULL,
    [Period] [nvarchar](max) NULL,
    [VerificationStatus] [nvarchar](max) NOT NULL DEFAULT (N''),
    CONSTRAINT [PK_Medicine_Request_Item] PRIMARY KEY CLUSTERED ([MedicineRequestItemID] ASC)
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

-- =====================================================
-- BẢNG REQUEST_RESULT (KẾT QUẢ YÊU CẦU)
-- =====================================================
CREATE TABLE [dbo].[Request_Result](
    [ResultID] [int] IDENTITY(1,1) NOT NULL,
    [RequestID] [int] NULL,
    [Status] [varchar](20) NOT NULL,
    [SubmittedAt] [datetime] NULL DEFAULT (getdate()),
    [AdministeredBy] [int] NULL,
    [AdministeredTime] [datetime] NULL,
    [ActionBy] [int] NULL,
    [AdministeredFrequencies] [nvarchar](1000) NULL,
    [CurrentDate] [date] NULL,
    [CurrentDayCount] [int] NULL,
    [Frequency] [nvarchar](20) NULL,
    [TimesPerDay] [int] NULL,
    [FailedAttempts] [int] NULL DEFAULT ((0)),
    [FailedFrequencies] [nvarchar](1000) NULL,
    [FailureReasons] [nvarchar](2000) NULL,
    [IsReRequest] [bit] NOT NULL DEFAULT ((0)),
    [LastAttemptTime] [datetime] NULL,
    [OriginalRequestResultID] [int] NULL,
    [ReRequestReason] [nvarchar](500) NULL,
    CONSTRAINT [PK__Request___97690228392A5FD6] PRIMARY KEY CLUSTERED ([ResultID] ASC)
) ON [PRIMARY]
GO

-- =====================================================
-- BẢNG INJECTION_FORM (PHIẾU TIÊM CHỦNG)
-- =====================================================
CREATE TABLE [dbo].[Injection_Form](
    [FormID] [int] IDENTITY(1,1) NOT NULL,
    [StudentID] [int] NULL,
    [ParentID] [int] NULL,
    [CreatedDate] [datetime] NULL DEFAULT (getdate()),
    [InjectionName] [nvarchar](100) NOT NULL,
    [Description] [nvarchar](500) NULL,
    [ConsentStatus] [varchar](20) NULL DEFAULT ('Pending'),
    [ConsentDate] [datetime] NULL,
    [GradeLevel] [int] NULL,
    [ClassName] [nvarchar](50) NULL,
    [ConfirmStatus] [varchar](20) NULL,
    [ConfirmedBy] [int] NULL,
    [ConfirmedDate] [datetime] NULL,
    [VaccineId] [int] NULL,
    [Status] [nvarchar](20) NULL,
    CONSTRAINT [PK__Injectio__FB05B7BDEC6DF4D0] PRIMARY KEY CLUSTERED ([FormID] ASC)
) ON [PRIMARY]
GO

-- =====================================================
-- BẢNG INJECTION_RESULT (KẾT QUẢ TIÊM CHỦNG)
-- =====================================================
CREATE TABLE [dbo].[Injection_Result](
    [ResultID] [int] IDENTITY(1,1) NOT NULL,
    [FormID] [int] NULL,
    [StudentID] [int] NULL,
    [AdministeredBy] [int] NULL,
    [AdministeredDate] [datetime] NOT NULL,
    [ImmediateReaction] [nvarchar](255) NULL,
    [FollowUpRequired] [bit] NULL,
    [FollowUpNotes] [nvarchar](255) NULL,
    CONSTRAINT [PK__Injectio__9769022834983DA5] PRIMARY KEY CLUSTERED ([ResultID] ASC)
) ON [PRIMARY]
GO

-- =====================================================
-- BẢNG HEALTH_CHECK_FORM (PHIẾU KHÁM SỨC KHỎE)
-- =====================================================
CREATE TABLE [dbo].[Health_Check_Form](
    [FormID] [int] IDENTITY(1,1) NOT NULL,
    [StudentID] [int] NULL,
    [ParentID] [int] NULL,
    [CreatedDate] [datetime] NULL DEFAULT (getdate()),
    [ConsentStatus] [varchar](20) NULL DEFAULT ('Pending'),
    [ConsentDate] [datetime] NULL,
    [GradeLevel] [int] NULL,
    [ClassName] [nvarchar](50) NULL,
    [ConfirmStatus] [varchar](20) NULL,
    [ConfirmedBy] [int] NULL,
    [ConfirmedDate] [datetime] NULL,
    [AutoAdvance] [bit] NULL,
    [Description] [nvarchar](max) NULL,
    [EstimatedDuration] [int] NULL,
    [EstimatedEndTime] [nvarchar](max) NULL,
    [GenerateReport] [bit] NULL,
    [GradeIds] [nvarchar](max) NULL,
    [Location] [nvarchar](max) NULL,
    [NotifyParents] [bit] NULL,
    [RequireParentConfirmation] [bit] NULL,
    [SaveResults] [bit] NULL,
    [ScheduledDate] [datetime2](7) NULL,
    [SelectedStations] [nvarchar](max) NULL,
    [StaffAssigned] [nvarchar](max) NULL,
    [StartTime] [time](7) NULL,
    [Status] [varchar](50) NULL,
    [Title] [nvarchar](max) NULL,
    [TotalStudents] [int] NULL,
    CONSTRAINT [PK__Health_C__FB05B7BD3533D90A] PRIMARY KEY CLUSTERED ([FormID] ASC)
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

-- =====================================================
-- BẢNG HEALTH_CHECK_RESULT (KẾT QUẢ KHÁM SỨC KHỎE)
-- =====================================================
CREATE TABLE [dbo].[Health_Check_Result](
    [ResultID] [int] IDENTITY(1,1) NOT NULL,
    [FormID] [int] NULL,
    [StudentID] [int] NULL,
    [ExaminedBy] [int] NULL,
    [ExaminedDate] [datetime] NOT NULL,
    [Height] [decimal](5, 2) NULL,
    [Weight] [decimal](5, 2) NULL,
    [VisionRight] [nvarchar](20) NULL,
    [VisionLeft] [nvarchar](20) NULL,
    [HearingStatus] [nvarchar](50) NULL,
    [BloodPressure] [nvarchar](20) NULL,
    [HeartRate] [int] NULL,
    [GeneralFindings] [nvarchar](1000) NULL,
    [Recommendations] [nvarchar](1000) NULL,
    CONSTRAINT [PK__Health_C__97690228CF51D4A0] PRIMARY KEY CLUSTERED ([ResultID] ASC)
) ON [PRIMARY]
GO

-- =====================================================
-- BẢNG HEALTHCHECKITEM (MỤC KHÁM SỨC KHỎE)
-- =====================================================
CREATE TABLE [dbo].[HealthCheckItem](
    [ItemID] [int] IDENTITY(1,1) NOT NULL,
    [Code] [nvarchar](50) NOT NULL,
    [Name] [nvarchar](200) NOT NULL,
    [Category] [nvarchar](50) NOT NULL,
    [Description] [nvarchar](1000) NULL,
    [EstimatedTimeMinutes] [int] NOT NULL DEFAULT ((10)),
    [IsActive] [bit] NOT NULL DEFAULT ((1)),
    [CreatedDate] [datetime] NOT NULL DEFAULT (getdate()),
    [UpdatedDate] [datetime] NULL,
    CONSTRAINT [PK_HealthCheckItem] PRIMARY KEY CLUSTERED ([ItemID] ASC)
) ON [PRIMARY]
GO

-- =====================================================
-- BẢNG HEALTHCHECKITEMEDICALSUPPLY (VẬT TƯ CHO KHÁM SỨC KHỎE)
-- =====================================================
CREATE TABLE [dbo].[HealthCheckItemMedicalSupply](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [HealthCheckItemID] [int] NOT NULL,
    [MedicalSupplyID] [int] NOT NULL,
    [QuantityRequired] [decimal](10, 2) NOT NULL DEFAULT ((1.0)),
    [IsOptional] [bit] NOT NULL DEFAULT ((0)),
    [Notes] [nvarchar](500) NULL,
    CONSTRAINT [PK_HealthCheckItemMedicalSupply] PRIMARY KEY CLUSTERED ([Id] ASC)
) ON [PRIMARY]
GO

-- =====================================================
-- BẢNG APPOINTMENT (LỊCH HẸN)
-- =====================================================
CREATE TABLE [dbo].[Appointment](
    [AppointmentID] [int] IDENTITY(1,1) NOT NULL,
    [StudentID] [int] NULL,
    [ParentID] [int] NULL,
    [StaffID] [int] NULL,
    [AppointmentDate] [datetime] NOT NULL,
    [AppointmentType] [varchar](50) NOT NULL,
    [Reason] [nvarchar](255) NOT NULL,
    [Status] [varchar](20) NULL,
    [Notes] [nvarchar](500) NULL,
    [CreatedBy] [int] NULL,
    [CreatedDate] [datetime] NULL DEFAULT (getdate()),
    CONSTRAINT [PK__Appointm__8ECDFCA24A1FE88D] PRIMARY KEY CLUSTERED ([AppointmentID] ASC)
) ON [PRIMARY]
GO

-- =====================================================
-- BẢNG BLOG (TIN TỨC - BLOG)
-- =====================================================
CREATE TABLE [dbo].[Blog](
    [BlogID] [int] IDENTITY(1,1) NOT NULL,
    [Title] [nvarchar](200) NOT NULL,
    [Content] [nvarchar](4000) NOT NULL,
    [Summary] [nvarchar](500) NULL,
    [ImageUrl] [nvarchar](255) NULL,
    [CreatedDate] [datetime] NOT NULL DEFAULT (getdate()),
    [LastModifiedDate] [datetime] NULL,
    [Category] [nvarchar](50) NULL,
    [Status] [varchar](20) NULL DEFAULT ('Draft'),
    [StaffUsername] [varchar](50) NULL,
    CONSTRAINT [PK__Blog__54379E30A73F0B1A] PRIMARY KEY CLUSTERED ([BlogID] ASC)
) ON [PRIMARY]
GO

-- =====================================================
-- BẢNG DASHBOARD_SUMMARY (TỔNG QUAN DASHBOARD)
-- =====================================================
CREATE TABLE [dbo].[Dashboard_Summary](
    [SummaryID] [int] IDENTITY(1,1) NOT NULL,
    [StaffID] [int] NULL,
    [GeneratedDate] [datetime] NULL DEFAULT (getdate()),
    [TotalInjectionParticipants] [int] NULL DEFAULT ((0)),
    [TotalInjectionNonParticipants] [int] NULL DEFAULT ((0)),
    [InjectionParticipationRate] [decimal](5, 2) NULL DEFAULT ((0.0)),
    [TotalHealthCheckParticipants] [int] NULL DEFAULT ((0)),
    [TotalHealthCheckNonParticipants] [int] NULL DEFAULT ((0)),
    [HealthCheckParticipationRate] [decimal](5, 2) NULL DEFAULT ((0.0)),
    [TotalHealthEvents] [int] NULL DEFAULT ((0)),
    [TotalMedicineRequests] [int] NULL DEFAULT ((0)),
    [TotalAppointments] [int] NULL DEFAULT ((0)),
    [ScheduledAppointments] [int] NULL DEFAULT ((0)),
    [CompletedAppointments] [int] NULL DEFAULT ((0)),
    [TotalMedicineItems] [int] NULL DEFAULT ((0)),
    [TotalSupplyItems] [int] NULL DEFAULT ((0)),
    [InjectionFormID] [int] NULL,
    [HealthCheckFormID] [int] NULL,
    [HealthEventID] [int] NULL,
    [MedicineRequestID] [int] NULL,
    [AppointmentID] [int] NULL,
    [MedicineID] [int] NULL,
    [SupplyID] [int] NULL,
    CONSTRAINT [PK__Dashboar__DAB10E0FE883130D] PRIMARY KEY CLUSTERED ([SummaryID] ASC)
) ON [PRIMARY]
GO

-- =====================================================
-- TẠO CÁC INDEX VÀ RÀNG BUỘC KHÓA NGOẠI
-- =====================================================

-- Index cho bảng Class
CREATE UNIQUE NONCLUSTERED INDEX [UQ__Class__Name_Grade_Section] ON [dbo].[Class]
([ClassName] ASC, [GradeLevel] ASC, [Section] ASC)
WHERE ([Section] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

-- Index cho bảng HealthCheckItem
CREATE UNIQUE NONCLUSTERED INDEX [IX_HealthCheckItem_Code] ON [dbo].[HealthCheckItem]
([Code] ASC)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO

-- =====================================================
-- RÀNG BUỘC KHÓA NGOẠI
-- =====================================================

-- Staff -> Role
ALTER TABLE [dbo].[Staff] WITH CHECK ADD CONSTRAINT [FK_Staff_Role_RoleID] 
FOREIGN KEY([RoleID]) REFERENCES [dbo].[Role] ([RoleID])
GO

-- Student -> Class
ALTER TABLE [dbo].[Student] WITH NOCHECK ADD CONSTRAINT [FK__Student__ClassID] 
FOREIGN KEY([ClassID]) REFERENCES [dbo].[Class] ([ClassID]) ON DELETE SET NULL
GO

-- Student_Parent -> Student
ALTER TABLE [dbo].[Student_Parent] WITH NOCHECK ADD CONSTRAINT [FK_StudentParent_Student] 
FOREIGN KEY([StudentCode]) REFERENCES [dbo].[Student] ([StudentCode])
GO

-- Student_Parent -> Parent
ALTER TABLE [dbo].[Student_Parent] WITH NOCHECK ADD CONSTRAINT [FK_StudentParent_Parent] 
FOREIGN KEY([ParentID]) REFERENCES [dbo].[Parent] ([ParentID])
GO

-- GradeNurse -> Staff
ALTER TABLE [dbo].[GradeNurse] WITH CHECK ADD CONSTRAINT [FK_GradeNurse_Staff_StaffId] 
FOREIGN KEY([StaffId]) REFERENCES [dbo].[Staff] ([StaffID]) ON DELETE CASCADE
GO

-- Health_Profile -> Student
ALTER TABLE [dbo].[Health_Profile] WITH CHECK ADD CONSTRAINT [FK__Health_Profile__StudentCode] 
FOREIGN KEY([StudentCode]) REFERENCES [dbo].[Student] ([StudentCode]) ON DELETE CASCADE
GO

-- Health_Event -> Staff
ALTER TABLE [dbo].[Health_Event] WITH CHECK ADD CONSTRAINT [FK__Health_Event__StaffID] 
FOREIGN KEY([StaffID]) REFERENCES [dbo].[Staff] ([StaffID]) ON DELETE SET NULL
GO

-- Health_Event -> Student
ALTER TABLE [dbo].[Health_Event] WITH CHECK ADD CONSTRAINT [FK__Health_Event__StudentCode] 
FOREIGN KEY([StudentCode]) REFERENCES [dbo].[Student] ([StudentCode]) ON DELETE SET NULL
GO

-- Health_Event_Medicine -> Health_Event
ALTER TABLE [dbo].[Health_Event_Medicine] WITH CHECK ADD CONSTRAINT [FK__Health_Event_Medicine__HealthEventID] 
FOREIGN KEY([HealthEventID]) REFERENCES [dbo].[Health_Event] ([EventID]) ON DELETE CASCADE
GO

-- Health_Event_Medicine -> Medicine
ALTER TABLE [dbo].[Health_Event_Medicine] WITH CHECK ADD CONSTRAINT [FK__Health_Event_Medicine__MedicineID] 
FOREIGN KEY([MedicineID]) REFERENCES [dbo].[Medicine] ([MedicineID])
GO

-- Health_Event_Medical_Supply -> Health_Event
ALTER TABLE [dbo].[Health_Event_Medical_Supply] WITH CHECK ADD CONSTRAINT [FK__Health_Event_Medical_Supply__HealthEventID] 
FOREIGN KEY([HealthEventID]) REFERENCES [dbo].[Health_Event] ([EventID]) ON DELETE CASCADE
GO

-- Health_Event_Medical_Supply -> Medical_Supply
ALTER TABLE [dbo].[Health_Event_Medical_Supply] WITH CHECK ADD CONSTRAINT [FK__Health_Event_Medical_Supply__MedicalSupplyID] 
FOREIGN KEY([MedicalSupplyID]) REFERENCES [dbo].[Medical_Supply] ([SupplyID])
GO

-- Medicine_Request -> Parent
ALTER TABLE [dbo].[Medicine_Request] WITH CHECK ADD CONSTRAINT [FK__Medicine_Request__ParentID] 
FOREIGN KEY([ParentID]) REFERENCES [dbo].[Parent] ([ParentID])
GO

-- Medicine_Request -> Staff
ALTER TABLE [dbo].[Medicine_Request] WITH CHECK ADD CONSTRAINT [FK__Medicine_Request__StaffID] 
FOREIGN KEY([StaffID]) REFERENCES [dbo].[Staff] ([StaffID])
GO

-- Medicine_Request -> Student
ALTER TABLE [dbo].[Medicine_Request] WITH CHECK ADD CONSTRAINT [FK__Medicine_Request__StudentCode] 
FOREIGN KEY([StudentCode]) REFERENCES [dbo].[Student] ([StudentCode])
GO

-- Medicine_Request_Item -> Medicine_Request
ALTER TABLE [dbo].[Medicine_Request_Item] WITH CHECK ADD CONSTRAINT [FK__Medicine_Request_Item__MedicineRequestID] 
FOREIGN KEY([MedicineRequestID]) REFERENCES [dbo].[Medicine_Request] ([RequestID]) ON DELETE CASCADE
GO

-- Request_Result -> Medicine_Request
ALTER TABLE [dbo].[Request_Result] WITH CHECK ADD CONSTRAINT [FK__Request_Result__RequestID] 
FOREIGN KEY([RequestID]) REFERENCES [dbo].[Medicine_Request] ([RequestID])
GO

-- Request_Result -> Staff (AdministeredBy)
ALTER TABLE [dbo].[Request_Result] WITH CHECK ADD CONSTRAINT [FK__Request_Result__AdministeredBy] 
FOREIGN KEY([AdministeredBy]) REFERENCES [dbo].[Staff] ([StaffID])
GO

-- Request_Result -> Staff (ActionBy)
ALTER TABLE [dbo].[Request_Result] WITH CHECK ADD CONSTRAINT [FK__Request_Result__ActionBy] 
FOREIGN KEY([ActionBy]) REFERENCES [dbo].[Staff] ([StaffID])
GO

-- Request_Result -> Request_Result (Self-reference)
ALTER TABLE [dbo].[Request_Result] WITH CHECK ADD CONSTRAINT [FK__Request_Result__OriginalRequestResultID] 
FOREIGN KEY([OriginalRequestResultID]) REFERENCES [dbo].[Request_Result] ([ResultID])
GO

-- Injection_Form -> Student
ALTER TABLE [dbo].[Injection_Form] WITH CHECK ADD CONSTRAINT [FK__Injection_Form__StudentID] 
FOREIGN KEY([StudentID]) REFERENCES [dbo].[Student] ([StudentID])
GO

-- Injection_Form -> Parent
ALTER TABLE [dbo].[Injection_Form] WITH CHECK ADD CONSTRAINT [FK__Injection_Form__ParentID] 
FOREIGN KEY([ParentID]) REFERENCES [dbo].[Parent] ([ParentID])
GO

-- Injection_Form -> Staff
ALTER TABLE [dbo].[Injection_Form] WITH CHECK ADD CONSTRAINT [FK__Injection_Form__ConfirmedBy] 
FOREIGN KEY([ConfirmedBy]) REFERENCES [dbo].[Staff] ([StaffID])
GO

-- Injection_Result -> Injection_Form
ALTER TABLE [dbo].[Injection_Result] WITH CHECK ADD CONSTRAINT [FK__Injection_Result__FormID] 
FOREIGN KEY([FormID]) REFERENCES [dbo].[Injection_Form] ([FormID])
GO

-- Injection_Result -> Student
ALTER TABLE [dbo].[Injection_Result] WITH CHECK ADD CONSTRAINT [FK__Injection_Result__StudentID] 
FOREIGN KEY([StudentID]) REFERENCES [dbo].[Student] ([StudentID])
GO

-- Injection_Result -> Staff
ALTER TABLE [dbo].[Injection_Result] WITH CHECK ADD CONSTRAINT [FK__Injection_Result__AdministeredBy] 
FOREIGN KEY([AdministeredBy]) REFERENCES [dbo].[Staff] ([StaffID])
GO

-- Health_Check_Form -> Student
ALTER TABLE [dbo].[Health_Check_Form] WITH CHECK ADD CONSTRAINT [FK__Health_Check_Form__StudentID] 
FOREIGN KEY([StudentID]) REFERENCES [dbo].[Student] ([StudentID])
GO

-- Health_Check_Form -> Parent
ALTER TABLE [dbo].[Health_Check_Form] WITH CHECK ADD CONSTRAINT [FK__Health_Check_Form__ParentID] 
FOREIGN KEY([ParentID]) REFERENCES [dbo].[Parent] ([ParentID])
GO

-- Health_Check_Form -> Staff
ALTER TABLE [dbo].[Health_Check_Form] WITH CHECK ADD CONSTRAINT [FK__Health_Check_Form__ConfirmedBy] 
FOREIGN KEY([ConfirmedBy]) REFERENCES [dbo].[Staff] ([StaffID])
GO

-- Health_Check_Result -> Health_Check_Form
ALTER TABLE [dbo].[Health_Check_Result] WITH CHECK ADD CONSTRAINT [FK__Health_Check_Result__FormID] 
FOREIGN KEY([FormID]) REFERENCES [dbo].[Health_Check_Form] ([FormID])
GO

-- Health_Check_Result -> Student
ALTER TABLE [dbo].[Health_Check_Result] WITH CHECK ADD CONSTRAINT [FK__Health_Check_Result__StudentID] 
FOREIGN KEY([StudentID]) REFERENCES [dbo].[Student] ([StudentID])
GO

-- Health_Check_Result -> Staff
ALTER TABLE [dbo].[Health_Check_Result] WITH CHECK ADD CONSTRAINT [FK__Health_Check_Result__ExaminedBy] 
FOREIGN KEY([ExaminedBy]) REFERENCES [dbo].[Staff] ([StaffID])
GO

-- HealthCheckItemMedicalSupply -> HealthCheckItem
ALTER TABLE [dbo].[HealthCheckItemMedicalSupply] WITH CHECK ADD CONSTRAINT [FK_HealthCheckItemMedicalSupply_HealthCheckItem] 
FOREIGN KEY([HealthCheckItemID]) REFERENCES [dbo].[HealthCheckItem] ([ItemID]) ON DELETE CASCADE
GO

-- HealthCheckItemMedicalSupply -> Medical_Supply
ALTER TABLE [dbo].[HealthCheckItemMedicalSupply] WITH CHECK ADD CONSTRAINT [FK_HealthCheckItemMedicalSupply_MedicalSupply] 
FOREIGN KEY([MedicalSupplyID]) REFERENCES [dbo].[Medical_Supply] ([SupplyID]) ON DELETE CASCADE
GO

-- Appointment -> Student
ALTER TABLE [dbo].[Appointment] WITH CHECK ADD CONSTRAINT [FK_Appointment_Student_StudentID] 
FOREIGN KEY([StudentID]) REFERENCES [dbo].[Student] ([StudentID])
GO

-- Appointment -> Parent
ALTER TABLE [dbo].[Appointment] WITH CHECK ADD CONSTRAINT [FK_Appointment_Parent_ParentID] 
FOREIGN KEY([ParentID]) REFERENCES [dbo].[Parent] ([ParentID])
GO

-- Appointment -> Staff
ALTER TABLE [dbo].[Appointment] WITH CHECK ADD CONSTRAINT [FK_Appointment_Staff_StaffID] 
FOREIGN KEY([StaffID]) REFERENCES [dbo].[Staff] ([StaffID])
GO

-- Blog -> Staff
ALTER TABLE [dbo].[Blog] WITH CHECK ADD CONSTRAINT [FK__Blog__StaffUsername] 
FOREIGN KEY([StaffUsername]) REFERENCES [dbo].[Staff] ([Username]) ON DELETE SET NULL
GO

-- Dashboard_Summary -> Staff
ALTER TABLE [dbo].[Dashboard_Summary] WITH CHECK ADD CONSTRAINT [FK__Dashboard_Summary__StaffID] 
FOREIGN KEY([StaffID]) REFERENCES [dbo].[Staff] ([StaffID])
GO

-- =====================================================
-- CHÈN DỮ LIỆU MẪU
-- =====================================================

-- Dữ liệu Migration History
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES 
(N'20250613195322_InitialCreate', N'8.0.2'),
(N'20250613210359_RemoveReportTable', N'8.0.5'),
(N'20250613211827_AddBlogEntity', N'8.0.5'),
(N'20250613214546_ChangeBlogStaffIdToUsername', N'8.0.2'),
(N'20250617145309_ChangeStudentIdToStudentCode', N'8.0.2'),
(N'20250617150520_AddMedicineRequestItemTable', N'8.0.2'),
(N'20250617151342_AddClassNameToMedicineRequest', N'8.0.2'),
(N'20250617152854_AddHealthEventItems', N'8.0.2'),
(N'20250617153908_AddVitalSignsToHealthProfile', N'8.0.2'),
(N'20250618090907_RenameIsActiveToIsActiveForRequest', N'8.0.2'),
(N'20250618092639_RemoveImagePathsFromMedicineRequestItem', N'8.0.2'),
(N'20250621075548_FinalParentStudentFix', N'8.0.5'),
(N'20250621083737_AddFrequencyHandlingToRequestResult', N'8.0.5'),
(N'20250621084620_AddFailureHandlingToRequestResult', N'8.0.5'),
(N'20250702072837_AddGradeNurseTable', N'8.0.5'),
(N'20250702095421_ExtendMedicineForVaccineSupport', N'8.0.5'),
(N'20250705030750_AddHealthCheckSchedulingFields', N'8.0.5'),
(N'20250705094549_AddRefusalReasonToMedicineRequest', N'8.0.5'),
(N'20250707165307_AddHealthCheckItemsAndMedicalSupplyRelationships', N'8.0.5'),
(N'20250708083828_AddClassEntity', N'8.0.2'),
(N'20250708083904_AddClassManagement', N'8.0.2'),
(N'20250708095428_UpdateStudentClassRelationship', N'8.0.5'),
(N'20250708103323_SeedSampleData', N'8.0.5'),
(N'20250709021115_AddHealthCheckItemAndMedicalSupplyRelationship', N'8.0.5'),
(N'20250709134501_RemoveIsConsumableColumn', N'8.0.5'),
(N'20250709134727_DropIsConsumableColumn', N'8.0.5'),
(N'20250711053354_SeedClassDataAndUpdateStudentClasses', N'8.0.5'),
(N'20250716024426_AddResentAndFailurePropertiestoMedicineRequest', N'8.0.2'),
(N'20250716043124_RemoveHealthCheckFormStatusDefaultValue', N'8.0.5'),
(N'20250716043608_AddStatusFieldConfiguration', N'8.0.5'),
(N'20250716081911_AddPeriodAndVerificationStatusToMedicineRequestItem', N'8.0.5'),
(N'20250716120000_AddDosageUnitToMedicineRequestItem', N'8.0.6'),
(N'20250720044339_SeedGradeNurseData', N'8.0.2'),
(N'20250720065344_FixGradeNurseRelationship', N'8.0.2'),
(N'20250721072652_UpdateMedicineRequestItemStatusArray', N'8.0.5')
GO

-- Dữ liệu Role
SET IDENTITY_INSERT [dbo].[Role] ON 
INSERT [dbo].[Role] ([RoleID], [RoleName], [Permissions]) VALUES 
(1, N'Admin', 999),
(2, N'Doctor', 500),
(3, N'Nurse', 300),
(4, N'Staff', 100)
SET IDENTITY_INSERT [dbo].[Role] OFF
GO

-- Dữ liệu Staff
SET IDENTITY_INSERT [dbo].[Staff] ON 
INSERT [dbo].[Staff] ([StaffID], [RoleID], [FirstName], [LastName], [Email], [Phone], [Username], [PasswordHash], [IsActiveForRequest]) VALUES 
(1, 1, N'Nguyễn', N'Văn Admin', N'admin@medical.com', N'0123456789', N'admin', N'$2a$11$example_hash_admin', 1),
(2, 2, N'Trần', N'Thị Bác Sĩ', N'doctor@medical.com', N'0123456790', N'doctor1', N'$2a$11$example_hash_doctor', 1),
(3, 3, N'Lê', N'Văn Y Tá', N'nurse@medical.com', N'0123456791', N'nurse1', N'$2a$11$example_hash_nurse', 1),
(4, 3, N'Phạm', N'Thị Y Tá 2', N'nurse2@medical.com', N'0123456792', N'nurse2', N'$2a$11$example_hash_nurse2', 1),
(5, 3, N'Hoàng', N'Văn Y Tá 3', N'nurse3@medical.com', N'0123456793', N'nurse3', N'$2a$11$example_hash_nurse3', 1),
(6, 3, N'Vũ', N'Thị Y Tá 4', N'nurse4@medical.com', N'0123456794', N'nurse4', N'$2a$11$example_hash_nurse4', 1),
(7, 3, N'Đặng', N'Văn Y Tá 5', N'nurse5@medical.com', N'0123456795', N'nurse5', N'$2a$11$example_hash_nurse5', 1),
(8, 4, N'Bùi', N'Thị Nhân Viên', N'staff@medical.com', N'0123456796', N'staff1', N'$2a$11$example_hash_staff', 1),
(10, 3, N'Nguyễn', N'Thị Y Tá Khối 1', N'nurse_grade1@medical.com', N'0123456800', N'nurse_g1', N'$2a$11$example_hash_nurse_g1', 1),
(11, 3, N'Trần', N'Văn Y Tá Khối 2', N'nurse_grade2@medical.com', N'0123456801', N'nurse_g2', N'$2a$11$example_hash_nurse_g2', 1),
(12, 3, N'Lê', N'Thị Y Tá Khối 3', N'nurse_grade3@medical.com', N'0123456802', N'nurse_g3', N'$2a$11$example_hash_nurse_g3', 1),
(13, 3, N'Phạm', N'Văn Y Tá Khối 4', N'nurse_grade4@medical.com', N'0123456803', N'nurse_g4', N'$2a$11$example_hash_nurse_g4', 1),
(14, 3, N'Hoàng', N'Thị Y Tá Khối 5', N'nurse_grade5@medical.com', N'0123456804', N'nurse_g5', N'$2a$11$example_hash_nurse_g5', 1)
SET IDENTITY_INSERT [dbo].[Staff] OFF
GO

-- Dữ liệu Class
SET IDENTITY_INSERT [dbo].[Class] ON 
INSERT [dbo].[Class] ([ClassID], [ClassName], [GradeLevel], [Section], [Description], [MaxStudents], [CurrentStudentCount], [ClassTeacher], [ClassRoom], [IsActive], [CreatedAt], [UpdatedAt]) VALUES 
(1, N'1A', 1, N'A', NULL, 30, 30, N'Cô Nguyễn Thị Lan', N'Phòng 101', 1, '2025-07-08 17:36:59.620', NULL),
(2, N'1B', 1, N'B', NULL, 30, 30, N'Cô Trần Thị Mai', N'Phòng 102', 1, '2025-07-08 17:36:59.620', NULL),
(3, N'1C', 1, N'C', NULL, 30, 30, N'Cô Lê Thị Hoa', N'Phòng 103', 1, '2025-07-08 17:36:59.620', NULL),
(4, N'2A', 2, N'A', NULL, 30, 25, N'Cô Phạm Thị Linh', N'Phòng 201', 1, '2025-07-08 17:36:59.620', NULL),
(5, N'2B', 2, N'B', NULL, 30, 25, N'Cô Vũ Thị Nga', N'Phòng 202', 1, '2025-07-08 17:36:59.620', NULL),
(6, N'2C', 2, N'C', NULL, 30, 30, N'Cô Đặng Thị Tâm', N'Phòng 203', 1, '2025-07-08 17:36:59.620', NULL),
(7, N'3A', 3, N'A', NULL, 30, 25, N'Cô Hoàng Thị Thu', N'Phòng 301', 1, '2025-07-08 17:36:59.620', NULL),
(8, N'3B', 3, N'B', NULL, 30, 25, N'Cô Bùi Thị Vân', N'Phòng 302', 1, '2025-07-08 17:36:59.620', NULL),
(9, N'3C', 3, N'C', NULL, 30, 30, N'Cô Phan Thị Xuân', N'Phòng 303', 1, '2025-07-08 17:36:59.620', NULL),
(10, N'4A', 4, N'A', NULL, 30, 25, N'Cô Ngô Thị Yến', N'Phòng 401', 1, '2025-07-08 17:36:59.620', NULL),
(11, N'4B', 4, N'B', NULL, 30, 25, N'Cô Dương Thị Oanh', N'Phòng 402', 1, '2025-07-08 17:36:59.620', NULL),
(12, N'4C', 4, N'C', NULL, 30, 30, N'Cô Lý Thị Phượng', N'Phòng 403', 1, '2025-07-08 17:36:59.620', NULL),
(13, N'5A', 5, N'A', NULL, 30, 40, N'Cô Võ Thị Quỳnh', N'Phòng 501', 1, '2025-07-08 17:36:59.620', NULL),
(14, N'5B', 5, N'B', NULL, 30, 25, N'Cô Trương Thị Bích', N'Phòng 502', 1, '2025-07-08 17:36:59.620', NULL),
(15, N'5C', 5, N'C', NULL, 30, 30, N'Cô Đinh Thị Cẩm', N'Phòng 503', 1, '2025-07-08 17:36:59.620', NULL)
SET IDENTITY_INSERT [dbo].[Class] OFF
GO

-- Dữ liệu GradeNurse
SET IDENTITY_INSERT [dbo].[GradeNurse] ON 
INSERT [dbo].[GradeNurse] ([GradeNurseId], [StaffId], [Grade]) VALUES 
(2, 10, 1),
(3, 11, 2),
(4, 12, 3),
(5, 13, 4),
(6, 14, 5)
SET IDENTITY_INSERT [dbo].[GradeNurse] OFF
GO

-- Dữ liệu Medicine
SET IDENTITY_INSERT [dbo].[Medicine] ON 
INSERT [dbo].[Medicine] ([MedicineID], [Name], [StockQuantity], [IsActive], [AdministrationMethod], [BatchNumber], [Dose], [ExpiryDate], [Manufacturer], [Type]) VALUES 
(1, N'Paracetamol', 500.00, 1, N'Oral', N'PCM2024001', N'500mg', '2025-12-31', N'Traphaco', N'Thuốc hạ sốt'),
(2, N'Ibuprofen', 300.00, 1, N'Oral', N'IBU2024002', N'400mg', '2025-11-30', N'Stada', N'Thuốc giảm đau'),
(3, N'Amoxicillin', 200.00, 1, N'Oral', N'AMX2024003', N'250mg', '2025-10-31', N'Imexpharm', N'Kháng sinh'),
(4, N'Vitamin C', 1000.00, 1, N'Oral', N'VTC2024004', N'500mg', '2026-06-30', N'DHG Pharma', N'Vitamin'),
(5, N'Aspirin', 250.00, 1, N'Oral', N'ASP2024005', N'100mg', '2025-09-30', N'Bayer', N'Thuốc giảm đau')
SET IDENTITY_INSERT [dbo].[Medicine] OFF
GO

-- Dữ liệu Vaccine
SET IDENTITY_INSERT [dbo].[Vaccine] ON 
INSERT [dbo].[Vaccine] ([VaccineId], [Name], [Manufacturer], [BatchNumber], [ExpiryDate], [Dose], [AdministrationMethod], [Description], [IsActive]) VALUES 
(1, N'Vắc xin COVID-19 Pfizer', N'Pfizer-BioNTech', N'COVID2024001', '2025-08-31', N'0.3ml', N'Tiêm bắp', N'Vắc xin phòng COVID-19', 1),
(2, N'Vắc xin Cúm mùa', N'Sanofi Pasteur', N'FLU2024002', '2025-07-31', N'0.5ml', N'Tiêm bắp', N'Vắc xin phòng cúm mùa', 1),
(3, N'Vắc xin Viêm gan B', N'GSK', N'HBV2024003', '2025-12-31', N'1.0ml', N'Tiêm bắp', N'Vắc xin phòng viêm gan B', 1)
SET IDENTITY_INSERT [dbo].[Vaccine] OFF
GO

-- Dữ liệu Medical_Supply
SET IDENTITY_INSERT [dbo].[Medical_Supply] ON 
INSERT [dbo].[Medical_Supply] ([SupplyID], [Name], [Category], [Description], [StockQuantity], [IsActive]) VALUES 
(88, N'Thước đo chiều cao', N'Dụng cụ đo', N'Thước đo chiều cao chuẩn y tế', 5.00, 1),
(89, N'Cân điện tử', N'Dụng cụ đo', N'Cân điện tử đo cân nặng', 3.00, 1),
(90, N'Thước đo chu vi', N'Dụng cụ đo', N'Thước đo chu vi ngực, bụng', 10.00, 1),
(91, N'Bảng đo thị lực', N'Dụng cụ khám', N'Bảng Snellen đo thị lực', 2.00, 1),
(92, N'Máy đo khúc xạ', N'Thiết bị y tế', N'Máy đo khúc xạ mắt', 1.00, 1),
(96, N'Ống nghe', N'Dụng cụ khám', N'Ống nghe tim phổi', 15.00, 1),
(97, N'Máy đo huyết áp', N'Thiết bị y tế', N'Máy đo huyết áp điện tử', 8.00, 1),
(98, N'Máy đo nhịp tim', N'Thiết bị y tế', N'Máy đo nhịp tim cầm tay', 5.00, 1),
(105, N'Găng tay y tế', N'Vật tư tiêu hao', N'Găng tay latex không bột', 1000.00, 1),
(106, N'Khăn giấy y tế', N'Vật tư tiêu hao', N'Khăn giấy vệ sinh y tế', 500.00, 1),
(110, N'Đèn khám', N'Thiết bị chiếu sáng', N'Đèn LED khám bệnh', 10.00, 1)
SET IDENTITY_INSERT [dbo].[Medical_Supply] OFF
GO

-- Dữ liệu HealthCheckItem
SET IDENTITY_INSERT [dbo].[HealthCheckItem] ON 
INSERT [dbo].[HealthCheckItem] ([ItemID], [Code], [Name], [Category], [Description], [EstimatedTimeMinutes], [IsActive], [CreatedDate], [UpdatedDate]) VALUES 
(1, N'HCI001', N'Chiều cao & Cân nặng', N'Khám thể lực', N'Kiểm tra thể lực', 5, 1, '2025-07-09 09:13:21.063', '2025-07-09 09:53:50.823'),
(2, N'HCI002', N'Thị lực', N'Khám giác quan', N'Kiểm tra thị lực, gần và xa màu sắc', 10, 1, '2025-07-09 09:13:21.063', NULL),
(3, N'HCI003', N'Thính lực', N'Khám giác quan', N'Kiểm tra khả năng nghe và phân biệt âm thanh', 8, 1, '2025-07-09 09:13:21.063', NULL),
(4, N'HCI004', N'Răng miệng', N'Khám miệng', N'Kiểm tra sâu răng, nướu và vệ sinh răng miệng', 12, 1, '2025-07-09 09:13:21.063', NULL),
(5, N'HCI005', N'Tìm mạch', N'Khám tim mạch', N'Nghe tim, đo huyết áp và kiểm tra mạch', 10, 1, '2025-07-09 09:13:21.063', NULL),
(6, N'HCI006', N'Hô hấp', N'Khám hô hấp', N'Khám phổi và đường hô hấp', 8, 1, '2025-07-09 09:13:21.063', NULL),
(7, N'HCI007', N'Xương khớp', N'Khám xương khớp', N'Kiểm tra tư thế, cột sống và khớp', 15, 1, '2025-07-09 09:13:21.063', NULL),
(8, N'HCI008', N'Da liễu', N'Khám da liễu', N'Kiểm tra da, tóc và móng', 8, 1, '2025-07-09 09:13:21.063', NULL),
(9, N'HCI009', N'Thần kinh', N'Khám thần kinh', N'Kiểm tra phản xạ và chức năng thần kinh', 12, 1, '2025-07-09 09:13:21.063', NULL),
(10, N'HCI010', N'Sức khỏe tâm thần', N'Khám tâm lý', N'Đánh giá tâm lý và hành vi học đường', 20, 1, '2025-07-09 09:13:21.063', NULL)
SET IDENTITY_INSERT [dbo].[HealthCheckItem] OFF
GO

-- Dữ liệu HealthCheckItemMedicalSupply
SET IDENTITY_INSERT [dbo].[HealthCheckItemMedicalSupply] ON 
INSERT [dbo].[HealthCheckItemMedicalSupply] ([Id], [HealthCheckItemID], [MedicalSupplyID], [QuantityRequired], [IsOptional], [Notes]) VALUES 
(25, 1, 88, 1.00, 0, N'Đo chiều cao bắt buộc'),
(26, 1, 89, 1.00, 0, N'Cân nặng bắt buộc'),
(27, 1, 90, 1.00, 1, N'Đo chu vi ngực'),
(28, 1, 105, 2.00, 1, N'Găng tay bảo hộ'),
(29, 1, 106, 5.00, 1, N'Khăn giấy vệ sinh'),
(30, 2, 91, 1.00, 0, N'Bảng đo thị lực chuẩn'),
(31, 2, 92, 1.00, 0, N'Máy đo khúc xạ mắt'),
(32, 2, 106, 3.00, 1, N'Khăn giấy lau mắt'),
(33, 2, 110, 1.00, 1, N'Đèn hỗ trợ khám'),
(34, 5, 96, 1.00, 0, N'Ống nghe tim phổi'),
(35, 5, 97, 1.00, 0, N'Máy đo huyết áp'),
(36, 5, 98, 1.00, 1, N'Máy đo nhịp tim (nếu có)'),
(37, 5, 105, 2.00, 1, N'Găng tay khám')
SET IDENTITY_INSERT [dbo].[HealthCheckItemMedicalSupply] OFF
GO

-- Dữ liệu Blog
SET IDENTITY_INSERT [dbo].[Blog] ON 
INSERT [dbo].[Blog] ([BlogID], [Title], [Content], [Summary], [ImageUrl], [CreatedDate], [LastModifiedDate], [Category], [Status], [StaffUsername]) VALUES 
(2, N'Mẹo Giữ Sức Khỏe Cho Học Sinh', N'Tập thể dục đều đặn và ăn uống lành mạnh là chìa khóa để học sinh có sức khỏe tốt. Nên ăn nhiều rau xanh, trái cây và uống đủ nước mỗi ngày.', N'Hướng dẫn giữ gìn sức khỏe', NULL, '2024-03-19 08:00:00.000', NULL, N'Sức khỏe', N'1', N'nurse1'),
(3, N'Tầm Quan Trọng Của Tiêm Chủng', N'Tiêm chủng giúp phòng ngừa các bệnh truyền nhiễm nguy hiểm. Phụ huynh cần đảm bảo con em mình được tiêm chủng đầy đủ theo lịch.', N'Lợi ích của việc tiêm chủng', NULL, '2024-03-19 09:00:00.000', NULL, N'Tiêm chủng', N'1', N'nurse2'),
(4, N'Chăm Sóc Sức Khỏe Tâm Thần', N'Việc chăm sóc sức khỏe tâm thần rất quan trọng đối với học sinh. Cha mẹ và giáo viên cần quan tâm đến tâm lý của trẻ.', N'Hướng dẫn chăm sóc tâm lý', NULL, '2024-03-19 10:00:00.000', NULL, N'Tâm lý', N'1', N'nurse3'),
(5, N'Thói Quen Ngủ Lành Mạnh', N'Ngủ đủ giấc rất quan trọng cho sự phát triển của trẻ em. Học sinh cần ngủ 8-10 tiếng mỗi đêm để có sức khỏe tốt.', N'Tầm quan trọng của giấc ngủ', NULL, '2024-03-19 11:00:00.000', NULL, N'Sức khỏe', N'1', N'nurse4'),
(6, N'Hướng Dẫn Dinh Dưỡng', N'Chế độ ăn uống cân bằng giúp trẻ em phát triển khỏe mạnh. Cần đảm bảo đủ protein, vitamin và khoáng chất.', N'Dinh dưỡng cho trẻ em', NULL, '2024-03-19 13:00:00.000', NULL, N'Dinh dưỡng', N'1', N'nurse5')
SET IDENTITY_INSERT [dbo].[Blog] OFF
GO

-- Dữ liệu Parent (mẫu)
SET IDENTITY_INSERT [dbo].[Parent] ON 
INSERT [dbo].[Parent] ([ParentID], [FirstName], [LastName], [Relationship], [Phone], [Email], [Address], [Occupation], [Password], [IsEmergencyContact], [IsMainContact], [IsActive]) VALUES 
(1, N'Nguyễn', N'Văn An', N'Father', N'0901234567', N'nguyenvanan@email.com', N'123 Đường ABC, Quận 1, TP.HCM', N'Kỹ sư', N'$2a$11$example_hash_parent1', 1, 1, 1),
(2, N'Trần', N'Thị Bình', N'Mother', N'0901234568', N'tranthibibh@email.com', N'456 Đường DEF, Quận 2, TP.HCM', N'Giáo viên', N'$2a$11$example_hash_parent2', 1, 1, 1),
(3, N'Lê', N'Văn Cường', N'Father', N'0901234569', N'levancuong@email.com', N'789 Đường GHI, Quận 3, TP.HCM', N'Bác sĩ', N'$2a$11$example_hash_parent3', 1, 1, 1)
SET IDENTITY_INSERT [dbo].[Parent] OFF
GO

-- Dữ liệu Student (mẫu)
SET IDENTITY_INSERT [dbo].[Student] ON 
INSERT [dbo].[Student] ([StudentID], [StudentCode], [FirstName], [LastName], [DateOfBirth], [Gender], [Address], [Password], [IsActive], [ClassID]) VALUES 
(1, N'STU001', N'Nguyễn', N'Minh An', '2018-05-15', N'Nam', N'123 Đường ABC, Quận 1, TP.HCM', N'$2a$11$example_hash_student1', 1, 1),
(2, N'STU002', N'Trần', N'Thị Bích', '2018-03-20', N'Nữ', N'456 Đường DEF, Quận 2, TP.HCM', N'$2a$11$example_hash_student2', 1, 1),
(3, N'STU003', N'Lê', N'Văn Cường', '2018-07-10', N'Nam', N'789 Đường GHI, Quận 3, TP.HCM', N'$2a$11$example_hash_student3', 1, 2),
(4, N'STU004', N'Phạm', N'Thị Dung', '2018-01-25', N'Nữ', N'321 Đường JKL, Quận 4, TP.HCM', N'$2a$11$example_hash_student4', 1, 2),
(5, N'STU005', N'Hoàng', N'Văn Em', '2018-09-12', N'Nam', N'654 Đường MNO, Quận 5, TP.HCM', N'$2a$11$example_hash_student5', 1, 3)
SET IDENTITY_INSERT [dbo].[Student] OFF
GO

-- Dữ liệu Student_Parent
SET IDENTITY_INSERT [dbo].[Student_Parent] ON 
INSERT [dbo].[Student_Parent] ([StudentParentID], [StudentCode], [ParentID]) VALUES 
(1, N'STU001', 1),
(2, N'STU002', 2),
(3, N'STU003', 3),
(4, N'STU004', 1),
(5, N'STU005', 2)
SET IDENTITY_INSERT [dbo].[Student_Parent] OFF
GO

-- Dữ liệu Health_Profile (mẫu)
SET IDENTITY_INSERT [dbo].[Health_Profile] ON 
INSERT [dbo].[Health_Profile] ([HealthProfileID], [StudentCode], [BloodType], [Height], [Weight], [HasAllergies], [AllergyDetails], [HasChronicDiseases], [ChronicDetails], [HasPreviousTreatment], [TreatmentDetails], [HasCompleteVaccinations], [VaccinationDetails], [Vaccinations], [HasVisionIssues], [LeftEye], [RightEye], [VisionNotes], [HasHearingIssues], [LeftEar], [RightEar], [HearingNotes], [EmergencyContact], [OtherInfo], [LastUpdated], [BloodPressure], [HeartRate]) VALUES 
(1, N'STU001', N'A+', 120.00, 25.00, 0, NULL, 0, NULL, 0, NULL, N'Yes', N'Đã tiêm chủng đầy đủ', N'BCG, Polio, MMR, DPT', 0, N'20/20', N'20/20', NULL, 0, N'Bình thường', N'Bình thường', NULL, N'Nguyễn Văn An - 0901234567', NULL, '2025-06-18 14:38:08.077', N'110/70', 80),
(2, N'STU002', N'B+', 118.00, 23.00, 1, N'Dị ứng đậu phộng', 0, NULL, 0, NULL, N'Yes', N'Đã tiêm chủng đầy đủ', N'BCG, Polio, MMR, DPT', 0, N'20/20', N'20/20', NULL, 0, N'Bình thường', N'Bình thường', NULL, N'Trần Thị Bình - 0901234568', NULL, '2025-06-18 14:38:08.077', N'108/68', 82),
(3, N'STU003', N'O+', 122.00, 27.00, 0, NULL, 1, N'Hen suyễn nhẹ', 1, N'Sử dụng thuốc xịt', N'Yes', N'Đã tiêm chủng đầy đủ', N'BCG, Polio, MMR, DPT', 0, N'20/20', N'20/20', NULL, 0, N'Bình thường', N'Bình thường', NULL, N'Lê Văn Cường - 0901234569', NULL, '2025-06-18 14:38:08.077', N'112/72', 78),
(4, N'STU004', N'AB+', 119.00, 24.00, 1, N'Dị ứng hải sản', 0, NULL, 0, NULL, N'Yes', N'Đã tiêm chủng đầy đủ', N'BCG, Polio, MMR, DPT', 0, N'20/20', N'20/20', NULL, 0, N'Bình thường', N'Bình thường', NULL, N'Nguyễn Văn An - 0901234567', NULL, '2025-06-18 14:38:08.077', N'109/69', 81),
(5, N'STU005', N'A-', 121.00, 26.00, 0, NULL, 0, NULL, 0, NULL, N'Yes', N'Đã tiêm chủng đầy đủ', N'BCG, Polio, MMR, DPT', 0, N'20/20', N'20/20', NULL, 0, N'Bình thường', N'Bình thường', NULL, N'Trần Thị Bình - 0901234568', NULL, '2025-06-18 14:38:08.077', N'111/71', 79)
SET IDENTITY_INSERT [dbo].[Health_Profile] OFF
GO

PRINT N'✅ Database Medical đã được tạo thành công với đầy đủ cấu trúc và dữ liệu mẫu!'
PRINT N'📊 Tổng số bảng: 25 bảng'
PRINT N'👥 Dữ liệu mẫu: Role, Staff, Class, Student, Parent, Medicine, Vaccine, Medical_Supply, Blog, Health_Profile và các bảng liên quan'
PRINT N'🔗 Tất cả ràng buộc khóa ngoại đã được thiết lập'
PRINT N'🎯 Hệ thống quản lý y tế trường học sẵn sàng sử dụng!' 