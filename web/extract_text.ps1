$docxPath = "d:\Projects\Asyad_web\ASYAD - WP (3).docx"
$tempZip = "d:\Projects\Asyad_web\temp_doc.zip"
$tempFolder = "d:\Projects\Asyad_web\temp_doc_folder"

Copy-Item $docxPath $tempZip
Expand-Archive -Path $tempZip -DestinationPath $tempFolder -Force

$xmlPath = "$tempFolder\word\document.xml"
[xml]$xml = Get-Content $xmlPath

# Extract text from w:t nodes. Using local-name to ignore namespace issues easily
$textNodes = $xml.SelectNodes("//*[local-name()='t']")
$content = ""
foreach ($node in $textNodes) {
    $content += $node.InnerText + " "
}

Write-Output $content

# Cleanup
Remove-Item $tempZip -Force
Remove-Item $tempFolder -Recurse -Force
