using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DB.Migrations
{
    /// <inheritdoc />
    public partial class AddFrequencyHandlingToRequestResult : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AdministeredFrequencies",
                table: "Request_Result",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "CurrentDate",
                table: "Request_Result",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CurrentDayCount",
                table: "Request_Result",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Frequency",
                table: "Request_Result",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TimesPerDay",
                table: "Request_Result",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdministeredFrequencies",
                table: "Request_Result");

            migrationBuilder.DropColumn(
                name: "CurrentDate",
                table: "Request_Result");

            migrationBuilder.DropColumn(
                name: "CurrentDayCount",
                table: "Request_Result");

            migrationBuilder.DropColumn(
                name: "Frequency",
                table: "Request_Result");

            migrationBuilder.DropColumn(
                name: "TimesPerDay",
                table: "Request_Result");
        }
    }
}
