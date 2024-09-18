{% import "../../templates/macros/formatting.md" as format %}

<!-- CATEGORY -->

{% macro category(category) %}

## {{ category.title }}

{{ category.description }}

{% for categoryRule in category.validations %}

{{ validations(categoryRule) }}

{% endfor %}

{% endmacro %}

<!-- VALIDATION -->

{% macro validations(validation) %}

### {{ validation.name }}

{{ validation.description }}

Example:

{{ format.typescript(validation.example) }}

{% if validation.exampleErrorMessage %}
Example error message: {{ validation.exampleErrorMessage }}
{% endif %}

{% if validation.parameters %}

Validation parameters:

{% for parameter in validation.parameters %}

- {{ parameter.name }}: {{ parameter.description }}

{% endfor %}

{% endif %}

{% endmacro %}
