import { NgDocPage } from '@ng-doc/core';
import { ControlValidatorComponent } from '../../../demos/control-validator.component';
import Integrations from '../ng-doc.category';

const Angular: NgDocPage = {
  title: `Angular`,
  mdFile: './index.md',
  route: `angular`,
  category: Integrations,
  order: 1,
  demos: {
    ControlValidatorComponent
  }
};

export default Angular;
