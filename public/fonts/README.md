# Brand fonts (self-hosted)

Taruh file font `.ttf` di folder ini dengan nama PERSIS seperti berikut supaya
otomatis kebaca oleh `@font-face` di `client/src/index.css`:

| Peran     | Nama file yang diharapkan   | Family CSS   |
|-----------|-----------------------------|--------------|
| Display   | `MarkPro-Bold.ttf`          | `Mark Pro`   |
| Body      | `Eina03-Regular.ttf`        | `Eina 03`    |
| Body Bold | `Eina03-Bold.ttf` (opsional)| `Eina 03`    |

- Kalau nama file font kamu beda, ganti nama file-nya ATAU sesuaikan `src: url(...)`
  di blok `@font-face` pada `client/src/index.css`.
- Kalau punya Eina 03 Bold, uncomment blok `@font-face` "Eina 03 Bold" di index.css.
- `.ttf` jalan, tapi untuk web lebih ringan kalau dikonversi ke `.woff2` nanti
  (opsional, bisa belakangan).

Font display/body dipetakan lewat CSS variable `--font-display` / `--font-body`
di `:root` — jadi ganti font cukup di satu tempat.
