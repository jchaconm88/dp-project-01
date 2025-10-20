export class AppTableDefDetail {
    constructor() {
    }

    public header!: string;

    public column!: string;

    public type?: string;

    public format?: string;

    public order!: number;

    public display!: boolean;
    
    public filter!: boolean;
    
    public separator?: string;
}