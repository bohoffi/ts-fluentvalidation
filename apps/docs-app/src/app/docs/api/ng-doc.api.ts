import { NgDocApi } from '@ng-doc/core';

const Api: NgDocApi = {
  title: 'API reference',
  scopes: [
    {
      name: '@ts-fluentvalidation/core',
      route: 'core',
      include: 'libs/core/src/index.ts'
    }
  ]
};

export default Api;
