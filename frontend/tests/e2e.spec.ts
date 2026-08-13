import { test, expect } from '@playwright/test';

test.describe('Autenticação e Perfis', () => {
  test('Deve realizar login como Admin e visualizar dashboard', async ({ page }) => {
    await page.goto('/login');
    
    // Supondo que exista um Admin criado no seed inicial (admin@helpdesk.com / 123456)
    await page.fill('input[type="email"]', 'admin@helpdesk.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');

    // Verifica se redirecionou para o Dashboard (que tem o menu de chamados)
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Chamados')).toBeVisible();
    await expect(page.locator('text=ADMIN')).toBeVisible();
  });

  test('Deve bloquear acesso sem login', async ({ page }) => {
    await page.goto('/dashboard');
    // Deve ser redirecionado de volta para o login
    await expect(page).toHaveURL('/login');
  });

  // Outros testes (Técnico e Cliente) seguirão a mesma lógica
});

test.describe('Fluxos do Admin', () => {
  // Testaremos a navegação para os modais, e listagem.
  test('Admin pode navegar para Técnicos e abrir modal de Novo Técnico', async ({ page }) => {
    // Fazer login primeiro
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@helpdesk.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');

    // Navegar para Técnicos (pega o link visível)
    await page.getByRole('link', { name: 'Técnicos', exact: true }).first().click();
    await expect(page).toHaveURL('/technicians');
    
    // Clicar no botão Novo
    await page.click('button:has-text("Novo")');

    // Verificar se modal abriu
    await expect(page.locator('text=Cadastro de técnico')).toBeVisible();
    // Fechar modal
    await page.locator('button:has(svg.lucide-x)').click();
  });

  test('Admin pode navegar para Clientes e abrir modal de Editar Cliente', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@helpdesk.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');

    await page.getByRole('link', { name: 'Clientes', exact: true }).first().click();
    await expect(page).toHaveURL('/customers');
  });

  test('Admin pode navegar para Serviços', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@helpdesk.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');

    await page.getByRole('link', { name: 'Serviços', exact: true }).first().click();
    await expect(page).toHaveURL('/services');
  });
});
