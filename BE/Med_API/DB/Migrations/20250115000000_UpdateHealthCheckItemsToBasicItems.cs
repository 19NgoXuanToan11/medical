using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DB.Migrations
{
    /// <inheritdoc />
    public partial class UpdateHealthCheckItemsToBasicItems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Clear existing health check items
            migrationBuilder.Sql("DELETE FROM HealthCheckItemMedicalSupply");
            migrationBuilder.Sql("DELETE FROM HealthCheckItem");
            
            // Reset identity column
            migrationBuilder.Sql("DBCC CHECKIDENT ('HealthCheckItem', RESEED, 0)");
            
            // Insert 5 basic health check items
            migrationBuilder.Sql(@"
                INSERT INTO HealthCheckItem (Code, Name, Category, Description, EstimatedTimeMinutes, IsActive, CreatedDate) VALUES
                ('TAI', 'Khám tai', 'sensory', 'Kiểm tra thính lực và tình trạng tai', 5, 1, GETDATE()),
                ('MUI', 'Khám mũi', 'sensory', 'Kiểm tra hô hấp và tình trạng mũi', 5, 1, GETDATE()),
                ('HONG', 'Khám họng', 'sensory', 'Kiểm tra họng và amidan', 5, 1, GETDATE()),
                ('CAN_NANG', 'Cân nặng', 'physical', 'Đo cân nặng của học sinh', 3, 1, GETDATE()),
                ('CHIEU_CAO', 'Chiều cao', 'physical', 'Đo chiều cao của học sinh', 3, 1, GETDATE())
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Clear the basic items
            migrationBuilder.Sql("DELETE FROM HealthCheckItemMedicalSupply");
            migrationBuilder.Sql("DELETE FROM HealthCheckItem");
            
            // Reset identity column
            migrationBuilder.Sql("DBCC CHECKIDENT ('HealthCheckItem', RESEED, 0)");
            
            // Re-insert original items (if needed)
            migrationBuilder.Sql(@"
                INSERT INTO HealthCheckItem (Code, Name, Category, Description, EstimatedTimeMinutes, IsActive, CreatedDate) VALUES
                ('GENERAL', 'Khám tổng quát', 'general', 'Khám sức khỏe tổng quát', 10, 1, GETDATE()),
                ('HEIGHT_WEIGHT', 'Chiều cao & Cân nặng', 'physical', 'Đo chiều cao và cân nặng', 5, 1, GETDATE()),
                ('VISION', 'Thị lực', 'sensory', 'Kiểm tra thị lực', 8, 1, GETDATE()),
                ('HEARING', 'Thính lực', 'sensory', 'Kiểm tra thính lực', 8, 1, GETDATE()),
                ('DENTAL', 'Răng miệng', 'oral', 'Kiểm tra răng và nướu', 10, 1, GETDATE()),
                ('BLOOD_PRESSURE', 'Huyết áp', 'cardiovascular', 'Đo huyết áp', 5, 1, GETDATE()),
                ('HEART_RATE', 'Nhịp tim', 'cardiovascular', 'Đo nhịp tim', 5, 1, GETDATE()),
                ('LUNG_CAPACITY', 'Dung tích phổi', 'respiratory', 'Đo dung tích phổi', 8, 1, GETDATE()),
                ('SKIN', 'Da liễu', 'dermatological', 'Kiểm tra tình trạng da', 8, 1, GETDATE()),
                ('MENTAL_HEALTH', 'Tâm lý', 'psychological', 'Đánh giá tâm lý và hành vi học đường', 15, 1, GETDATE())
            ");
        }
    }
} 