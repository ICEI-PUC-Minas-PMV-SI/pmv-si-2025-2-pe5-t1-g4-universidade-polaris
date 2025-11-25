import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: {
        status: 400,
        message: 'Erro de validação',
        details: errors.array().map((err) => ({
          field: err.param,
          message: err.msg,
        })),
      },
    });
  }
  next();
};

export const validateRegister = () => [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 2 })
    .withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('email')
    .isEmail()
    .withMessage('Por favor, forneça um email válido')
    .normalizeEmail(),
    //TODO: aqui poderíamos adicionar uma verificação para garantir que o email pertence a um domínio específico, se necessário
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
    //TODO: considerar adicionar requisitos adicionais de complexidade de senha
];

export const validateLogin = () => [
  body('email')
    .isEmail()
    .withMessage('Por favor, forneça um email válido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória'),
];

export const validateCreateUser = () => [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 2 })
    .withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('email')
    .isEmail()
    .withMessage('Por favor, forneça um email válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('role')
    .optional()
    .isIn(['admin', 'moderator', 'teacher', 'student'])
    .withMessage('Função deve ser uma das seguintes: admin, moderator, teacher, student'),
];
