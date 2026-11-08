# Retratos cinematográficos por artista

Solicitação: aplicar a estética aprovada do XXXTENTACION a Matuê, Teto e WIU, cada um com sua própria identidade fotográfica.

Causa: o componente Hero compartilhava o banner conceitual da Home com Matuê e usava um fallback fotográfico sem composição cinematográfica para Teto e WIU.

Correção: mapeamento explícito por artista, três composições derivadas das fotos existentes, mesma proporção 3:1 e mesma apresentação do X. A Home conserva seu banner; a LEGACY e o retrato do X não foram alterados. O retrato também acompanha os álbuns de cada artista. Fontes e edição por IA descritas em credits.html.

Direção das composições: conservar rosto, cabelo, roupa e expressão da fotografia de origem; fundo preto, fumaça cinza, arco fino de eclipse vermelho, pessoa à direita e espaço à esquerda para texto real da interface. Sem texto incorporado à imagem. Produzidas com o gerador de imagens integrado e codificadas em WebP.

## Validação

- 10 testes automatizados passaram e build de produção aprovado.
- 21 verificações em Chromium: os três artistas nas larguras 320, 375, 390, 430, 768, 1024 e 1440 px. Todas carregaram o banner correto, natural 2172 × 724, sem overflow horizontal. A largura útil registrada no JSON desconta a barra de rolagem de 15 px.
- Screenshots de cada artista em desktop 1024 × 704 e mobile 390 × 844 em docs/artist-portraits. O mobile usa um enquadramento específico de 84% para manter o rosto visível.
- Home e XXXTENTACION continuam usando suas artes anteriores; favoritos, navegação e player mantêm os componentes existentes.
- Safari iOS real não estava disponível para validação.
