---
keyword: 'BuildingRulesBuiltInRules'
---

{% import "../../templates/macros/validations.md" as validations %}

`@ts-fluentvalidation/core` comes with a set of predefined validations.

{% for category in NgDocPage.data.validationCategories %}
{{ validations.category(category) }}
{% endfor %}
