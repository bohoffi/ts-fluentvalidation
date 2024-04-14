{% import "../../templates/macros/formatting.md" as format %}

<!-- CATEGORY -->

{% macro category(category) %}

## {{ category.title }}

{{ category.description }}

{% for categoryRule in category.rules %}

{{ rule(categoryRule) }}

{% endfor %}

{% endmacro %}

<!-- RULE -->

{% macro rule(rule) %}

### {{ rule.name }}

{{ rule.description }}

Example:

{{ format.typescript(rule.example) }}

{% if rule.exampleErrorMessage %}
Example error message: {{ rule.exampleErrorMessage }}
{% endif %}

{% if rule.parameters %}

Rule parameters:

{% for parameter in rule.parameters %}

- {{ parameter.name }}: {{ parameter.description }}

{% endfor %}

{% endif %}

{% endmacro %}
