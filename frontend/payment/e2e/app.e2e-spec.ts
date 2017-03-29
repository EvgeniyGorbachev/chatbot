import { PaymentPage } from './app.po';

describe('payment App', () => {
  let page: PaymentPage;

  beforeEach(() => {
    page = new PaymentPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
