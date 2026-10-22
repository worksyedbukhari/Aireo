$ErrorActionPreference = 'Stop'
$aireoRoot = $PSScriptRoot
$aireoUrl = 'http://localhost:3000'
try {
  $aireoResponse = Invoke-WebRequest -Uri $aireoUrl -TimeoutSec 2 -UseBasicParsing
  if ($aireoResponse.Content -match 'Aireo') { Write-Host "Aireo is already ready at $aireoUrl"; exit 0 }
  throw 'Port 3000 is occupied by another site.'
} catch {
  if ($_.Exception.Message -eq 'Port 3000 is occupied by another site.') { throw }
}
$aireoNode = (Get-Command node -ErrorAction Stop).Source
Start-Process -FilePath $aireoNode -ArgumentList 'preview.mjs' -WorkingDirectory $aireoRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $aireoRoot 'preview.log') -RedirectStandardError (Join-Path $aireoRoot 'preview-error.log')
Write-Host "Aireo frontend preview started at $aireoUrl"
