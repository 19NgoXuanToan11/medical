using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DB.Migrations
{
    /// <inheritdoc />
    public partial class AddHealthEventItems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MedicinesUsed",
                table: "Health_Event");

            migrationBuilder.DropColumn(
                name: "SuppliesUsed",
                table: "Health_Event");

            migrationBuilder.CreateTable(
                name: "Health_Event_Medical_Supply",
                columns: table => new
                {
                    HealthEventMedicalSupplyID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HealthEventID = table.Column<int>(type: "int", nullable: false),
                    MedicalSupplyID = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    Time = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Health_Event_Medical_Supply", x => x.HealthEventMedicalSupplyID);
                    table.ForeignKey(
                        name: "FK__Health_Event_Medical_Supply__HealthEventID",
                        column: x => x.HealthEventID,
                        principalTable: "Health_Event",
                        principalColumn: "EventID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK__Health_Event_Medical_Supply__MedicalSupplyID",
                        column: x => x.MedicalSupplyID,
                        principalTable: "Medical_Supply",
                        principalColumn: "SupplyID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Health_Event_Medicine",
                columns: table => new
                {
                    HealthEventMedicineID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HealthEventID = table.Column<int>(type: "int", nullable: false),
                    MedicineID = table.Column<int>(type: "int", nullable: false),
                    Dosage = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Time = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Health_Event_Medicine", x => x.HealthEventMedicineID);
                    table.ForeignKey(
                        name: "FK__Health_Event_Medicine__HealthEventID",
                        column: x => x.HealthEventID,
                        principalTable: "Health_Event",
                        principalColumn: "EventID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK__Health_Event_Medicine__MedicineID",
                        column: x => x.MedicineID,
                        principalTable: "Medicine",
                        principalColumn: "MedicineID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Health_Event_Medical_Supply_HealthEventID",
                table: "Health_Event_Medical_Supply",
                column: "HealthEventID");

            migrationBuilder.CreateIndex(
                name: "IX_Health_Event_Medical_Supply_MedicalSupplyID",
                table: "Health_Event_Medical_Supply",
                column: "MedicalSupplyID");

            migrationBuilder.CreateIndex(
                name: "IX_Health_Event_Medicine_HealthEventID",
                table: "Health_Event_Medicine",
                column: "HealthEventID");

            migrationBuilder.CreateIndex(
                name: "IX_Health_Event_Medicine_MedicineID",
                table: "Health_Event_Medicine",
                column: "MedicineID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Health_Event_Medical_Supply");

            migrationBuilder.DropTable(
                name: "Health_Event_Medicine");

            migrationBuilder.AddColumn<string>(
                name: "MedicinesUsed",
                table: "Health_Event",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SuppliesUsed",
                table: "Health_Event",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);
        }
    }
}
