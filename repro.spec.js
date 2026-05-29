const { test } = require('@playwright/test');

test('turn key reproduction', async ({ page }) => {
  page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => {
    console.log('PAGEERROR:', err.message);
    console.log(err.stack);
  });
  await page.goto('http://127.0.0.1:8000/index.html');
  await page.waitForTimeout(1000);
  await page.keyboard.down('KeyA');
  await page.waitForTimeout(2000);
  await page.keyboard.up('KeyA');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/tmp/007-turn.png' });
});
