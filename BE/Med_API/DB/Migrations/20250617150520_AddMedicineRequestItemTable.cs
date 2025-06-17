using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DB.Migrations
{
    /// <inheritdoc />
    public partial class AddMedicineRequestItemTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Dosage",
                table: "Medicine_Request");

            migrationBuilder.DropColumn(
                name: "Frequency",
                table: "Medicine_Request");

            migrationBuilder.DropColumn(
                name: "Instructions",
                table: "Medicine_Request");

            migrationBuilder.DropColumn(
                name: "MealRelation",
                table: "Medicine_Request");

            migrationBuilder.DropColumn(
                name: "MedicationImagePath",
                table: "Medicine_Request");

            migrationBuilder.DropColumn(
                name: "MedicineName",
                table: "Medicine_Request");

            migrationBuilder.DropColumn(
                name: "PrescriptionImagePath",
                table: "Medicine_Request");

            migrationBuilder.DropColumn(
                name: "TimeOfDay",
                table: "Medicine_Request");

            migrationBuilder.CreateTable(
                name: "Medicine_Request_Item",
                columns: table => new
                {
                    MedicineRequestItemID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MedicineRequestID = table.Column<int>(type: "int", nullable: false),
                    MedicineName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Dosage = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Frequency = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    TimeOfDay = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Instructions = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    MedicationImagePath = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    PrescriptionImagePath = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Medicine_Request_Item", x => x.MedicineRequestItemID);
                    table.ForeignKey(
                        name: "FK__Medicine_Request_Item__MedicineRequestID",
                        column: x => x.MedicineRequestID,
                        principalTable: "Medicine_Request",
                        principalColumn: "RequestID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Medicine_Request_Item_MedicineRequestID",
                table: "Medicine_Request_Item",
                column: "MedicineRequestID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Medicine_Request_Item");

            migrationBuilder.AddColumn<string>(
                name: "Dosage",
                table: "Medicine_Request",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Frequency",
                table: "Medicine_Request",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Instructions",
                table: "Medicine_Request",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MealRelation",
                table: "Medicine_Request",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MedicationImagePath",
                table: "Medicine_Request",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MedicineName",
                table: "Medicine_Request",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PrescriptionImagePath",
                table: "Medicine_Request",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TimeOfDay",
                table: "Medicine_Request",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);
        }
    }
}
