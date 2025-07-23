using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DB.Migrations
{
    /// <inheritdoc />
    public partial class AddVaccinationScheduleFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EstimatedDuration",
                table: "Injection_Form",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GradeIds",
                table: "Injection_Form",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "Injection_Form",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NotifyParents",
                table: "Injection_Form",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RequireParentConfirmation",
                table: "Injection_Form",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ScheduledDate",
                table: "Injection_Form",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<TimeSpan>(
                name: "StartTime",
                table: "Injection_Form",
                type: "time",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TotalStudents",
                table: "Injection_Form",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EstimatedDuration",
                table: "Injection_Form");

            migrationBuilder.DropColumn(
                name: "GradeIds",
                table: "Injection_Form");

            migrationBuilder.DropColumn(
                name: "Location",
                table: "Injection_Form");

            migrationBuilder.DropColumn(
                name: "NotifyParents",
                table: "Injection_Form");

            migrationBuilder.DropColumn(
                name: "RequireParentConfirmation",
                table: "Injection_Form");

            migrationBuilder.DropColumn(
                name: "ScheduledDate",
                table: "Injection_Form");

            migrationBuilder.DropColumn(
                name: "StartTime",
                table: "Injection_Form");

            migrationBuilder.DropColumn(
                name: "TotalStudents",
                table: "Injection_Form");
        }
    }
}
