using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DB.Migrations
{
    /// <inheritdoc />
    public partial class AddNotificationTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Notification",
                columns: table => new
                {
                    NotificationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Message = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    ParentID = table.Column<int>(type: "int", nullable: true),
                    StudentCode = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    StaffID = table.Column<int>(type: "int", nullable: true),
                    HealthEventID = table.Column<int>(type: "int", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "sent"),
                    Priority = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "medium"),
                    IsRead = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ReadAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    AdditionalData = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Notification__20CF2E32", x => x.NotificationID);
                    table.ForeignKey(
                        name: "FK__Notification__HealthEventID",
                        column: x => x.HealthEventID,
                        principalTable: "Health_Event",
                        principalColumn: "EventID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK__Notification__ParentID",
                        column: x => x.ParentID,
                        principalTable: "Parent",
                        principalColumn: "ParentID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK__Notification__StaffID",
                        column: x => x.StaffID,
                        principalTable: "Staff",
                        principalColumn: "StaffID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK__Notification__StudentCode",
                        column: x => x.StudentCode,
                        principalTable: "Student",
                        principalColumn: "StudentCode",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Notification_HealthEventID",
                table: "Notification",
                column: "HealthEventID");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_ParentID",
                table: "Notification",
                column: "ParentID");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_StaffID",
                table: "Notification",
                column: "StaffID");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_StudentCode",
                table: "Notification",
                column: "StudentCode");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Notification");
        }
    }
}
