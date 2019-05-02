---
title: Global Filtering of your Entity Framework Core DbContext
tags:
---
I've hit this issue many times. Whether you are restricting data for a particular user access or to ensure your multi-tenant application in one database is NOT leaking data, you will need to make sure your filters are in always in place and cannot be overridden or accidentally forgotten.

<!-- more -->

https://docs.microsoft.com/en-us/ef/core/querying/filters
https://stackoverflow.com/questions/42649145/entity-framework-core-filter-dbset