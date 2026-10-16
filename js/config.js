/*
 * Configuração da LP — links de checkout e contatos.
 * Preços e textos dos kits ficam no index.html (seção 09. Kit).
 */
window.VORA_CONFIG = {
  // Kit padrão selecionado (0 = 1 mês, 1 = 2 meses, 2 = 3 meses)
  defaultKit: 1,

  // Link do checkout de cada kit (vazio = botão só seleciona o kit)
  kits: [
    { checkout: 'https://seguro.voranutrition.com/dYLv2c4eha' },          // Kit 1 mês (1 unidade)
    { checkout: 'https://seguro.voranutrition.com/bC7U9XpAsL/3Steps' },   // Kit 2 meses (2 unidades)
    { checkout: 'https://seguro.voranutrition.com/nAbXPTXFGl/3Steps' }    // Kit 3 meses (3 unidades)
  ],

  // Somente dígitos, com DDI
  whatsappNumber: '5548999008733',
  whatsappMessage: 'Olá! Tenho uma dúvida sobre o Vora Termocreatina.',

  phone: '(48) 99900-8733',
  email: 'vora.termocreatina@gmail.com',
  instagramHandle: 'vora.nutrition'
};
