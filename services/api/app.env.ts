export default function setEnv() {
  process.env.SESSION_SECRET =
    '$2b$15$Bzobfwji9AwUE7tWNxw8fuWVqUVWTDRuV8OBA4kwO3gorgaQ5nH.2';

  process.env.UPLOADS_FOLDER = '../uploads';

  process.env.CORS_ORIGIN = 'http://localhost:3000';

  process.env.OPEN_API_PATH = 'api';

  process.env.APP_PORT = '5000';

  process.env.MONGODB_URL = 'mongodb://localhost:27017/marketplace';
}
