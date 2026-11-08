# Correções de identidade e limpeza visual

- WIU: o recorte da direita da foto de grupo havia sido rotulado incorretamente como WIU. O erro contaminou os cards e o banner derivado. Substituído por fotografia individual de divulgação, crédito Mateus Aguiar, identificada como WIU na matéria do Rap Mais sobre Piranguera. Fonte e hash em public/artist-photo-sources.json. Banner recomposto com a referência correta e URL nova para evitar cache da arte anterior. Script de sincronização corrigido para não recriar o recorte errado.
- Trap BR: removida a associação à figura conceitual genérica. O hero da Home usa o mesmo retrato de Matuê da sua página de artista.
- Removido o bloco de ambientes tanto da Home quanto de todas as páginas de artista, incluindo componente, chamadas e CSS exclusivos. Mantidas a busca, as coleções, a discografia e os favoritos.
- As composições foram produzidas com o gerador de imagens integrado, com instrução de preservar o rosto e a pose da foto creditada; fundo preto, fumaça e eclipse vermelho. Arquivo runtime: public/assets/hero-wiu-verified-portrait.webp.

Validação: 10 testes passaram, build de produção passou, 14 casos de browser (Home e WIU nas sete larguras 320–1440) sem overflow, sem cards de ambientes e com os arquivos corretos carregados a 2172px. Card de WIU também conferido visualmente na aba Artistas. Screenshots e medições em docs/identity-corrections/. Safari iOS real não estava disponível.
