
const getApp = () => require('./test');

const app = getApp();
app();

if ('hot' in module) {
  import.meta.webpackHot.accept(
    ['./test.js'],
    () => {
      getApp()();
    },
  );


  import.meta.webpackHot.addStatusHandler((status) => {
    // React to the current status...
    if (['abort', 'fail'].includes(status)) {
      console.log('status: %O', status);
      $module.failed();
    }
  });
}
