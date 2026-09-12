# Connect Formline to Supabase (free plan)

1. Go to https://database.new and sign in. Choose **New project**.
2. Pick a project name such as `formline`, a nearby region, and save the database password somewhere private. Do **not** put this password in the website.
3. Wait until the project says it is ready.
4. In the left menu, open **SQL Editor** and choose **New query**.
5. Open `supabase/schema.sql` in this project, copy all of it into the query window, then select **Run**. You should see a success message.
6. Open **Project Settings** (the gear icon) > **API**. Copy the **Project URL** and the **Publishable key** (or legacy `anon` key).
7. In this project, rename `.env.example` to `.env.local` and fill it in:

   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ```

8. Send me the Project URL and publishable key, or confirm after adding them. Those two values are safe for a browser app; never send a database password or `service_role` key.

## Make yourself an admin

1. First, create your normal account in Formline once the sign-up flow is connected.
2. In Supabase, open **SQL Editor** > **New query** and run this, replacing the email address:

   ```sql
   update public.profiles
   set role = 'admin'
   where id = (select id from auth.users where email = 'you@example.com');
   ```

3. Sign out and back in. Your account is now permitted to review architect applications.

## Free-plan note

The free project is enough for this first release. Keep licence documents in the private `verification` bucket, and use the public `portfolio` bucket only for work images intended for the directory.
