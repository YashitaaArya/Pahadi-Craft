# Pahadi Craft Backend

This backend provides a simple Express API for the admin panel.
It includes admin login, product CRUD, analytics, and basic store data.

## Run the backend

```bash
cd backend
npm install
npm start
```

The backend runs on `http://localhost:4000`.

## API base URL

`http://localhost:4000/api`

## Frontend configuration

In `Frontend/.env`, set:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

Then run frontend from the `Frontend` folder:

```bash
cd Frontend
npm run dev
```
