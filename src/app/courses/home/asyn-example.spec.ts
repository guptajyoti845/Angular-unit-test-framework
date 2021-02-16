describe('Async Testing Example', () => {

  it('async test example with Jasmine done', function (done: DoneFn) {
      let test = false;
      setTimeout(() => {
        console.log("assertion running");
        test = true;
        expect(test).toBeTruthy();
        console.log("assertion running");
        done();
      },1000)
  });

  it('Async test example with setTimeout', (done: DoneFn) => {
    let test =false;
    setTimeout(() => {
      console.log("assertion running");
      test = true;
      expect(test).toBeTruthy();
      console.log("assertion running");
      done();
    },1000)
  })
});
