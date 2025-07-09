using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DB.Migrations
{
    /// <inheritdoc />
    public partial class AddClassEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HealthCheckItemMedicalSupply");

            migrationBuilder.DropTable(
                name: "HealthCheckItem");

            migrationBuilder.DropColumn(
                name: "ClassName",
                table: "Student");

            migrationBuilder.DropColumn(
                name: "HasSupplyShortage",
                table: "Health_Check_Form");

            migrationBuilder.DropColumn(
                name: "RequiredSupplies",
                table: "Health_Check_Form");

            migrationBuilder.DropColumn(
                name: "SupplyWarnings",
                table: "Health_Check_Form");

            migrationBuilder.AddColumn<int>(
                name: "ClassID",
                table: "Student",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Class",
                columns: table => new
                {
                    ClassID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClassName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    GradeLevel = table.Column<int>(type: "int", nullable: false),
                    Section = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    MaxStudents = table.Column<int>(type: "int", nullable: true),
                    CurrentStudentCount = table.Column<int>(type: "int", nullable: true),
                    ClassTeacher = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ClassRoom = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Class__CB1927C0123456789", x => x.ClassID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Student_ClassID",
                table: "Student",
                column: "ClassID");

            migrationBuilder.CreateIndex(
                name: "UQ__Class__Name_Grade_Section",
                table: "Class",
                columns: new[] { "ClassName", "GradeLevel", "Section" },
                unique: true,
                filter: "[Section] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK__Student__ClassID",
                table: "Student",
                column: "ClassID",
                principalTable: "Class",
                principalColumn: "ClassID",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__Student__ClassID",
                table: "Student");

            migrationBuilder.DropTable(
                name: "Class");

            migrationBuilder.DropIndex(
                name: "IX_Student_ClassID",
                table: "Student");

            migrationBuilder.DropColumn(
                name: "ClassID",
                table: "Student");

            migrationBuilder.AddColumn<string>(
                name: "ClassName",
                table: "Student",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HasSupplyShortage",
                table: "Health_Check_Form",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RequiredSupplies",
                table: "Health_Check_Form",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SupplyWarnings",
                table: "Health_Check_Form",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "HealthCheckItem",
                columns: table => new
                {
                    ItemID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Category = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Code = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    EstimatedTimeMinutes = table.Column<int>(type: "int", nullable: false, defaultValue: 10),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HealthCheckItem", x => x.ItemID);
                });

            migrationBuilder.CreateTable(
                name: "HealthCheckItemMedicalSupply",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HealthCheckItemID = table.Column<int>(type: "int", nullable: false),
                    MedicalSupplyID = table.Column<int>(type: "int", nullable: false),
                    IsOptional = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    QuantityRequired = table.Column<decimal>(type: "decimal(10,2)", nullable: false, defaultValue: 1m)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HealthCheckItemMedicalSupply", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HealthCheckItemMedicalSupply_HealthCheckItem",
                        column: x => x.HealthCheckItemID,
                        principalTable: "HealthCheckItem",
                        principalColumn: "ItemID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HealthCheckItemMedicalSupply_MedicalSupply",
                        column: x => x.MedicalSupplyID,
                        principalTable: "Medical_Supply",
                        principalColumn: "SupplyID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HealthCheckItem_Code",
                table: "HealthCheckItem",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_HealthCheckItemMedicalSupply_HealthCheckItemID",
                table: "HealthCheckItemMedicalSupply",
                column: "HealthCheckItemID");

            migrationBuilder.CreateIndex(
                name: "IX_HealthCheckItemMedicalSupply_MedicalSupplyID",
                table: "HealthCheckItemMedicalSupply",
                column: "MedicalSupplyID");
        }
    }
}
