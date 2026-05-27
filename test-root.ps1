$response = Invoke-WebRequest -Uri "http://localhost:4000" -UseBasicParsing
Write-Host "Status: $($response.StatusCode)"
$response.Content | ConvertFrom-Json | Format-List
