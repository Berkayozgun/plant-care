# Plant Care App

A mobile application to help you keep your plants healthy and happy.

## Features

*   **Plant-Care:** Add your plants to the app and get personalized care recommendations.
*   **Watering Reminders:** Get notified when it's time to water your plants.
*   **Plant Diary:** Keep a log of your plant's progress with photos and notes.
*   **Explore:** Discover new plants and learn how to care for them.

## Tech Stack

*   **Framework:** React Native with Expo
*   **Language:** TypeScript
*   **Routing:** Expo Router
*   **Backend:** Supabase
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
    *   In the Supabase project, go to the SQL Editor and run the schema from `schema.sql` to create the necessary tables.
    *   Get your Supabase URL and anon key from the API settings.
    *   Create a `constants/supabase.ts` file and add your credentials:
        ```typescript
        import { createClient } from '@supabase/supabase-js';

        const supabaseUrl = 'YOUR_SUPABASE_URL';
        const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

        export const supabase = createClient(supabaseUrl, supabaseAnonKey);
        ```
4.  **Run the app:**
    ```bash
    npm start
    ```
