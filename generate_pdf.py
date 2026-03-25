import zlib

def create_simple_pdf(filename, text):
    # Extremely basic PDF structure
    content = f"BT /F1 12 Tf 100 700 Td ({text}) Tj ET"
    stream = content.encode('ascii')
    
    pdf = [
        b"%PDF-1.1",
        b"1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
        b"2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
        b"3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> >> endobj",
        f"4 0 obj << /Length {len(stream)} >> stream".encode('ascii'),
        stream,
        b"endstream endobj",
        b"xref",
        b"0 5",
        b"0000000000 65535 f",
        b"0000000010 00000 n",
        b"0000000059 00000 n",
        b"0000000115 00000 n",
        b"0000000282 00000 n",
        b"trailer << /Size 5 /Root 1 0 R >>",
        b"startxref",
        b"400",
        b"%%EOF"
    ]
    
    with open(filename, 'wb') as f:
        f.write(b'\n'.join(pdf))

create_simple_pdf('resume.pdf', 'John Doe - Software Engineer Resume Content')
