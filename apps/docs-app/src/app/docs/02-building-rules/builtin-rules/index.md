{% import "../../templates/macros/rules.md" as rules %}

# {{ NgDocPage.title }}

`@ts-fluentvalidation/core` comes with a set of predefined rules.

{% for category in NgDocPage.data.ruleCategories %}
{{ rules.category(category) }}
{% endfor %}
