# Test script for HealthCheckForm API
$uri = "https://localhost:7111/api/HealthCheckForm"
$body = @{
    studentId = 1
    parentId = 1
    consentStatus = "Pending"
    className = "10A"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri $uri -Method POST -ContentType "application/json" -Body $body -SkipCertificateCheck
    Write-Host "Status Code: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
} 