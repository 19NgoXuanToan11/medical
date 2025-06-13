using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DB.Migrations
{
    /// <inheritdoc />
    public partial class ChangeBlogStaffIdToUsername : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__Blog__StaffID",
                table: "Blog");

            migrationBuilder.DropIndex(
                name: "IX_Blog_StaffId",
                table: "Blog");

            migrationBuilder.DropColumn(
                name: "StaffId",
                table: "Blog");

            migrationBuilder.AlterColumn<string>(
                name: "Username",
                table: "Staff",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AddColumn<string>(
                name: "StaffUsername",
                table: "Blog",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddUniqueConstraint(
                name: "AK_Staff_Username",
                table: "Staff",
                column: "Username");

            migrationBuilder.CreateIndex(
                name: "IX_Blog_StaffUsername",
                table: "Blog",
                column: "StaffUsername");

            migrationBuilder.AddForeignKey(
                name: "FK__Blog__StaffUsername",
                table: "Blog",
                column: "StaffUsername",
                principalTable: "Staff",
                principalColumn: "Username",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__Blog__StaffUsername",
                table: "Blog");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_Staff_Username",
                table: "Staff");

            migrationBuilder.DropIndex(
                name: "IX_Blog_StaffUsername",
                table: "Blog");

            migrationBuilder.DropColumn(
                name: "StaffUsername",
                table: "Blog");

            migrationBuilder.AlterColumn<string>(
                name: "Username",
                table: "Staff",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldUnicode: false,
                oldMaxLength: 50);

            migrationBuilder.AddColumn<int>(
                name: "StaffId",
                table: "Blog",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Blog_StaffId",
                table: "Blog",
                column: "StaffId");

            migrationBuilder.AddForeignKey(
                name: "FK__Blog__StaffID",
                table: "Blog",
                column: "StaffId",
                principalTable: "Staff",
                principalColumn: "StaffID");
        }
    }
}
