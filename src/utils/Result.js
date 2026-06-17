class Result {}

export class Success extends Result {
    constructor(data) {
        super();
        this.data = data;
    }
}

export class Failure extends Result {
    constructor(errorMessage) {
        super();
        this.errorMessage = errorMessage;
    }
}