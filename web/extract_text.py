import zipfile
import xml.etree.ElementTree as ET

docx_path = 'd:/Projects/Asyad_web/ASYAD - WP (3).docx'

try:
    with zipfile.ZipFile(docx_path) as z:
        xml_content = z.read('word/document.xml')
        tree = ET.fromstring(xml_content)
        
        # XML namespace for Word
        namespace = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        text = []
        for p in tree.findall('.//w:p', namespace):
            paragraph_text = []
            for t in p.findall('.//w:t', namespace):
                if t.text:
                    paragraph_text.append(t.text)
            if paragraph_text:
                text.append(''.join(paragraph_text))
        
        print('\n'.join(text))
except Exception as e:
    print(f"Error: {e}")
