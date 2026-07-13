param(
  [string]$WorkbookPath = (Join-Path $PSScriptRoot "..\Cervezas.xlsx"),
  [string]$OutputPath = (Join-Path $PSScriptRoot "..\beer-catalog.js")
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.IO.Compression

function Read-ZipEntryText {
  param([System.IO.Compression.ZipArchive]$Archive, [string]$EntryName)
  $entry = $Archive.GetEntry($EntryName)
  if (-not $entry) { throw "No se encontró $EntryName dentro del Excel." }
  $reader = [System.IO.StreamReader]::new($entry.Open())
  try { return $reader.ReadToEnd() } finally { $reader.Dispose() }
}

function Get-StableId {
  param([string]$Name, [string]$Country)
  $key = "$($Name.Trim().ToLowerInvariant())|$($Country.Trim().ToLowerInvariant())"
  $bytes = [Text.Encoding]::UTF8.GetBytes($key)
  $hash = [Security.Cryptography.SHA256]::Create()
  try { $hex = ([BitConverter]::ToString($hash.ComputeHash($bytes))).Replace("-", "").ToLowerInvariant() } finally { $hash.Dispose() }
  return "beer-$($hex.Substring(0, 14))"
}

function Normalize-Country([string]$Value) {
  $value = $Value.Trim()
  $map = @{
    "Canada" = "Canad\u00e1"; "Escocia" = "Reino Unido"; "Holanda" = "Pa\u00edses Bajos"; "Inglesa" = "Reino Unido"
    "Peru" = "Per\u00fa"; "R. Checa" = "Rep\u00fablica Checa"; "Rep. Checa" = "Rep\u00fablica Checa"; "R. Unido" = "Reino Unido"
    "Singapore" = "Singapur"; "Thailandia" = "Tailandia"; "U.S.A." = "Estados Unidos"
  }
  if ($map.ContainsKey($value)) { return [regex]::Unescape($map[$value]) }
  return $value
}

function Normalize-Style([string]$Value) {
  $value = $Value.Trim()
  $map = @{
    "Abadia" = "Abad\u00eda"; "I.P.A." = "IPA"; "India Pale Ale" = "IPA"; "Pils" = "Pilsen"; "Pilsner" = "Pilsen"
  }
  if ($map.ContainsKey($value)) { return [regex]::Unescape($map[$value]) }
  return $value
}

function Normalize-Fermentation([string]$Value) {
  $value = $Value.Trim().TrimStart('.')
  if ($value -eq "Espontanea") { return [regex]::Unescape("Espont\u00e1nea") }
  return $value
}

function Get-AsciiKey([string]$Value) {
  $normalized = $Value.Normalize([Text.NormalizationForm]::FormD)
  $builder = [Text.StringBuilder]::new()
  foreach ($character in $normalized.ToCharArray()) {
    if ([Globalization.CharUnicodeInfo]::GetUnicodeCategory($character) -ne [Globalization.UnicodeCategory]::NonSpacingMark) { [void]$builder.Append($character) }
  }
  return $builder.ToString().ToLowerInvariant()
}

function Get-CountryFlag([string]$Country) {
  $codes = @{
    "alemania"="DE"; "argentina"="AR"; "australia"="AU"; "austria"="AT"; "belgica"="BE"
    "brasil"="BR"; "canada"="CA"; "china"="CN"; "cuba"="CU"; "dinamarca"="DK"
    "ecuador"="EC"; "espana"="ES"; "estados unidos"="US"; "finlandia"="FI"; "francia"="FR"
    "india"="IN"; "irlanda"="IE"; "italia"="IT"; "jamaica"="JM"; "japon"="JP"
    "marruecos"="MA"; "mexico"="MX"; "paises bajos"="NL"; "peru"="PE"; "polonia"="PL"
    "portugal"="PT"; "reino unido"="GB"; "republica checa"="CZ"; "singapur"="SG"; "tailandia"="TH"
  }
  $key = Get-AsciiKey $Country
  if (-not $codes.ContainsKey($key)) { return "" }
  $code = $codes[$key]
  return [char]::ConvertFromUtf32(0x1F1E6 + ([int][char]$code[0] - [int][char]'A')) + [char]::ConvertFromUtf32(0x1F1E6 + ([int][char]$code[1] - [int][char]'A'))
}

function Get-ExistingImageMap {
  $map = @{}
  $candidatePaths = @((Join-Path $PSScriptRoot "..\beer-catalog.js"), (Join-Path $PSScriptRoot "..\script.js"))
  foreach ($candidate in $candidatePaths) {
    if (-not (Test-Path $candidate)) { continue }
    $content = [IO.File]::ReadAllText((Resolve-Path $candidate), [Text.Encoding]::UTF8)
    foreach ($match in [regex]::Matches($content, 'name\s*:\s*"(?<name>[^"]+)"[^\}]*image\s*:\s*"(?<image>[^"]*)"')) {
      $name = $match.Groups['name'].Value
      $image = $match.Groups['image'].Value
      if ($image -and -not $map.ContainsKey($name)) { $map[$name] = $image }
    }
    foreach ($match in [regex]::Matches($content, '"name"\s*:\s*"(?<name>[^"]+)"[^\}]*"image"\s*:\s*"(?<image>[^"]*)"')) {
      $name = $match.Groups['name'].Value
      $image = $match.Groups['image'].Value
      if ($image -and -not $map.ContainsKey($name)) { $map[$name] = $image }
    }
  }
  return $map
}

$resolvedWorkbook = (Resolve-Path $WorkbookPath).Path
$stream = [IO.File]::Open($resolvedWorkbook, [IO.FileMode]::Open, [IO.FileAccess]::Read, [IO.FileShare]::ReadWrite)
$archive = [IO.Compression.ZipArchive]::new($stream, [IO.Compression.ZipArchiveMode]::Read)

try {
  [xml]$sharedXml = Read-ZipEntryText $archive "xl/sharedStrings.xml"
  $sharedStrings = @($sharedXml.sst.si | ForEach-Object {
    if ($null -ne $_.t) { [string]$_.t } else { [string](($_.r | ForEach-Object { $_.t }) -join "") }
  })
  [xml]$sheetXml = Read-ZipEntryText $archive "xl/worksheets/sheet1.xml"

  function Get-CellValue($Cell) {
    if ($null -eq $Cell.v) { return "" }
    if ($Cell.t -eq "s") { return [string]$sharedStrings[[int]$Cell.v] }
    return [string]$Cell.v
  }

  $imageMap = Get-ExistingImageMap
  $catalog = [Collections.Generic.List[object]]::new()
  foreach ($row in $sheetXml.worksheet.sheetData.row | Select-Object -Skip 1) {
    $values = @{}
    foreach ($cell in $row.c) {
      $column = ([regex]::Match([string]$cell.r, "^[A-Z]+")).Value
      $values[$column] = Get-CellValue $cell
    }

    $name = ([string]$values["A"]).Trim()
    if (-not $name) { continue }
    $country = Normalize-Country ([string]$values["B"])
    $style = Normalize-Style ([string]$values["D"])
    $fermentation = Normalize-Fermentation ([string]$values["F"])
    $flavor = ([string]$values["G"]).Trim()
    $abvText = ([string]$values["E"]).Trim().Replace(",", ".")
    $abv = $null
    if ($abvText) {
      $parsedAbv = 0.0
      if ([double]::TryParse($abvText, [Globalization.NumberStyles]::Any, [Globalization.CultureInfo]::InvariantCulture, [ref]$parsedAbv)) { $abv = $parsedAbv }
    }

    $catalog.Add([ordered]@{
      id = Get-StableId $name $country
      name = $name
      country = $country
      flag = Get-CountryFlag $country
      style = $style
      abv = $abv
      fermentation = $fermentation
      flavor = $flavor
      image = if ($imageMap.ContainsKey($name)) { $imageMap[$name] } else { "" }
    })
  }

  $catalog = @($catalog | Sort-Object @{Expression={$_.name}; Ascending=$true}, @{Expression={$_.country}; Ascending=$true})
  $json = $catalog | ConvertTo-Json -Depth 4
  $output = "// Generado desde Cervezas.xlsx. No editar manualmente.`nwindow.BEER_CATALOG = $json;`n"
  [IO.File]::WriteAllText([IO.Path]::GetFullPath($OutputPath), $output, [Text.UTF8Encoding]::new($false))
  Write-Output "Catálogo generado: $($catalog.Count) cervezas -> $([IO.Path]::GetFullPath($OutputPath))"
} finally {
  $archive.Dispose()
  $stream.Dispose()
}
