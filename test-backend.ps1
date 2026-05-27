$body = @{
    email = "admin@pahadicraft.com"
    password = "Admin@123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:4000/api/admin/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body `
    -UseBasicParsing

Write-Host "Status: $($response.StatusCode)"
$response.Content | ConvertFrom-Json | Format-List
