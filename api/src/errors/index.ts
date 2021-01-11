export type ErrorStructure = {error: {name: string, message: string, status: number}}

export class BaseError extends Error {
    status: number
    constructor(message: string, status: number = 500) {
        super(message)
        this.name = "BaseError"
        this.status = status
    }
    get json(): ErrorStructure {
        return {error: {name: this.name, message: this.message, status: this.status}}
    }
}

export class NotFoundError extends BaseError {
    constructor(message: string = "Not Found") {
        super(message)
        this.name = "NotFoundError"
        this.status = 404
    }
}

export class ForbiddenError extends BaseError {
    constructor(message: string = "Forbidden") {
        super(message)
        this.name = "ForbiddenError"
        this.status = 403
    }
}

export class UnauthorizedError extends BaseError {
    constructor(message: string = "Unauthorized") {
        super(message)
        this.name = "UnauthorizedError"
        this.status = 401
    }
}

export class BadRequestError extends BaseError {
    constructor(message: string = "Bad Request") {
        super(message, 500)
        this.name = "BadRequestError"
        this.status = 500
    }
}

export class CreateError extends BaseError {
    constructor(message: string) {
        super(message)
        this.name = "CreateError"
        this.status = 500
    }
}

export class UpdateError extends BaseError {
    constructor(message: string) {
        super(message)
        this.name = "UpdateError"
        this.status = 500
    }
}

export class DeleteError extends BaseError {
    constructor(message: string) {
        super(message)
        this.name = "DeleteError"
        this.status = 500
    }
}

export class LoginError extends BaseError {
    constructor(message: string) {
        super(message)
        this.name = "LoginError"
        this.status = 400
    }
}

export class RegisterError extends BaseError {
    constructor(message: string) {
        super(message)
        this.name = "RegisterError"
        this.status = 500
    }
}

export class RefreshError extends BaseError {
    constructor(message: string) {
        super(message)
        this.name = "RefreshError"
        this.status = 500
    }
}