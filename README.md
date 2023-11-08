# URLCuttter

Personal link shortener! It allows the admin to add, edit and remove url redirects. It also supports url versioning.

## Development

Stack is sveltekit with an sqlite3 database, using drizzle orm. Development/deployment is relatively straightforward if you're familiar with those three things.

There is no dockerfile as of right now. PRs for that are welcome.

As for running with pm2, please clone the entire repository and build from there. Also make sure the `cwd` is set to the repository root, not the build directory (otherwise migrations will fail)

## Environment Variables

These environment variables are required!

-   `ADMIN_PASSWORD` - password for accessing the admin panel
-   `PUBLIC_ITEMS_PER_PAGE` - max amount of items on a singular page
-   `PUBLIC_PAGE_FETCH_OFFSET` - max amount of pages visible in pagination "next" to the current page. i.e. a value of 2 will show the pages `2 3 (4) 5 6`, when on page 4
-   `PUBLIC_GIT_URL` - git repository url. for example "https://github.com/Draconizations/urlcutter"
