# Tech-Website

_**Please read this stuff, it's quite important**_

> **Updated by richie-rich90454 in 2026/6 — migrated the whole project from Express.js to Next.js**

**src/app folder (frontend & backend):**

Next.js is basically a full-stack framework that handles both the frontend and backend in one place. Pages live in the `src/app` folder, and each page has its own folder with a `page.tsx` file. If u wanna make a new page, just create a new folder and put a `page.tsx` in it.
API routes are in `src/app/api/` — same concept, just `route.ts` files instead of `page.tsx`. No more messing with express routers and ejs files. Next.js handles all of that itself.

**src/components folder (reusable stuff):**

Where all the shared components live — headers, footers, forms, tables, etc. If you're gonna use the same thing on multiple pages, put it here so u don't have to copy-paste the same code everywhere.

**src/lib folder (database & config):**

The database is now running on SQLite with Prisma. Prisma is basically a type-safe database thingy that makes it way easier to query stuff. The schemas are in the `prisma` folder — there's two databases: one for main stuff and one for web stuff.
If u wanna reset the database, just run `npm run db:reset` and it'll wipe everything and re-seed it with test data.

**Install node.js & run the project:**

Everyone should install node js and npm (node package manager) on their own machines so they can test run the server themselves to see if stuff works. This is no longer an express app so u don't need to worry about ejs or nodemon or any of that old stuff.

Since github doesn't allow me to upload a folder with more than 100 files in it, I can't upload all the node modules, so u'll have to run `npm install` urself after cloning the repo.

Running the project:

In your command prompt, run these commands (once you've downloaded node.js and npm):

```
npm install
```

then

```
npm run dev
```

npm install downloads all the dependencies listed in package.json
npm run dev starts a local dev server on localhost:3000 with turbo mode, so it's fast as hell and auto-refreshes when u make changes

**Other useful commands:**

```
npm run build       # builds the project for production
npm run start       # starts the production server
npm run lint        # checks for code errors
npm run db:reset    # wipes and re-seeds both databases
npm run format      # formats all ur code with prettier
```

**Using Github:**

Last but not least, make pull requests to upload changes, cuz that's how github works. If u don't know how to use github, then look up a tutorial or learn from other members.
