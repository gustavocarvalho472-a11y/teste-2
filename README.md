# Vora Termocreatina — Landing Page (v5 "Curvas")

LP estática (HTML + CSS + JS puro, sem build). Recria o handoff `Vora LP v5 Curvas`.

## Rodar localmente

```bash
cd vora-lp
python3 -m http.server 8080   # ou: npx serve .
```

Abra http://localhost:8080. Para publicar, suba a pasta inteira em qualquer hospedagem estática (Vercel, Netlify, GitHub Pages, S3...).

## O que editar

- **`js/config.js`** — links de checkout dos 3 kits, WhatsApp, telefone, e-mail e @ do Instagram.
- **Preços dos kits** — direto no `index.html`, seção `09. Kit`.
- **Vídeos de depoimento** — ficam em `assets/videos/` (MP4 540×960 + capa `.jpg`). Para trocar, substitua os arquivos ou edite `data-src`/`data-poster` nos `.video-card` do `index.html`. Tocam mudos ao aparecer na tela; o botão "Toque para ouvir" liga o som.

## Estrutura

```
index.html        marcação de todas as seções
css/style.css     estilos (tokens de cor no :root, breakpoint principal 1000px)
js/config.js      conteúdo pendente / configurável
js/main.js        marquees, seleção de kit, links, carrossel de depoimentos e vídeos
assets/           fotos, renders do pote e logos
```

## Pendências de conteúdo

Checkouts configurados em `js/config.js` (1, 2 e 3 unidades).
Fotos `cliente-*` são de clientes reais — confirmar autorização de uso.
