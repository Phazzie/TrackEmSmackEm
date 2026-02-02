# Deployment Checklist

## 1. Supabase Setup (Database)
1.  **Create Project:** Go to [database.new](https://database.new) and create a new project.
2.  **Run Schema:**
    *   Go to the **SQL Editor** in the side menu.
    *   Copy the content of `supabase/schema.sql`.
    *   Paste and click **Run**.
3.  **Get Credentials:**
    *   Go to **Project Settings** > **API**.
    *   Copy **Project URL**.
    *   Copy **service_role secret** (reveal it first). *Note: We use service_role to bypass RLS for this single-user app.*

## 2. Vercel Setup (Hosting)
1.  **Import Project:**
    *   Go to [vercel.com/new](https://vercel.com/new).
    *   Import from GitHub: `Phazzie/TrackEmSmackEm`.
2.  **Environment Variables:**
    Add the following before clicking Deploy:

    | Variable | Value | Description |
    | :--- | :--- | :--- |
    | `STORAGE_MODE` | `supabase` | Switches app from memory to DB. |
    | `SUPABASE_URL` | `https://...supabase.co` | Your Project URL. |
    | `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Your service_role secret. |
    | `APP_PASSCODE` | `(your choice)` | The password to login. |
    | `APP_SESSION_SECRET` | `(random string)` | Used to sign cookies (long & random). |
    | `APP_USER_ID` | `admin` | (Optional) ID for the main user. |

3.  **Deploy:** Click **Deploy**.

## 3. Post-Deployment Verification
1.  Visit your new Vercel URL.
2.  Log in with your `APP_PASSCODE`.
3.  Add a "Person" and ensure they appear in the list.
4.  Refresh the page. If the person is still there, Supabase is working!
