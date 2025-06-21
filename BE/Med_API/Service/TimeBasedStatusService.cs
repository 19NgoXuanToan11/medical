using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Service;

public class TimeBasedStatusService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<TimeBasedStatusService> _logger;
    private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(5); // Check every 5 minutes

    public TimeBasedStatusService(IServiceProvider serviceProvider, ILogger<TimeBasedStatusService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Time-based status service started.");

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
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken); // Wait 1 minute before retrying
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
            
            // Only run the update if it's past 5 PM
            if (currentTime.Hour >= 17)
            {
                _logger.LogInformation("Running time-based status update at {Time}", currentTime);
                await medicineRequestService.UpdateTimeBasedStatusAsync();
                _logger.LogInformation("Time-based status update completed.");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating time-based statuses.");
        }
    }
} 