using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DB.Migrations
{
    /// <inheritdoc />
    public partial class AddClassStudentHealthProfileJsonToInjectionForm : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ClassListJson",
                table: "Injection_Form",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StudentHealthProfilesJson",
                table: "Injection_Form",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StudentListJson",
                table: "Injection_Form",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClassListJson",
                table: "Injection_Form");

            migrationBuilder.DropColumn(
                name: "StudentHealthProfilesJson",
                table: "Injection_Form");

            migrationBuilder.DropColumn(
                name: "StudentListJson",
                table: "Injection_Form");
        }
    }
}
