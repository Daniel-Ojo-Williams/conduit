generate migrations using this command
```sh
NAME=$1 npm run mg:gen
```

replace $1 with the name or description of the transaction

check out this link to understand the lint script in the package.json
- <ins> [Git command get name of staged files](https://explainshell.com/explain?cmd=git+diff+--name-only+--cached+--diff-filter%3DACMR+--ignore-space-at-eol+-M100%25) <ins>
- The other end of the command `sed 's| |\\ |g' | grep '.ts$'` removes spaces and returns only .ts files