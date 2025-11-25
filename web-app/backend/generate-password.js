import bcrypt from 'bcryptjs';

bcrypt.hash("admin1234", 10).then((hash) => console.log(hash));