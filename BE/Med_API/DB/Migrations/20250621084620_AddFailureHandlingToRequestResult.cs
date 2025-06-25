using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DB.Migrations
{
    /// <inheritdoc />
    public partial class AddFailureHandlingToRequestResult : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FailedAttempts",
                table: "Request_Result",
                type: "int",
                nullable: true,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "FailedFrequencies",
                table: "Request_Result",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FailureReasons",
                table: "Request_Result",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsReRequest",
                table: "Request_Result",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastAttemptTime",
                table: "Request_Result",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "OriginalRequestResultID",
                table: "Request_Result",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReRequestReason",
                table: "Request_Result",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Request_Result_OriginalRequestResultID",
                table: "Request_Result",
                column: "OriginalRequestResultID");

            migrationBuilder.AddForeignKey(
                name: "FK__Request_Result__OriginalRequestResultID",
                table: "Request_Result",
                column: "OriginalRequestResultID",
                principalTable: "Request_Result",
                principalColumn: "ResultID",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__Request_Result__OriginalRequestResultID",
                table: "Request_Result");

            migrationBuilder.DropIndex(
                name: "IX_Request_Result_OriginalRequestResultID",
                table: "Request_Result");

            migrationBuilder.DropColumn(
                name: "FailedAttempts",
                table: "Request_Result");

            migrationBuilder.DropColumn(
                name: "FailedFrequencies",
                table: "Request_Result");

            migrationBuilder.DropColumn(
                name: "FailureReasons",
                table: "Request_Result");

            migrationBuilder.DropColumn(
                name: "IsReRequest",
                table: "Request_Result");

            migrationBuilder.DropColumn(
                name: "LastAttemptTime",
                table: "Request_Result");

            migrationBuilder.DropColumn(
                name: "OriginalRequestResultID",
                table: "Request_Result");

            migrationBuilder.DropColumn(
                name: "ReRequestReason",
                table: "Request_Result");
        }
    }
}
