# Plant Care App

A mobile application to help you keep your plants healthy and happy.

## Features

*   **Custom Onboarding Screens:** A smooth introduction to the app with personalized content placeholders for images. Header and back button are removed for a cleaner UX. Remote image loading has been corrected.
*   **Personalized Plant Management:** Add and manage your plants with details like species, last watered date, and watering intervals. The SVG icon selection feature has been removed.
*   **Custom Tab Navigation:** Enjoy a beautifully designed bottom tab navigator with Turkish names ('Ana Sayfa', 'Keşfet', 'Profil') and updated icons (SF Symbols/MaterialIcons).
*   **User Authentication & Flow:** Clean, full-screen UI for Login, Register, and Onboarding screens. A "Giriş Yap" (Login) button is provided when a session is not found, guiding users back to the login screen.
*   **Watering Reminders:** Get notified when it's time to water your plants. (Feature planned/not fully implemented in this demo)
*   **Plant Diary:** Keep a log of your plant's progress with photos and notes. (Feature planned/not fully implemented in this demo)
*   **Explore:** Discover new plants and learn how to care for them. (Feature planned/not fully implemented in this demo)

## Current Status & Known Issues

*   **Plant Deletion:** The plant deletion feature is currently disabled due to unresolved issues. It has been removed from the UI for this demo.

## Tech Stack

*   **Framework:** React Native with Expo
*   **Language:** TypeScript
*   **Routing:** Expo Router
*   **Backend:** Supabase
*   **Icons:** MaterialIcons (Android/Web) & SF Symbols (iOS)
*   **Styling:** React Native Stylesheets

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/plant-care-app.git
    cd plant-care-app
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up Supabase:**
    *   Create a new project on [Supabase](https://supabase.com/).
    *   In the Supabase project, go to the SQL Editor and run the following SQL to create the necessary `plants` table and enable Row Level Security (RLS) for authenticated users to manage their own plants:
        ```sql
        -- Create the plants table
        create table
          public.plants (
            id uuid not null default gen_random_uuid (),
            name text not null,
            species text null,
            last_watered timestamp with time zone null,
            watering_interval integer null,
            user_id uuid not null,
            created_at timestamp with time zone not null default now(),
            constraint plants_pkey primary key (id),
            constraint plants_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
          ) tablespace pg_default;

        -- Enable Row Level Security (RLS) for the plants table
        alter table public.plants enable row level security;

        -- Create a policy to allow authenticated users to view their own plants
        create policy "Allow authenticated users to view their own plants"
          on public.plants
          for select
          to authenticated
          using (auth.uid() = user_id);

        -- Create a policy to allow authenticated users to insert their own plants
        create policy "Allow authenticated users to insert their own plants"
          on public.plants
          for insert
          to authenticated
          with check (auth.uid() = user_id);

        -- Create a policy to allow authenticated users to update their own plants
        create policy "Allow authenticated users to update their own plants"
          on public.plants
          for update
          to authenticated
          using (auth.uid() = user_id);

        -- NOTE: DELETE policy has been intentionally omitted for this demo version due to unresolved issues.
        ```
    *   Get your Supabase URL and anon key from the API settings.
    *   Update `constants/supabase.ts` with your credentials:
        ```typescript
        import { createClient } from '@supabase/supabase-js';

        export const SUPABASE_URL = 'YOUR_SUPABASE_URL';
        export const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

        export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        ```
4.  **Run the app:**
    ```bash
    npm start
    ```
