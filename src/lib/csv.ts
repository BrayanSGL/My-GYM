function escapeCsvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function toCsv(rows: (string | number)[][]): string {
  return rows.map((row) => row.map((cell) => escapeCsvField(String(cell))).join(',')).join('\r\n')
}

export function downloadCsv(filename: string, content: string): void {
  // BOM al inicio para que Excel reconozca UTF-8 y muestre bien los acentos.
  const utf8Bom = String.fromCharCode(0xfeff)
  const blob = new Blob([utf8Bom + content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
