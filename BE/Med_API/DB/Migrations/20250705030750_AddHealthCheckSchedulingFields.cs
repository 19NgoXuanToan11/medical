using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DB.Migrations
{
    /// <inheritdoc />
    public partial class AddHealthCheckSchedulingFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AutoAdvance",
                table: "Health_Check_Form",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Health_Check_Form",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EstimatedDuration",
                table: "Health_Check_Form",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EstimatedEndTime",
                table: "Health_Check_Form",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "GenerateReport",
                table: "Health_Check_Form",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GradeIds",
                table: "Health_Check_Form",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "Health_Check_Form",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NotifyParents",
                table: "Health_Check_Form",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RequireParentConfirmation",
                table: "Health_Check_Form",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "SaveResults",
                table: "Health_Check_Form",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ScheduledDate",
                table: "Health_Check_Form",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SelectedStations",
                table: "Health_Check_Form",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StaffAssigned",
                table: "Health_Check_Form",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<TimeSpan>(
                name: "StartTime",
                table: "Health_Check_Form",
                type: "time",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Health_Check_Form",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Health_Check_Form",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TotalStudents",
                table: "Health_Check_Form",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AutoAdvance",
                table: "Health_Check_Form");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Health_Check_Form");

            migrationBuilder.DropColumn(
                name: "EstimatedDuration",
                table: "Health_Check_Form");

            migrationBuilder.DropColumn(
                name: "EstimatedEndTime",
                table: "Health_Check_Form");

            migrationBuilder.DropColumn(
                name: "GenerateReport",
                table: "Health_Check_Form");

            migrationBuilder.DropColumn(
                name: "GradeIds",
                table: "Health_Check_Form");

            migrationBuilder.DropColumn(
                name: "Location",
                table: "Health_Check_Form");

            migrationBuilder.DropColumn(
                name: "NotifyParents",
                table: "Health_Check_Form");

            migrationBuilder.DropColumn(
                name: "RequireParentConfirmation",
                table: "Health_Check_Form");

            migrationBuilder.DropColumn(
                name: "SaveResults",
                table: "Health_Check_Form");

            migrationBuilder.DropColumn(
                name: "ScheduledDate",
                table: "Health_Check_Form");

            migrationBuilder.DropColumn(
                name: "SelectedStations",
                table: "Health_Check_Form");

            migrationBuilder.DropColumn(
                name: "StaffAssigned",
                table: "Health_Check_Form");

            migrationBuilder.DropColumn(
                name: "StartTime",
                table: "Health_Check_Form");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Health_Check_Form");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "Health_Check_Form");

            migrationBuilder.DropColumn(
                name: "TotalStudents",
                table: "Health_Check_Form");
        }
    }
}
