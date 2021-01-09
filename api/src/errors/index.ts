export class NotFoundError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "NotFoundError"
    }
}

export class CreateError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "CreateError"
    }
}

export class UpdateError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "UpdateError"
    }
}

export class DeleteError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "DeleteError"
    }
}

export class LoginError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "LoginError"
    }
}
