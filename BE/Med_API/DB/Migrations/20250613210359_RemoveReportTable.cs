using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DB.Migrations
{
    /// <inheritdoc />
    public partial class RemoveReportTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Report");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Report",
                columns: table => new
                {
                    ReportID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BasedOnDashboardID = table.Column<int>(type: "int", nullable: true),
                    GeneratedBy = table.Column<int>(type: "int", nullable: true),
                    AppointmentData = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateRange_End = table.Column<DateOnly>(type: "date", nullable: true),
                    DateRange_Start = table.Column<DateOnly>(type: "date", nullable: true),
                    GeneratedDate = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    HealthCheckData = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HealthEventData = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InjectionData = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InventoryData = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NonParticipantData = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReportName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ReportType = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Report__D5BD48E573B45ED0", x => x.ReportID);
                    table.ForeignKey(
                        name: "FK__Report__BasedOnDashboardID",
                        column: x => x.BasedOnDashboardID,
                        principalTable: "Dashboard_Summary",
                        principalColumn: "SummaryID");
                    table.ForeignKey(
                        name: "FK__Report__GeneratedBy",
                        column: x => x.GeneratedBy,
                        principalTable: "Staff",
                        principalColumn: "StaffID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Report_BasedOnDashboardID",
                table: "Report",
                column: "BasedOnDashboardID");

            migrationBuilder.CreateIndex(
                name: "IX_Report_GeneratedBy",
                table: "Report",
                column: "GeneratedBy");
        }
    }
}
