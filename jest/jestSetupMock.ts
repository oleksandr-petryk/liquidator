if (process.env.VERBOSE_TESTS_LOG !== 'true') {
  console.log = jest.fn();
  console.error = jest.fn();
  console.debug = jest.fn();
  console.info = jest.fn();
}
