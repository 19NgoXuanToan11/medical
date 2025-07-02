using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DB.Migrations
{
    /// <inheritdoc />
    public partial class ExtendMedicineForVaccineSupport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AdministrationMethod",
                table: "Medicine",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BatchNumber",
                table: "Medicine",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Dose",
                table: "Medicine",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ExpiryDate",
                table: "Medicine",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Manufacturer",
                table: "Medicine",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Medicine",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdministrationMethod",
                table: "Medicine");

            migrationBuilder.DropColumn(
                name: "BatchNumber",
                table: "Medicine");

            migrationBuilder.DropColumn(
                name: "Dose",
                table: "Medicine");

            migrationBuilder.DropColumn(
                name: "ExpiryDate",
                table: "Medicine");

            migrationBuilder.DropColumn(
                name: "Manufacturer",
                table: "Medicine");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Medicine");
        }
    }
}
