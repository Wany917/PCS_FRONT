export interface Society {
    id: number;
    name: string;
    siren: number;
    line1?: string;
    line2?: string;
    zipCode?: string;
    city?: string;
    state?: string;
    country?: string;
    userId: number;
}