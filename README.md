# Art Talks

A gallery of artworks with a real-time discussion room for each picture.

- `node_server` – Express REST API + Socket.io chat server
- `react_client` – React (Create React App) front end

## Running locally

```bash
# terminal 1
cd node_server
npm install
npm start          # http://localhost:5000  (npm run dev for auto-reload)

# terminal 2
cd react_client
npm install
npm start          # http://localhost:3000
```

### Configuration

| Variable | Where | Default |
| --- | --- | --- |
| `PORT` | server | `5000` |
| `CLIENT_ORIGIN` | server (CORS) | `*` |
| `REACT_APP_API_URL` | client | `http://localhost:5000` |

## API

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/pictures?search=` | List pictures, optionally filtered by artist |
| GET | `/api/pictures/:id` | A single picture |
| GET | `/api/pictures/:id/messages` | Chat history for a picture |

### Socket events

| Direction | Event | Payload |
| --- | --- | --- |
| client → server | `joinPicture` | `pictureId` |
| client → server | `leavePicture` | `pictureId` |
| client → server | `newMessage` | `{ pictureId, text, author }` |
| server → client | `history` | `Message[]` (on join) |
| server → client | `newMessage` | `{ id, pictureId, author, text, timestamp }` |

Chat history is kept in memory (last 100 messages per picture) and resets when the server restarts.

## Tests

```bash
cd react_client
npm test
```
