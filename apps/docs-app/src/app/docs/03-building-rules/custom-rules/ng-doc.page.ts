import {NgDocPage} from '@ng-doc/core';
import BuildingRules from '../ng-doc.category';

const CustomRules: NgDocPage = {
	title: `Custom Rules`,
	mdFile: './index.md',
	route: `building-rules/custom-rules`,
	category: BuildingRules,
	order: 2,
};

export default CustomRules;
