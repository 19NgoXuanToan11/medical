using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DB.Migrations
{
    /// <inheritdoc />
    public partial class RemoveImagePathsFromMedicineRequestItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MedicationImagePath",
                table: "Medicine_Request_Item");

            migrationBuilder.DropColumn(
                name: "PrescriptionImagePath",
                table: "Medicine_Request_Item");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MedicationImagePath",
                table: "Medicine_Request_Item",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrescriptionImagePath",
                table: "Medicine_Request_Item",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);
        }
    }
}
