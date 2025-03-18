# Portfolio Dashboard

This is a **Portfolio Dashboard** built with **React (Next.js), Tailwind CSS, and Recharts** to visualize sector allocation, stock holdings, and overlap analysis using a **Sankey diagram**.

## Features

- **Portfolio Composition:** Displays sector-wise allocation with a breakdown of stocks in each sector.
- **Sankey Chart (Overlap Analysis):** Visualizes fund overlaps using Recharts' Sankey component.
- **Sidebar Navigation:** Switch between different dashboard components.
- **Responsive UI:** Optimized for different screen sizes using Tailwind CSS.

## Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS, Recharts
- **State Management:** React useState, useEffect
- **Backend API:** Data is fetched from `https://stocks-backend-teal.vercel.app/`
- **Data Fetching:** Axios

## Installation & Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Run the development server:**

   ```sh
   npm run dev
   ```

4. **Open the project in your browser:**

   ```sh
   http://localhost:3000
   ```

## Future Enhancements

- Improve UI styling and animations.
- Add user authentication and data persistence.
- Expand visualization options (pie charts, line graphs, etc.).
