type TheftCase = {
    id: string;
    title: string;
    status: string;
    image?: string;
    location?: string;
    stealingDate?: Date;
    description?: string;

    extraInformation?: {
        serial?: string;
        foundDate?: Date;
        frameModel?: string;
        frameColours?: string;
        Manufacturer?: string;
    };

};