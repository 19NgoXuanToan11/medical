using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Service;

public class TimeBasedStatusService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<TimeBasedStatusService> _logger;
    private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(15); // Check every 15 minutes

    public TimeBasedStatusService(IServiceProvider serviceProvider, ILogger<TimeBasedStatusService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Time-based status service started with {Interval} minute intervals.", _checkInterval.TotalMinutes);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await UpdateTimeBasedStatuses();
                await Task.Delay(_checkInterval, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                // Service is stopping
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating time-based statuses.");
                await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken); // Wait 5 minutes before retrying
            }
        }

        _logger.LogInformation("Time-based status service stopped.");
    }

    private async Task UpdateTimeBasedStatuses()
    {
        using var scope = _serviceProvider.CreateScope();
        var medicineRequestService = scope.ServiceProvider.GetRequiredService<IMedicineRequestService>();

        try
        {
            var currentTime = DateTime.Now;
            var currentHour = currentTime.Hour;
            
            _logger.LogInformation("Running automated time-based status update at {Time}", currentTime);
            
            // Define time windows for each period
            var periodTimeWindows = new Dictionary<string, (int startHour, int endHour)>
            {
                { "Sáng", (6, 11) },    // 6 AM - 11 AM
                { "Trưa", (11, 14) },   // 11 AM - 2 PM
                { "Chiều", (14, 18) }   // 2 PM - 6 PM
            };
            
            // Check if we should run updates based on current time
            bool shouldRunUpdate = false;
            string reason = "";
            
            // Run updates at specific times:
            // - After each period ends (11:15 AM, 2:15 PM, 6:15 PM)
            // - Every hour after 6 PM for final cleanup
            if (currentHour == 11 && currentTime.Minute >= 15) // After Sáng period
            {
                shouldRunUpdate = true;
                reason = "After Sáng period (11:15 AM)";
            }
            else if (currentHour == 14 && currentTime.Minute >= 15) // After Trưa period
            {
                shouldRunUpdate = true;
                reason = "After Trưa period (2:15 PM)";
            }
            else if (currentHour == 18 && currentTime.Minute >= 15) // After Chiều period
            {
                shouldRunUpdate = true;
                reason = "After Chiều period (6:15 PM)";
            }
            else if (currentHour >= 19) // After 7 PM for final cleanup
            {
                shouldRunUpdate = true;
                reason = "Final cleanup after 7 PM";
            }
            
            if (shouldRunUpdate)
            {
                _logger.LogInformation("Running time-based status update: {Reason}", reason);
                
                // Run the comprehensive update
                await medicineRequestService.UpdateTimeBasedStatusAsync();
                
                _logger.LogInformation("Time-based status update completed for: {Reason}", reason);
            }
            else
            {
                _logger.LogDebug("Skipping time-based status update. Current time: {Time}, Next check in {Interval} minutes", 
                    currentTime, _checkInterval.TotalMinutes);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating time-based statuses.");
        }
    }
} 