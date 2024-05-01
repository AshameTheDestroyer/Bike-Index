type TheftCase = {
    id: string;
    title: string;
    status: string;
    image?: string;
    foundDate: Date;
    location: string;
    stealingDate: Date;
    description?: string;

    extraInformation?: {
        serial?: string;
        frameModel?: string;
        frameColours?: string;
        Manufacturer?: string;
    };

};