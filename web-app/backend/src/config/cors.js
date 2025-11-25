const allowedOrigins = [
  //TODO: adicionar os domínios de produção
  'http://localhost:3000',                       
  'http://localhost:5173'                          
];

const cors_options = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Acesso bloqueado pela política de CORS da Universidade Polaris.'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  
  allowedHeaders: ['Content-Type', 'Authorization'],
  
  credentials: true, 
  
  maxAge: 86400 
}

export { cors_options };