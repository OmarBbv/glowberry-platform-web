export interface TemplateField {
    name: string;
    label: string;
    type: "text" | "number" | "select";
    options?: string[];
}
