using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DB.Migrations
{
    /// <inheritdoc />
    public partial class AddHealthCheckItemAndMedicalSupplyRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HealthCheckItem",
                columns: table => new
                {
                    ItemID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Category = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    EstimatedTimeMinutes = table.Column<int>(type: "int", nullable: false, defaultValue: 10),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
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
                    QuantityRequired = table.Column<decimal>(type: "decimal(10,2)", nullable: false, defaultValue: 1m),
                    IsOptional = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HealthCheckItemMedicalSupply");

            migrationBuilder.DropTable(
                name: "HealthCheckItem");
        }
    }
}
