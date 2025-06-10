using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DB.Migrations
{
    /// <inheritdoc />
    public partial class AddStudentParentTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__Parent__StudentI__6FE99F9F",
                table: "Parent");

            migrationBuilder.RenameColumn(
                name: "StudentID",
                table: "Parent",
                newName: "StudentId");

            migrationBuilder.RenameIndex(
                name: "IX_Parent_StudentID",
                table: "Parent",
                newName: "IX_Parent_StudentId");

            migrationBuilder.CreateTable(
                name: "Student_Parent",
                columns: table => new
                {
                    StudentParentID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentID = table.Column<int>(type: "int", nullable: false),
                    ParentID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Student_Parent", x => x.StudentParentID);
                    table.ForeignKey(
                        name: "FK_StudentParent_Parent",
                        column: x => x.ParentID,
                        principalTable: "Parent",
                        principalColumn: "ParentID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StudentParent_Student",
                        column: x => x.StudentID,
                        principalTable: "Student",
                        principalColumn: "StudentID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Student_Parent_ParentID",
                table: "Student_Parent",
                column: "ParentID");

            migrationBuilder.CreateIndex(
                name: "IX_Student_Parent_StudentID",
                table: "Student_Parent",
                column: "StudentID");

            migrationBuilder.AddForeignKey(
                name: "FK_Parent_Student_StudentId",
                table: "Parent",
                column: "StudentId",
                principalTable: "Student",
                principalColumn: "StudentID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Parent_Student_StudentId",
                table: "Parent");

            migrationBuilder.DropTable(
                name: "Student_Parent");

            migrationBuilder.RenameColumn(
                name: "StudentId",
                table: "Parent",
                newName: "StudentID");

            migrationBuilder.RenameIndex(
                name: "IX_Parent_StudentId",
                table: "Parent",
                newName: "IX_Parent_StudentID");

            migrationBuilder.AddForeignKey(
                name: "FK__Parent__StudentI__6FE99F9F",
                table: "Parent",
                column: "StudentID",
                principalTable: "Student",
                principalColumn: "StudentID");
        }
    }
}
