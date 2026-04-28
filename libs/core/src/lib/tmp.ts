import { createValidator } from "./create-validator";
import { equals } from "./validations";


{
  interface TestModel {
    forename: string;
    surname: string;
  }

  const validator1 = createValidator<TestModel>()
    .ruleFor('forename', equals('foo'));
  const v1good = validator1.validate({ forename: 'foo', surname: 'bar' });
  const v1bad = validator1.validate({ forename: 'not foo', surname: 'bar' });
  console.debug('v1good', v1good);
  console.debug('v1bad', v1bad);


  const validator2 = createValidator<TestModel>()
    .ruleFor('forename', equals(model => model.surname));
  const v2good = validator2.validate({ forename: 'foo', surname: 'foo' });
  const v2bad = validator2.validate({ forename: 'foo', surname: 'bar' });
  console.debug('v2good', v2good);
  console.debug('v2bad', v2bad);
}
