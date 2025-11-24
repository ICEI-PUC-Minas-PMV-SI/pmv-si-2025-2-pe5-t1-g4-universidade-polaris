export class ILogger {
  info(message, data = {}) {
    throw new Error('Method not implemented');
  }

  warn(message, data = {}) {
    throw new Error('Method not implemented');
  }

  error(message, data = {}) {
    throw new Error('Method not implemented');
  }

  debug(message, data = {}) {
    throw new Error('Method not implemented');
  }
}

export class ConsoleLogger extends ILogger {
  constructor(enableTimestamp = true) {
    super();
    this.enableTimestamp = enableTimestamp;
  }

  _getTimestamp() {
    if (!this.enableTimestamp) return '';
    return `[${new Date().toISOString()}]`;
  }

  _formatMessage(level, message, data = {}) {
    const timestamp = this._getTimestamp();
    const dataStr = Object.keys(data).length > 0 ? ` | ${JSON.stringify(data)}` : '';
    return `${timestamp} [${level}] ${message}${dataStr}`;
  }

  info(message, data = {}) {
    console.log(this._formatMessage('INFO', message, data));
  }

  warn(message, data = {}) {
    console.warn(this._formatMessage('WARN', message, data));
  }

  error(message, data = {}) {
    console.error(this._formatMessage('ERROR', message, data));
  }

  debug(message, data = {}) {
    if (process.env.DEBUG === 'true') {
      console.debug(this._formatMessage('DEBUG', message, data));
    }
  }
}

export class SecurityLogger {
  constructor(logger = null) {
    this.logger = logger || new ConsoleLogger();
  }

  logUnauthorizedAccess(userId, action, reason, metadata = {}) {
    this.logger.warn('UNAUTHORIZED_ACCESS_ATTEMPT', {
      userId,
      action,
      reason,
      timestamp: new Date().toISOString(),
      ...metadata,
    });
  }

  logAuthenticationFailure(email, reason, metadata = {}) {
    this.logger.warn('AUTHENTICATION_FAILURE', {
      email,
      reason,
      timestamp: new Date().toISOString(),
      ...metadata,
    });
  }

  logPermissionDenied(userId, userRole, requiredRole, action, metadata = {}) {
    this.logger.warn('PERMISSION_DENIED', {
      userId,
      userRole,
      requiredRole,
      action,
      timestamp: new Date().toISOString(),
      ...metadata,
    });
  }

  logSuccessfulLogin(userId, email, metadata = {}) {
    this.logger.info('SUCCESSFUL_LOGIN', {
      userId,
      email,
      timestamp: new Date().toISOString(),
      ...metadata,
    });
  }

  logSuccessfulAction(userId, action, metadata = {}) {
    this.logger.info('SUCCESSFUL_ACTION', {
      userId,
      action,
      timestamp: new Date().toISOString(),
      ...metadata,
    });
  }
}
