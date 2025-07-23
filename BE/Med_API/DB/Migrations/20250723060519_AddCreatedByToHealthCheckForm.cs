using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DB.Migrations
{
    /// <inheritdoc />
    public partial class AddCreatedByToHealthCheckForm : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "Health_Check_Form",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByStaffStaffId",
                table: "Health_Check_Form",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Health_Check_Form_CreatedByStaffStaffId",
                table: "Health_Check_Form",
                column: "CreatedByStaffStaffId");

            migrationBuilder.AddForeignKey(
                name: "FK_Health_Check_Form_Staff_CreatedByStaffStaffId",
                table: "Health_Check_Form",
                column: "CreatedByStaffStaffId",
                principalTable: "Staff",
                principalColumn: "StaffID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Health_Check_Form_Staff_CreatedByStaffStaffId",
                table: "Health_Check_Form");

            migrationBuilder.DropIndex(
                name: "IX_Health_Check_Form_CreatedByStaffStaffId",
                table: "Health_Check_Form");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Health_Check_Form");

            migrationBuilder.DropColumn(
                name: "CreatedByStaffStaffId",
                table: "Health_Check_Form");
        }
    }
}
