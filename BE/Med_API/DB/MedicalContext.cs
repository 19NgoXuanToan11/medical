using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace DB;

public partial class MedicalContext : DbContext
{
    public MedicalContext()
    {
    }

    public MedicalContext(DbContextOptions<MedicalContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Appointment> Appointments { get; set; }

    public virtual DbSet<DashboardSummary> DashboardSummaries { get; set; }

    public virtual DbSet<HealthCheckForm> HealthCheckForms { get; set; }

    public virtual DbSet<HealthCheckResult> HealthCheckResults { get; set; }

    public virtual DbSet<HealthEvent> HealthEvents { get; set; }

    public virtual DbSet<HealthEventMedicine> HealthEventMedicines { get; set; }

    public virtual DbSet<HealthEventMedicalSupply> HealthEventMedicalSupplies { get; set; }

    public virtual DbSet<HealthProfile> HealthProfiles { get; set; }

    public virtual DbSet<InjectionForm> InjectionForms { get; set; }

    public virtual DbSet<InjectionResult> InjectionResults { get; set; }

    public virtual DbSet<MedicalSupply> MedicalSupplies { get; set; }

    public virtual DbSet<Medicine> Medicines { get; set; }

    public virtual DbSet<MedicineRequest> MedicineRequests { get; set; }

    public virtual DbSet<MedicineRequestItem> MedicineRequestItems { get; set; }

    public virtual DbSet<Parent> Parents { get; set; }

    public virtual DbSet<RequestResult> RequestResults { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Staff> Staff { get; set; }

    public virtual DbSet<Student> Students { get; set; }

    public virtual DbSet<StudentParent> StudentParents { get; set; }

    public virtual DbSet<Blog> Blogs { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=(local);Database=Medical;User Id=sa;Password=123456;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.HasKey(e => e.AppointmentId).HasName("PK__Appointm__8ECDFCA24A1FE88D");

            entity.ToTable("Appointment");

            entity.Property(e => e.AppointmentId).HasColumnName("AppointmentID");
            entity.Property(e => e.AppointmentDate).HasColumnType("datetime");
            entity.Property(e => e.AppointmentType)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Notes).HasMaxLength(500);
            entity.Property(e => e.ParentId).HasColumnName("ParentID");
            entity.Property(e => e.Reason).HasMaxLength(255);
            entity.Property(e => e.StaffId).HasColumnName("StaffID");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("Scheduled");
            entity.Property(e => e.StudentId).HasColumnName("StudentID");
        });

        modelBuilder.Entity<DashboardSummary>(entity =>
        {
            entity.HasKey(e => e.SummaryId).HasName("PK__Dashboar__DAB10E0FE883130D");

            entity.ToTable("Dashboard_Summary");

            entity.Property(e => e.SummaryId).HasColumnName("SummaryID");
            entity.Property(e => e.AppointmentId).HasColumnName("AppointmentID");
            entity.Property(e => e.CompletedAppointments).HasDefaultValue(0);
            entity.Property(e => e.GeneratedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.HealthCheckFormId).HasColumnName("HealthCheckFormID");
            entity.Property(e => e.HealthCheckParticipationRate)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(5, 2)");
            entity.Property(e => e.HealthEventId).HasColumnName("HealthEventID");
            entity.Property(e => e.InjectionFormId).HasColumnName("InjectionFormID");
            entity.Property(e => e.InjectionParticipationRate)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(5, 2)");
            entity.Property(e => e.MedicineId).HasColumnName("MedicineID");
            entity.Property(e => e.MedicineRequestId).HasColumnName("MedicineRequestID");
            entity.Property(e => e.ScheduledAppointments).HasDefaultValue(0);
            entity.Property(e => e.StaffId).HasColumnName("StaffID");
            entity.Property(e => e.SupplyId).HasColumnName("SupplyID");
            entity.Property(e => e.TotalAppointments).HasDefaultValue(0);
            entity.Property(e => e.TotalHealthCheckNonParticipants).HasDefaultValue(0);
            entity.Property(e => e.TotalHealthCheckParticipants).HasDefaultValue(0);
            entity.Property(e => e.TotalHealthEvents).HasDefaultValue(0);
            entity.Property(e => e.TotalInjectionNonParticipants).HasDefaultValue(0);
            entity.Property(e => e.TotalInjectionParticipants).HasDefaultValue(0);
            entity.Property(e => e.TotalMedicineItems).HasDefaultValue(0);
            entity.Property(e => e.TotalMedicineRequests).HasDefaultValue(0);
            entity.Property(e => e.TotalSupplyItems).HasDefaultValue(0);

            entity.HasOne(d => d.Staff)
                .WithMany()
                .HasForeignKey(d => d.StaffId)
                .HasConstraintName("FK__Dashboard_Summary__StaffID");
        });

        modelBuilder.Entity<HealthCheckForm>(entity =>
        {
            entity.HasKey(e => e.FormId).HasName("PK__Health_C__FB05B7BD3533D90A");

            entity.ToTable("Health_Check_Form");

            entity.Property(e => e.FormId).HasColumnName("FormID");
            entity.Property(e => e.ClassName).HasMaxLength(50);
            entity.Property(e => e.ConfirmStatus)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.ConfirmedDate).HasColumnType("datetime");
            entity.Property(e => e.ConsentDate).HasColumnType("datetime");
            entity.Property(e => e.ConsentStatus)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("Pending");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ParentId).HasColumnName("ParentID");
            entity.Property(e => e.StudentId).HasColumnName("StudentID");

            entity.HasOne(d => d.Student)
                .WithMany()
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("FK__Health_Check_Form__StudentID");

            entity.HasOne(d => d.Parent)
                .WithMany()
                .HasForeignKey(d => d.ParentId)
                .HasConstraintName("FK__Health_Check_Form__ParentID");

            entity.HasOne(d => d.ConfirmedByStaff)
                .WithMany()
                .HasForeignKey(d => d.ConfirmedBy)
                .HasConstraintName("FK__Health_Check_Form__ConfirmedBy");
        });

        modelBuilder.Entity<HealthCheckResult>(entity =>
        {
            entity.HasKey(e => e.ResultId).HasName("PK__Health_C__97690228CF51D4A0");

            entity.ToTable("Health_Check_Result");

            entity.Property(e => e.ResultId).HasColumnName("ResultID");
            entity.Property(e => e.BloodPressure).HasMaxLength(20);
            entity.Property(e => e.ExaminedDate).HasColumnType("datetime");
            entity.Property(e => e.FormId).HasColumnName("FormID");
            entity.Property(e => e.GeneralFindings).HasMaxLength(1000);
            entity.Property(e => e.HearingStatus).HasMaxLength(50);
            entity.Property(e => e.Height).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.Recommendations).HasMaxLength(1000);
            entity.Property(e => e.StudentId).HasColumnName("StudentID");
            entity.Property(e => e.VisionLeft).HasMaxLength(20);
            entity.Property(e => e.VisionRight).HasMaxLength(20);
            entity.Property(e => e.Weight).HasColumnType("decimal(5, 2)");

            entity.HasOne(d => d.Form)
                .WithMany(p => p.Results)
                .HasForeignKey(d => d.FormId)
                .HasConstraintName("FK__Health_Check_Result__FormID");

            entity.HasOne(d => d.Student)
                .WithMany()
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("FK__Health_Check_Result__StudentID");

            entity.HasOne(d => d.ExaminedByStaff)
                .WithMany()
                .HasForeignKey(d => d.ExaminedBy)
                .HasConstraintName("FK__Health_Check_Result__ExaminedBy");
        });

        modelBuilder.Entity<HealthEvent>(entity =>
        {
            entity.HasKey(e => e.EventId).HasName("PK__Health_E__7944C870BB836071");

            entity.ToTable("Health_Event");

            entity.Property(e => e.EventId).HasColumnName("EventID");
            entity.Property(e => e.Assessment).HasMaxLength(1000);
            entity.Property(e => e.EventDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.EventType)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.FollowUpRequired).HasDefaultValue(false);
            entity.Property(e => e.Notes).HasMaxLength(500);
            entity.Property(e => e.ParentNotified).HasDefaultValue(false);
            entity.Property(e => e.StaffId).HasColumnName("StaffID");
            entity.Property(e => e.StudentCode)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Symptoms).HasMaxLength(500);
            entity.Property(e => e.Treatment).HasMaxLength(1000);

            entity.HasOne(d => d.Staff)
                .WithMany(p => p.HealthEvents)
                .HasForeignKey(d => d.StaffId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK__Health_Event__StaffID");

            entity.HasOne(d => d.Student)
                .WithMany(p => p.HealthEvents)
                .HasForeignKey(d => d.StudentCode)
                .HasPrincipalKey(p => p.StudentCode)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK__Health_Event__StudentCode");
        });

        modelBuilder.Entity<HealthEventMedicine>(entity =>
        {
            entity.HasKey(e => e.HealthEventMedicineId);

            entity.ToTable("Health_Event_Medicine");

            entity.Property(e => e.HealthEventMedicineId).HasColumnName("HealthEventMedicineID");
            entity.Property(e => e.HealthEventId).HasColumnName("HealthEventID");
            entity.Property(e => e.MedicineId).HasColumnName("MedicineID");
            entity.Property(e => e.Dosage).HasMaxLength(100);
            entity.Property(e => e.Time).HasMaxLength(50);

            entity.HasOne(d => d.HealthEvent)
                .WithMany(p => p.HealthEventMedicines)
                .HasForeignKey(d => d.HealthEventId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Health_Event_Medicine__HealthEventID");

            entity.HasOne(d => d.Medicine)
                .WithMany()
                .HasForeignKey(d => d.MedicineId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK__Health_Event_Medicine__MedicineID");
        });

        modelBuilder.Entity<HealthEventMedicalSupply>(entity =>
        {
            entity.HasKey(e => e.HealthEventMedicalSupplyId);

            entity.ToTable("Health_Event_Medical_Supply");

            entity.Property(e => e.HealthEventMedicalSupplyId).HasColumnName("HealthEventMedicalSupplyID");
            entity.Property(e => e.HealthEventId).HasColumnName("HealthEventID");
            entity.Property(e => e.MedicalSupplyId).HasColumnName("MedicalSupplyID");
            entity.Property(e => e.Quantity).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.Time).HasMaxLength(50);

            entity.HasOne(d => d.HealthEvent)
                .WithMany(p => p.HealthEventMedicalSupplies)
                .HasForeignKey(d => d.HealthEventId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Health_Event_Medical_Supply__HealthEventID");

            entity.HasOne(d => d.MedicalSupply)
                .WithMany()
                .HasForeignKey(d => d.MedicalSupplyId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK__Health_Event_Medical_Supply__MedicalSupplyID");
        });

        modelBuilder.Entity<HealthProfile>(entity =>
        {
            entity.HasKey(e => e.HealthProfileId).HasName("PK__Health_P__73C2C2B5FF5B2341");

            entity.ToTable("Health_Profile");

            entity.Property(e => e.HealthProfileId).HasColumnName("HealthProfileID");
            entity.Property(e => e.AllergyDetails).HasMaxLength(1000);
            entity.Property(e => e.BloodType)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.ChronicDetails).HasMaxLength(1000);
            entity.Property(e => e.EmergencyContact).HasMaxLength(255);
            entity.Property(e => e.HasAllergies).HasDefaultValue(false);
            entity.Property(e => e.HasChronicDiseases).HasDefaultValue(false);
            entity.Property(e => e.HasCompleteVaccinations)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.HasHearingIssues).HasDefaultValue(false);
            entity.Property(e => e.HasPreviousTreatment).HasDefaultValue(false);
            entity.Property(e => e.HasVisionIssues).HasDefaultValue(false);
            entity.Property(e => e.HearingNotes).HasMaxLength(1000);
            entity.Property(e => e.Height).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.LastUpdated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.LeftEar).HasMaxLength(100);
            entity.Property(e => e.LeftEye).HasMaxLength(20);
            entity.Property(e => e.OtherInfo).HasMaxLength(1000);
            entity.Property(e => e.RightEar).HasMaxLength(100);
            entity.Property(e => e.RightEye).HasMaxLength(20);
            entity.Property(e => e.StudentCode)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.BloodPressure).HasMaxLength(20);
            entity.Property(e => e.HeartRate);
            entity.Property(e => e.TreatmentDetails).HasMaxLength(1000);
            entity.Property(e => e.VaccinationDetails).HasMaxLength(1000);
            entity.Property(e => e.Vaccinations).HasMaxLength(1000);
            entity.Property(e => e.VisionNotes).HasMaxLength(1000);
            entity.Property(e => e.Weight).HasColumnType("decimal(5, 2)");

            entity.HasOne(d => d.Student)
                .WithMany(p => p.HealthProfiles)
                .HasForeignKey(d => d.StudentCode)
                .HasPrincipalKey(p => p.StudentCode)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Health_Profile__StudentCode");
        });

        modelBuilder.Entity<InjectionForm>(entity =>
        {
            entity.HasKey(e => e.FormId).HasName("PK__Injectio__FB05B7BDEC6DF4D0");

            entity.ToTable("Injection_Form");

            entity.Property(e => e.FormId).HasColumnName("FormID");
            entity.Property(e => e.ClassName).HasMaxLength(50);
            entity.Property(e => e.ConfirmStatus)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.ConfirmedDate).HasColumnType("datetime");
            entity.Property(e => e.ConsentDate).HasColumnType("datetime");
            entity.Property(e => e.ConsentStatus)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("Pending");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.InjectionName).HasMaxLength(100);
            entity.Property(e => e.ParentId).HasColumnName("ParentID");
            entity.Property(e => e.StudentId).HasColumnName("StudentID");

            entity.HasOne(d => d.Student)
                .WithMany(p => p.InjectionForms)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("FK__Injection_Form__StudentID");

            entity.HasOne(d => d.Parent)
                .WithMany(p => p.InjectionForms)
                .HasForeignKey(d => d.ParentId)
                .HasConstraintName("FK__Injection_Form__ParentID");

            entity.HasOne(d => d.ConfirmedByStaff)
                .WithMany()
                .HasForeignKey(d => d.ConfirmedBy)
                .HasConstraintName("FK__Injection_Form__ConfirmedBy");
        });

        modelBuilder.Entity<InjectionResult>(entity =>
        {
            entity.HasKey(e => e.ResultId).HasName("PK__Injectio__9769022834983DA5");

            entity.ToTable("Injection_Result");

            entity.Property(e => e.ResultId).HasColumnName("ResultID");
            entity.Property(e => e.AdministeredDate).HasColumnType("datetime");
            entity.Property(e => e.FollowUpNotes).HasMaxLength(255);
            entity.Property(e => e.FormId).HasColumnName("FormID");
            entity.Property(e => e.ImmediateReaction).HasMaxLength(255);
            entity.Property(e => e.StudentId).HasColumnName("StudentID");

            entity.HasOne(d => d.Form)
                .WithMany(p => p.InjectionResults)
                .HasForeignKey(d => d.FormId)
                .HasConstraintName("FK__Injection_Result__FormID");

            entity.HasOne(d => d.Student)
                .WithMany(p => p.InjectionResults)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("FK__Injection_Result__StudentID");

            entity.HasOne(d => d.AdministeredByStaff)
                .WithMany()
                .HasForeignKey(d => d.AdministeredBy)
                .HasConstraintName("FK__Injection_Result__AdministeredBy");
        });

        modelBuilder.Entity<MedicalSupply>(entity =>
        {
            entity.HasKey(e => e.SupplyId).HasName("PK__Medical___7CDD6C8E0BF90B60");

            entity.ToTable("Medical_Supply");

            entity.Property(e => e.SupplyId).HasColumnName("SupplyID");
            entity.Property(e => e.Category)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.StockQuantity)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(10, 2)");
        });

        modelBuilder.Entity<Medicine>(entity =>
        {
            entity.HasKey(e => e.MedicineId).HasName("PK__Medicine__4F2128F091736C4F");

            entity.ToTable("Medicine");

            entity.Property(e => e.MedicineId).HasColumnName("MedicineID");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.StockQuantity)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(10, 2)");
        });

        modelBuilder.Entity<MedicineRequest>(entity =>
        {
            entity.HasKey(e => e.RequestId).HasName("PK__Medicine__33A8519AA6EED751");

            entity.ToTable("Medicine_Request");

            entity.Property(e => e.RequestId).HasColumnName("RequestID");
            entity.Property(e => e.RequestDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ParentId).HasColumnName("ParentID");
            entity.Property(e => e.StaffId).HasColumnName("StaffID");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("Pending");
            entity.Property(e => e.StudentCode)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.ClassName)
                .HasMaxLength(50);
            entity.Property(e => e.Date).HasColumnType("date");

            entity.HasOne(d => d.Student)
                .WithMany(p => p.MedicineRequests)
                .HasForeignKey(d => d.StudentCode)
                .HasPrincipalKey(p => p.StudentCode)
                .HasConstraintName("FK__Medicine_Request__StudentCode");

            entity.HasOne(d => d.Parent)
                .WithMany(p => p.MedicineRequests)
                .HasForeignKey(d => d.ParentId)
                .HasConstraintName("FK__Medicine_Request__ParentID");

            entity.HasOne(d => d.Staff)
                .WithMany(p => p.MedicineRequests)
                .HasForeignKey(d => d.StaffId)
                .HasConstraintName("FK__Medicine_Request__StaffID");
        });

        modelBuilder.Entity<MedicineRequestItem>(entity =>
        {
            entity.HasKey(e => e.MedicineRequestItemId);

            entity.ToTable("Medicine_Request_Item");

            entity.Property(e => e.MedicineRequestItemId).HasColumnName("MedicineRequestItemID");
            entity.Property(e => e.MedicineRequestId).HasColumnName("MedicineRequestID");
            entity.Property(e => e.MedicineName).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Dosage).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Frequency).HasMaxLength(100).IsRequired();
            entity.Property(e => e.TimeOfDay).HasMaxLength(100);
            entity.Property(e => e.Instructions).HasMaxLength(500);

            entity.HasOne(d => d.MedicineRequest)
                .WithMany(p => p.MedicineRequestItems)
                .HasForeignKey(d => d.MedicineRequestId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Medicine_Request_Item__MedicineRequestID");
        });

        modelBuilder.Entity<Parent>(entity =>
        {
            entity.HasKey(e => e.ParentId).HasName("PK__Parent__D339510FC35C248C");
            entity.ToTable("Parent");
            
            entity.Property(e => e.ParentId)
                .HasColumnName("ParentID")
                .UseIdentityColumn()
                .IsRequired();
            
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.IsEmergencyContact).HasDefaultValue(false);
            entity.Property(e => e.IsMainContact).HasDefaultValue(false);
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.Occupation).HasMaxLength(100);
            entity.Property(e => e.Password).HasMaxLength(255);
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.Relationship)
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        modelBuilder.Entity<StudentParent>(entity =>
        {
            entity.HasKey(e => e.StudentParentId);

            entity.ToTable("Student_Parent");

            entity.Property(e => e.StudentParentId).HasColumnName("StudentParentID");
            entity.Property(e => e.StudentCode)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.ParentId).HasColumnName("ParentID");

            entity.HasOne(d => d.Student)
                .WithMany(p => p.StudentParents)
                .HasForeignKey(d => d.StudentCode)
                .HasPrincipalKey(p => p.StudentCode)
                .OnDelete(DeleteBehavior.NoAction)
                .HasConstraintName("FK_StudentParent_Student");

            entity.HasOne(d => d.Parent)
                .WithMany(p => p.StudentParents)
                .HasForeignKey(d => d.ParentId)
                .OnDelete(DeleteBehavior.NoAction)
                .IsRequired()
                .HasConstraintName("FK_StudentParent_Parent");
        });

        modelBuilder.Entity<RequestResult>(entity =>
        {
            entity.HasKey(e => e.ResultId).HasName("PK__Request___97690228392A5FD6");

            entity.ToTable("Request_Result");

            entity.Property(e => e.ResultId).HasColumnName("ResultID");
            entity.Property(e => e.AdministeredTime).HasColumnType("datetime");
            entity.Property(e => e.RequestId).HasColumnName("RequestID");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.SubmittedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.AdministeredBy).HasColumnName("AdministeredBy");
            entity.Property(e => e.ActionBy).HasColumnName("ActionBy");

            entity.HasOne(d => d.Request)
                .WithMany(p => p.RequestResults)
                .HasForeignKey(d => d.RequestId)
                .HasConstraintName("FK__Request_Result__RequestID");

            entity.HasOne(d => d.AdministeredByStaff)
                .WithMany(p => p.AdministeredRequestResults)
                .HasForeignKey(d => d.AdministeredBy)
                .OnDelete(DeleteBehavior.NoAction)
                .HasConstraintName("FK__Request_Result__AdministeredBy");

            entity.HasOne(d => d.ActionByStaff)
                .WithMany(p => p.ActionedRequestResults)
                .HasForeignKey(d => d.ActionBy)
                .OnDelete(DeleteBehavior.NoAction)
                .HasConstraintName("FK__Request_Result__ActionBy");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__Role__8AFACE1A12345678");

            entity.ToTable("Role");

            entity.HasIndex(e => e.RoleName, "UQ__Role__8A2B616058FE1837").IsUnique();

            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.RoleName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Permissions).HasDefaultValueSql("0");
        });

        modelBuilder.Entity<Staff>(entity =>
        {
            entity.HasKey(e => e.StaffId).HasName("PK__Staff__96D4AAF731254C53");

            entity.HasIndex(e => e.Username, "UQ__Staff__536C85E4FC5C7093").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__Staff__A9D10534AFE18051").IsUnique();

            entity.Property(e => e.StaffId).HasColumnName("StaffID");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.PasswordHash).HasMaxLength(255);
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.IsActiveForRequest)
                .HasDefaultValue(true);
        });

        modelBuilder.Entity<Student>(entity =>
        {
            entity.HasKey(e => e.StudentId).HasName("PK__Student__32C52A7964894850");

            entity.ToTable("Student");

            entity.Property(e => e.StudentId).HasColumnName("StudentID");
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.ClassName).HasMaxLength(50);
            entity.Property(e => e.DateOfBirth).HasColumnType("date");
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.Gender).HasMaxLength(10);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.Password).HasMaxLength(255);
            entity.Property(e => e.StudentCode)
                .HasMaxLength(20)
                .IsUnicode(false);

            entity.HasIndex(e => e.StudentCode, "UQ__Student__1FC8860437093A19")
                .IsUnique();
        });

        modelBuilder.Entity<Blog>(entity =>
        {
            entity.HasKey(e => e.BlogId).HasName("PK__Blog__54379E30A73F0B1A");

            entity.ToTable("Blog");

            entity.Property(e => e.BlogId).HasColumnName("BlogID");
            entity.Property(e => e.Title).HasMaxLength(200);
            entity.Property(e => e.Content).HasMaxLength(4000);
            entity.Property(e => e.Summary).HasMaxLength(500);
            entity.Property(e => e.ImageUrl).HasMaxLength(255);
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.LastModifiedDate).HasColumnType("datetime");
            entity.Property(e => e.Category).HasMaxLength(50);
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("Draft");
            entity.Property(e => e.StaffUsername)
                .HasMaxLength(50)
                .IsUnicode(false)
                .IsRequired(false);

            entity.HasOne(d => d.Staff)
                .WithMany()
                .HasForeignKey(d => d.StaffUsername)
                .HasPrincipalKey(p => p.Username)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK__Blog__StaffUsername");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
