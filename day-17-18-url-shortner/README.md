# URL Shortener

A full-stack URL shortener built with React, Vite, Express, and MongoDB. It accepts validated long URLs, generates six-character short codes, stores them in MongoDB, and redirects visitors to the original URL while tracking clicks.

## 🎥 Demo

### Demo Video

**[▶️ Watch the Demo Video](VIDEO_URL_HERE)**

<!-- Replace VIDEO_URL_HERE with the uploaded or hosted video URL. -->

### Screenshots

<!-- Add project screenshots here. -->

## ✨ Features

- Create short URLs from valid `http://` and `https://` links
- Generate six-character short codes using Node's `crypto` module
- Display saved links in the React client
- Copy shortened URLs to the clipboard
- Open short URLs and redirect to the original long URL
- Track clicks when a short URL is opened
- Delete saved URLs
- Validate empty, invalid, and oversized URLs on the client and server
- Responsive client interface built with Tailwind CSS utility classes

## 🏗️ Architecture

```text
React + Vite client
				│
				│ /api requests through the Vite development proxy
				▼
Express server
				│
				▼
URL routes and controllers
				│
				▼
Mongoose model
				│
				▼
MongoDB
```

The client runs on Vite's development server and proxies `/api` requests to the Express server on port `3000`. The server validates requests, generates short codes, performs MongoDB operations through Mongoose, and handles short URL redirects.

## 🖥️ Client

The client is a React application created with Vite. The main interface is implemented in `client/src/app/App.jsx` and provides:

- URL creation with `react-hook-form`
- Client-side required, length, and protocol validation
- Axios calls for creating, listing, and deleting URLs
- Short URL copy actions using the browser Clipboard API
- Link listing with original URLs, short codes, and click counts
- Links to open the backend redirect route
- Responsive layouts using Tailwind CSS classes
- Lucide icons for interface actions

The Vite development proxy forwards requests beginning with `/api` to `http://localhost:3000`.

## ⚙️ Server

The server is a Node.js application using Express with ES modules. It includes:

- JSON request parsing through `express.json()`
- URL creation, listing, redirect, and deletion routes
- Server-side URL validation
- Six-character short code generation
- Redirect handling with HTTP `302`
- Click tracking through a MongoDB update when a short URL is opened
- JSON error responses using HTTP `400`, `404`, and `500` status codes where implemented

The server starts on port `3000` and connects to MongoDB before starting to listen.

## 🗄️ Database

MongoDB is accessed through Mongoose. The application uses the `urls` collection through the `UrlsModel` model.

Each URL document contains:

| Field | Type | Description |
|-------|------|-------------|
| `shortUrl` | `String` | Required six-character generated code |
| `longUrl` | `String` | Required original URL |
| `clicks` | `Number` | Number of redirect requests, defaulting to `0` |
| `createdAt` | `Date` | Added by Mongoose timestamps |
| `updatedAt` | `Date` | Added by Mongoose timestamps |

## 📡 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/urls/create` | Create a short URL or return the existing record for the same long URL |
| `GET` | `/api/urls` | Return all stored URLs and the total count |
| `DELETE` | `/api/urls/:id` | Delete a URL document by MongoDB ID |
| `GET` | `/:shortUrl` | Increment clicks and redirect to the matching long URL |

### Create a short URL

Request:

```http
POST /api/urls/create
Content-Type: application/json
```

```json
{
	"longUrl": "https://example.com"
}
```

Successful response:

```json
{
	"message": "Link created successfully.",
	"data": {
		"url": {
			"shortUrl": "aB12xY",
			"longUrl": "https://example.com",
			"clicks": 0
		}
	}
}
```

### List URLs

```http
GET /api/urls
```

The response contains a `urls` array and `urlsLength` count:

```json
{
	"message": "All urls fetched.",
	"urls": [],
	"urlsLength": 0
}
```

### Redirect

```http
GET /aB12xY
```

When the short code exists, the server returns an HTTP `302` redirect to its `longUrl` and increments `clicks`.

## 🔐 Validation & Error Handling

| Input or condition | Status | Response |
|--------------------|--------|----------|
| Empty URL | `400` | `Please enter a URL` |
| URL longer than 2048 characters | `400` | `URL is too long` |
| URL without `http://` or `https://` | `400` | `Please enter a valid URL starting with http:// or https://` |
| Unknown short URL | `404` | `Page not found.` |
| Unexpected create, list, redirect, or delete error | `500` | `Internal server error` or `Error in api` depending on the controller |

The client applies matching required, maximum-length, and protocol validation before submitting the create form. The server repeats the validation before writing to MongoDB.

## 📁 Project Structure

```text
├── client/
│   ├── src/
│   │   ├── app/
│   │   │   └── App.jsx
│   │   ├── utils/
│   │   │   └── url.util.js
│   │   ├── index.css
│   │   └── main.jsx
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── app/
│   │   └── app.js
│   ├── config/
│   │   ├── config.js
│   │   └── db.js
│   ├── controller/
│   │   └── url.controller.js
│   ├── models/
│   │   └── urls.model.js
│   ├── routes/
│   │   └── url.route.js
│   ├── utils/
│   │   └── generateCode.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- A running MongoDB instance

### 1. Clone the repository

```bash
git clone <repository-url>
cd day-17-url-shortner
```

### 2. Install client dependencies

```bash
cd client
npm install
```

### 3. Install server dependencies

Open another terminal:

```bash
cd server
npm install
```

### 4. Configure the server

Create `server/.env` with a MongoDB connection string:

```env
MONGO_URI=mongodb://localhost:27017/url
```

Make sure MongoDB is running locally before starting the server.

### 5. Start the server

From `server/`:

```bash
npm run dev
```

The Express server runs at `http://localhost:3000`.

### 6. Start the client

From `client/` in another terminal:

```bash
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

### Available client commands

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### Available server command

```bash
npm run dev
```

## 🔑 Environment Variables

The server currently requires:

```env
MONGO_URI=your_mongodb_connection_string
```

The server port is currently fixed in `server/server.js` at `3000`; there is no `PORT` environment variable in the implementation.
