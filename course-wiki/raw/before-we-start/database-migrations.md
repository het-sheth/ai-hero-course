# RAW — Database Migrations (Before We Start, 01.04)

> Immutable source material for [[before-we-start/database-migrations]].
> Pasted by Het from the aihero.dev lesson page (steps + full transcript). Read, never rewrite.
> Source: https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04
> Drizzle ORM: https://orm.drizzle.team/ · Lesson length: 3:39.

## Lesson page content

Understanding how databases, schemas, and migrations work together is crucial to building real
applications. This lesson teaches managing database changes via a three-step process: define your
schema, generate migrations, and apply those migrations to your database.

### The Database Files
When you run the seed script, **SQLite** creates files on your filesystem representing the entire
database. Unlike databases like Postgres that run on remote servers, SQLite lets you see and even
delete these files directly (`data.db`). To reset completely, delete the `data.db` file and re-run
the seed script.

### The Three-Step Process
1. Edit your schema in `schema.ts`
2. Run `pnpm db:generate` to create migration files
3. Run `pnpm db:migrate` to apply those migrations to your database

This keeps your database synchronized with your code.

### Steps To Complete
- Open `package.json` and locate the db scripts (`db:seed`, `db:generate`, `db:migrate`).
- Delete the `data.db` file (simulates needing to reset).
- Run `pnpm dev` and observe the error — visit localhost:5175, you should see an error about a
  missing table (`no such table courses`) because the database no longer exists.
- Stop the dev server and re-seed: `pnpm db:seed` → `data.db` reappears.
- Open `schema.ts` and examine the table definitions (`users`, `categories`, `courses`, `modules`,
  `lessons`, …). Just get familiar with how the schema defines the database structure.
- Make a small change to one table (add a new column or modify one) — simulates a real change.
- Run `pnpm db:generate` → new migration files appear in a migrations folder.
- Run `pnpm db:migrate` → applies your schema changes to the actual database file.
- Verify changes took effect (SQLite viewer or inspect `data.db`).
- Practice resetting: delete `data.db`, `pnpm db:seed`, confirm everything works again.

## Full video transcript

00:00 One thing that a lot of folks got confused about when I first ran this course was how database and database migrations work. If you are an experienced developer, you probably don't need to watch this bit, but if you need a bit of kind of catching up on how databases function, then this is the lesson for you. The type of database that we're using is an SQLite database, and that sounds pretty scary if you're a newbie, but really what this means is it's a type of database that you can save as a file on your file system. This is very different from databases like Postgres, for instance, that you need to host on a remote server or run in let's say a Docker container. If you ran the dbseed script, then you should see these little files here, data.db, data.bd, shm, data.db, wow.

00:43 If we want to, we can totally delete these files from our code base. That's a very simple way that we can just reset the database back to nothing. And now if we try to run pnpm dev let's say and visit localhost 5175 then we're going to get an error that looks like this saying no such table courses because it's tried to fetch a courses table that doesn't actually exist because the database isn't there. So this means we can come back into here, we can control C out of the dev script and run pnpm db colon seed again which will re-seed it. And just like that, if we look at our file system again, we can see that data.db is back.

01:20 The way that we manage changes to the database is by looking at, first of all, the schema.ts file. Inside here, we can see there are multiple different tables that represent the different things inside the database. So we have a users table, a categories table, a courses table, modules table, lessons table, enrollments table, et cetera. You don't need to like look at this in depth, but this is an important thing to see. This is a Drizzle schema, and Drizzle is a library that we're using, Drizzle ORM up here, to manage our database.

01:53 But changes to this schema won't automatically synchronize over to that database. To synchronize it over, you can see the scripts that we might want to run. Inside your package.json file there are some scripts inside here and these are the ones that we have been running with PNPM. So PNPM run db seed, that was the script that we've run. We ran the seed scripts just here.

02:15 We've run pnpm dev to run react-router-dev to start the dev server. There's a couple of other DB scripts that you need to be aware of. First of all is db-generate. Every time you make a change to the schema, a new one of these will be created when you run db-generate if we go back to package.json. And usually your agent will be smart enough to work this out itself.

02:37 The thing the agent probably doesn't know to do is to run db colon migrate. What this migrate script does is it looks at all of the migration scripts just up here, and then if any haven't been run, it runs them. So this means that you need to deliberately keep your database in sync with the state of your code. So the whole process looks like this. You have a schema.ts file, which is the kind of drizzle source of truth.

03:04 You run db generate to turn that into migration files and then you run db migrate to actually migrate it to the database. This is how a lot of production setups actually work And this is the setup I want you to bear in mind anytime you're doing work with the database. And remember if you get into trouble and you need to reset you can always just delete this data.db file, run pnpmdb seed just here and you should be fine to start again. There are no actual users relying on this data, it's just a dummy database, so you can feel free to just delete it and refresh anytime. Nice work, and I will see you in the next one.
