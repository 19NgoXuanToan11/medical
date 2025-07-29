using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DB.Migrations
{
    /// <inheritdoc />
    public partial class AddAdminProps : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AdministrationNotes",
                table: "Medicine_Request",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AdministrationStartedBy",
                table: "Medicine_Request",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "AdministrationStartedDate",
                table: "Medicine_Request",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdministrationNotes",
                table: "Medicine_Request");

            migrationBuilder.DropColumn(
                name: "AdministrationStartedBy",
                table: "Medicine_Request");

            migrationBuilder.DropColumn(
                name: "AdministrationStartedDate",
                table: "Medicine_Request");
        }
    }
}
