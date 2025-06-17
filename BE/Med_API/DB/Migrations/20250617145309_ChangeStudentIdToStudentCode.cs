using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DB.Migrations
{
    /// <inheritdoc />
    public partial class ChangeStudentIdToStudentCode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__Health_Event__StudentID",
                table: "Health_Event");

            migrationBuilder.DropForeignKey(
                name: "FK__Medicine_Request__StudentID",
                table: "Medicine_Request");

            migrationBuilder.DropIndex(
                name: "IX_Medicine_Request_StudentID",
                table: "Medicine_Request");

            migrationBuilder.DropIndex(
                name: "IX_Health_Event_StudentID",
                table: "Health_Event");

            migrationBuilder.DropColumn(
                name: "StudentID",
                table: "Medicine_Request");

            migrationBuilder.DropColumn(
                name: "StudentID",
                table: "Health_Event");

            migrationBuilder.AddColumn<string>(
                name: "StudentCode",
                table: "Medicine_Request",
                type: "varchar(20)",
                unicode: false,
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StudentCode",
                table: "Health_Event",
                type: "varchar(20)",
                unicode: false,
                maxLength: 20,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Medicine_Request_StudentCode",
                table: "Medicine_Request",
                column: "StudentCode");

            migrationBuilder.CreateIndex(
                name: "IX_Health_Event_StudentCode",
                table: "Health_Event",
                column: "StudentCode");

            migrationBuilder.AddForeignKey(
                name: "FK__Health_Event__StudentCode",
                table: "Health_Event",
                column: "StudentCode",
                principalTable: "Student",
                principalColumn: "StudentCode",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK__Medicine_Request__StudentCode",
                table: "Medicine_Request",
                column: "StudentCode",
                principalTable: "Student",
                principalColumn: "StudentCode");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__Health_Event__StudentCode",
                table: "Health_Event");

            migrationBuilder.DropForeignKey(
                name: "FK__Medicine_Request__StudentCode",
                table: "Medicine_Request");

            migrationBuilder.DropIndex(
                name: "IX_Medicine_Request_StudentCode",
                table: "Medicine_Request");

            migrationBuilder.DropIndex(
                name: "IX_Health_Event_StudentCode",
                table: "Health_Event");

            migrationBuilder.DropColumn(
                name: "StudentCode",
                table: "Medicine_Request");

            migrationBuilder.DropColumn(
                name: "StudentCode",
                table: "Health_Event");

            migrationBuilder.AddColumn<int>(
                name: "StudentID",
                table: "Medicine_Request",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "StudentID",
                table: "Health_Event",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Medicine_Request_StudentID",
                table: "Medicine_Request",
                column: "StudentID");

            migrationBuilder.CreateIndex(
                name: "IX_Health_Event_StudentID",
                table: "Health_Event",
                column: "StudentID");

            migrationBuilder.AddForeignKey(
                name: "FK__Health_Event__StudentID",
                table: "Health_Event",
                column: "StudentID",
                principalTable: "Student",
                principalColumn: "StudentID",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK__Medicine_Request__StudentID",
                table: "Medicine_Request",
                column: "StudentID",
                principalTable: "Student",
                principalColumn: "StudentID");
        }
    }
}
