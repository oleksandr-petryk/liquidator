import { testAdd } from '../../../src/shared/utils/test1.util';

test('testAdd', () => {
  const A = 10;
  const B = 20;

  const result = testAdd(A, B);

  expect(result).toEqual(A + B);
});
