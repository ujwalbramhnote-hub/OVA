$ErrorActionPreference = 'Stop'

function Resolve-JavaHome {
  if ($env:JAVA_HOME -and (Test-Path -LiteralPath (Join-Path $env:JAVA_HOME 'bin\java.exe'))) {
    return $env:JAVA_HOME
  }

  $javaCommand = Get-Command java -ErrorAction SilentlyContinue
  if ($javaCommand -and $javaCommand.Source) {
    $javaPath = $javaCommand.Source
    return Split-Path (Split-Path $javaPath -Parent) -Parent
  }

  return $null
}

if ($args.Count -gt 0) {
  throw 'This launcher does not accept arguments.'
}

$JavaHome = Resolve-JavaHome
if (-not $JavaHome) {
  throw 'Java was not found on PATH and JAVA_HOME is not set. Install Java and ensure java.exe is available on PATH.'
}

$env:JAVA_HOME = $JavaHome
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
Set-Location $PSScriptRoot
& .\mvnw spring-boot:run
