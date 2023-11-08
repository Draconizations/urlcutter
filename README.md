# URLCuttter

Personal link shortener! It allows the admin to add, edit and remove url redirects. It also supports url versioning.

## Development

Stack is sveltekit with an sqlite3 database, using drizzle orm. Development/deployment is relatively straightforward if you're familiar with those three things.

There is no dockerfile as of right now. PRs for that are welcome. Pm2 should work out of the box.

## Environment Variables

These environment variables are optional other than `ADMIN_PASSWORD`

-   `ADMIN_PASSWORD` - password for accessing the admin panel
-   `PUBLIC_ITEMS_PER_PAGE` - max amount of items on a singular page. Defaults to 15
-   `PUBLIC_PAGE_FETCH_OFFSET` - max amount of pages visible in pagination "next" to the current page. i.e. a value of 2 will show the pages `2 3 (4) 5 6`, when on page 2. Defaults to 3
-   `PUBLIC_GIT_URL` - git repository url. defaults to https://github.com/Draconizations/urlcutter
