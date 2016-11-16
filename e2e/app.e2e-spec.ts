import { NgThreeExamplePage } from './app.po';

describe('ng-three-example App', function() {
  let page: NgThreeExamplePage;

  beforeEach(() => {
    page = new NgThreeExamplePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
