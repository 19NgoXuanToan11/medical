using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DB.Migrations
{
    /// <inheritdoc />
    public partial class DropIsConsumableColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Remove IsConsumable column from Medical_Supply table if it exists
            migrationBuilder.Sql(@"
                IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
                          WHERE TABLE_NAME = 'Medical_Supply' AND COLUMN_NAME = 'IsConsumable')
                BEGIN
                    ALTER TABLE Medical_Supply DROP COLUMN IsConsumable
                END
            ");

            // Remove IsConsumable column from HealthCheckItem table if it exists
            migrationBuilder.Sql(@"
                IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
                          WHERE TABLE_NAME = 'HealthCheckItem' AND COLUMN_NAME = 'IsConsumable')
                BEGIN
                    ALTER TABLE HealthCheckItem DROP COLUMN IsConsumable
                END
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Add back IsConsumable column to Medical_Supply table
            migrationBuilder.AddColumn<bool>(
                name: "IsConsumable",
                table: "Medical_Supply",
                type: "bit",
                nullable: true,
                defaultValue: false);

            // Add back IsConsumable column to HealthCheckItem table
            migrationBuilder.AddColumn<bool>(
                name: "IsConsumable",
                table: "HealthCheckItem",
                type: "bit",
                nullable: true,
                defaultValue: false);
        }
    }
}
