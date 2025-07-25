using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DB.Migrations
{
    /// <inheritdoc />
    public partial class AddDetailFieldsToInjectionForm : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StudentListJson",
                table: "Injection_Form",
                newName: "StudentDetailsJson");

            migrationBuilder.RenameColumn(
                name: "StudentHealthProfilesJson",
                table: "Injection_Form",
                newName: "HealthProfilesJson");

            migrationBuilder.RenameColumn(
                name: "ClassListJson",
                table: "Injection_Form",
                newName: "ClassDetailsJson");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StudentDetailsJson",
                table: "Injection_Form",
                newName: "StudentListJson");

            migrationBuilder.RenameColumn(
                name: "HealthProfilesJson",
                table: "Injection_Form",
                newName: "StudentHealthProfilesJson");

            migrationBuilder.RenameColumn(
                name: "ClassDetailsJson",
                table: "Injection_Form",
                newName: "ClassListJson");
        }
    }
}
